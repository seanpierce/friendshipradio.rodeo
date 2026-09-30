"""
Utilities for managing scheduled playback of pre-recorded shows.

Unlike the application's primary ezstream instance, which continuously
streams live programming, this module manages a separate, short-lived
ezstream process responsible for playing a scheduled recording.

The scheduler works by:

1. Looking up the current scheduled Show in the database.
2. Generating a temporary ezstream XML configuration.
3. Starting a dedicated ezstream process for that recording.
4. Tracking the process via a PID file.
5. Safely terminating any previous scheduler process before starting the next one.

This module is designed to be executed through an authenticated internal
API endpoint that is periodically invoked by cron.
"""

from datetime import timedelta
import os
import signal
import subprocess
import time
import xml.etree.ElementTree as ET
from pathlib import Path

from django.conf import settings
from django.utils import timezone

from schedule.models import Show


SCHEDULER_DIR = Path(settings.EZSTREAM_SCHEDULER_DIR)
CONFIG_PATH = SCHEDULER_DIR / "scheduler.xml"
PID_PATH = SCHEDULER_DIR / "scheduler.pid"


def get_show_for_current_hour():
    """
    Retrieves the scheduled show for the current local date and hour.
    The scheduler is invoked once per hour via an internal API call.

    Returns:
        Show | None: The matching Show instance if one exists; otherwise None.
    """

    now = timezone.localtime()

    return Show.objects.filter(
        active=True,
        date=now.date(),
        start_time=now.hour
    ).first()


def build_ezstream_config(audio_path: str):
    """
    Generates an ezstream XML configuration file for a pre-recorded show.

    The generated configuration instructs ezstream to connect to the
    configured Icecast server and stream a single audio file exactly once.
    The resulting XML is written to CONFIG_PATH and will be consumed by the
    scheduler-specific ezstream process.

    Args:
        audio_path: Relative filename of the audio file to stream.
    """

    SCHEDULER_DIR.mkdir(parents=True, exist_ok=True)

    ezstream = ET.Element("ezstream")

    servers = ET.SubElement(ezstream, "servers")
    server = ET.SubElement(servers, "server")
    ET.SubElement(server, "hostname").text = settings.EZSTREAM_HOST
    ET.SubElement(server, "port").text = str(settings.EZSTREAM_PORT)
    ET.SubElement(server, "password").text = settings.EZSTREAM_PASSWORD

    streams = ET.SubElement(ezstream, "streams")
    stream = ET.SubElement(streams, "stream")
    ET.SubElement(stream, "mountpoint").text = settings.EZSTREAM_MOUNTPOINT
    ET.SubElement(stream, "format").text = settings.EZSTREAM_FORMAT

    intakes = ET.SubElement(ezstream, "intakes")
    intake = ET.SubElement(intakes, "intake")
    ET.SubElement(intake, "filename").text = audio_path
    ET.SubElement(intake, "shuffle").text = "0"
    ET.SubElement(intake, "stream_once").text = "1"

    tree = ET.ElementTree(ezstream)
    tree.write(CONFIG_PATH, encoding="utf-8", xml_declaration=True)


def pid_matches_scheduler_process(pid: int) -> bool:
    """
    Verifies that a PID belongs to the scheduler-managed ezstream process.

    Rather than blindly terminating the process referenced in the PID file,
    this method inspects the Linux '/proc/<pid>/cmdline' entry to confirm that 
    the process is an ezstream instance started with this scheduler's configuration file.

    This prevents accidentally terminating unrelated ezstream instances, including the primary live streaming process.

    Args:
        pid: Process ID to validate.

    Returns:
        True if the PID belongs to this scheduler's ezstream process;
        otherwise False.
    """

    cmdline_path = Path(f"/proc/{pid}/cmdline")

    if not cmdline_path.exists():
        return False

    cmdline = cmdline_path.read_text(errors="ignore").replace("\x00", " ")
    return "ezstream" in cmdline and str(CONFIG_PATH) in cmdline


def stop_existing_scheduler_ezstream():
    """
    Stops the existing scheduler ezstream process, if one is running.

    The scheduler maintains a PID file containing the process ID of the
    temporary ezstream instance responsible for playing pre-recorded shows.

    Before sending any signals, the PID is validated to ensure it still belongs to the expected scheduler process. 
    A SIGTERM is sent first to allow ezstream to shut down gracefully. 
    If the process remains alive after a short delay, a SIGKILL is issued to force termination.

    The PID file is removed regardless of whether the process existed or
    was successfully terminated.
    """

    if not PID_PATH.exists():
        return

    try:
        pid = int(PID_PATH.read_text().strip())
    except ValueError:
        PID_PATH.unlink(missing_ok=True)
        return

    if not pid_matches_scheduler_process(pid):
        PID_PATH.unlink(missing_ok=True)
        return

    try:
        os.killpg(pid, signal.SIGTERM)
        time.sleep(2)

        if pid_matches_scheduler_process(pid):
            os.killpg(pid, signal.SIGKILL)

    except ProcessLookupError:
        pass
    finally:
        PID_PATH.unlink(missing_ok=True)


def start_scheduler_ezstream():
    """
    Launches a new ezstream process using the generated scheduler configuration.

    The process is started in its own session so it continues running after the Django request has completed. 
    Standard output and error are written to a dedicated log file for troubleshooting.

    The process ID is persisted to disk so that future scheduler executions can safely 
    locate and terminate this specific ezstream instance if another scheduled show is set to start before the current one finishes.
    """

    log_path = SCHEDULER_DIR / "scheduler-ezstream.log"

    process = subprocess.Popen(
        ["ezstream", "-c", str(CONFIG_PATH)],
        cwd=str(SCHEDULER_DIR),
        stdout=open(log_path, "ab"),
        stderr=subprocess.STDOUT,
        start_new_session=True,
    )

    PID_PATH.write_text(str(process.pid))


def run_pre_recorded_show_scheduler():
    """
    Executes the pre-recorded show scheduling workflow.

    The workflow performs the following steps:

    1. Locate the scheduled show for the current date and hour.
    2. Verify that a pre-recorded audio file has been assigned.
    3. Confirm that the audio file exists on disk.
    4. Stop any existing scheduler-managed ezstream process.
    5. Generate a new ezstream configuration for the scheduled audio.
    6. Launch a new ezstream process to stream the recording.

    This function is intended to be invoked by an authenticated internal API endpoint that is triggered by a scheduled cron job.

    Returns:
        dict: A status object describing whether a scheduler process was
        started successfully, along with relevant metadata or an error
        message.
    """

    show = get_show_for_current_hour()
    now = timezone.localtime()

    if not show:
        return {
            "started": False,
            "message": f"No show for current time slot: {now}",
        }

    if not show.pre_recorded_show:
        return {
            "started": False,
            "message": f"Show '{show}' has no pre-recorded audio.",
        }

    audio_path = show.pre_recorded_show.path

    if not Path(audio_path).exists():
        return {
            "started": False,
            "message": f"Audio file does not exist: {audio_path}",
        }
    
    file_name = os.path.basename(show.pre_recorded_show.name)

    stop_existing_scheduler_ezstream()

    CONFIG_PATH.unlink(missing_ok=True)
    build_ezstream_config(file_name)
    start_scheduler_ezstream()

    return {
        "started": True,
        "show_id": show.id,
        "audio": file_name,
        "config": str(CONFIG_PATH)
    }

def cleanup_old_pre_recorded_shows():
    """
    Deletes pre-recorded show audio files for shows older than one week.

    For each matching Show:
    - Confirms a pre-recorded file is assigned.
    - Deletes the file from storage.
    - Clears the FileField on the model.
    - Saves the updated Show record.
    """

    cutoff = timezone.localtime() - timedelta(days=7)

    old_shows = Show.objects.filter(
        active=True,
        pre_recorded_show__isnull=False,
        start_date_time__lt=cutoff,
    ).exclude(
        pre_recorded_show=""
    )

    deleted = []

    for show in old_shows:
        file_name = show.pre_recorded_show.name

        show.pre_recorded_show.delete(save=False)
        show.pre_recorded_show = None
        show.save(update_fields=["pre_recorded_show"])

        deleted.append({
            "show_id": show.id,
            "file": file_name,
        })

    return {
        "deleted_count": len(deleted),
        "deleted": deleted,
    }