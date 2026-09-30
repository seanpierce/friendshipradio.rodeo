from datetime import datetime, timedelta

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.dispatch import receiver
from django.utils import timezone

from schedule.helpers import DURATION, TIMES


schedule_storage = FileSystemStorage(
    location=settings.SCHEDULE_UPLOAD_ROOT,
)


class Show(models.Model):
    """
    Represents a scheduled radio show.
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    title = models.CharField(
        max_length=255,
        help_text="The title of the show.",
    )

    info = models.TextField(
        blank=True,
        help_text="Optional description of the show.",
    )

    date = models.DateField(
        help_text="The date of the show.",
    )

    start_time = models.IntegerField(
        choices=TIMES,
        help_text="The time the show starts.",
    )

    duration = models.IntegerField(
        choices=DURATION,
        default=1,
        help_text="The duration of the show in hours.",
    )

    start_date_time = models.DateTimeField(
        editable=False,
    )

    end_date_time = models.DateTimeField(
        editable=False,
    )

    active = models.BooleanField(
        default=True,
        help_text="Controls whether the show appears on the schedule.",
    )

    show_image = models.ImageField(
        upload_to="shows/images/",
        max_length=500,
        blank=True,
    )

    show_flyer = models.ImageField(
        upload_to="shows/images/",
        max_length=500,
        blank=True,
    )

    pre_recorded_show = models.FileField(
        upload_to="scheduler/",
        storage=schedule_storage,
        max_length=500,
        blank=True,
        help_text=(
            "Optional pre-recorded show. Files must be MP3 format. "
            "128 kbps is recommended."
        ),
    )

    class Meta:
        ordering = ["date", "start_time"]

        constraints = [
            models.UniqueConstraint(
                fields=["date", "start_time"],
                name="unique_show_start_time",
            ),
        ]

        indexes = [
            models.Index(
                fields=[
                    "active",
                    "start_date_time",
                    "end_date_time",
                ],
                name="show_schedule_idx",
            ),
        ]

    def __str__(self):
        return f"{self.title} - {self.date}"

    def save(self, *args, **kwargs):
        self._set_schedule_datetimes()
        super().save(*args, **kwargs)

    def _set_schedule_datetimes(self):
        local_tz = timezone.get_current_timezone()

        start_naive = datetime(
            year=self.date.year,
            month=self.date.month,
            day=self.date.day,
            hour=self.start_time,
        )

        start_local = timezone.make_aware(
            start_naive,
            local_tz,
        )

        self.start_date_time = start_local
        self.end_date_time = start_local + timedelta(
            hours=self.duration,
        )

    @property
    def happening_now(self):
        if not self.start_date_time or not self.end_date_time:
            return False

        return (
            self.start_date_time
            <= timezone.now()
            < self.end_date_time
        )


@receiver(models.signals.pre_save, sender=Show)
def delete_replaced_show_files(sender, instance, **kwargs):
    """
    Delete files that have been replaced by new uploads.
    """

    if not instance.pk:
        return

    try:
        previous = Show.objects.only(
            "show_image",
            "show_flyer",
            "pre_recorded_show",
        ).get(pk=instance.pk)
    except Show.DoesNotExist:
        return

    file_fields = (
        "show_image",
        "show_flyer",
        "pre_recorded_show",
    )

    for field_name in file_fields:
        old_file = getattr(previous, field_name)
        new_file = getattr(instance, field_name)

        if old_file and old_file != new_file:
            old_file.delete(save=False)


@receiver(models.signals.post_delete, sender=Show)
def delete_show_files(sender, instance, **kwargs):
    """
    Delete files associated with a deleted Show.
    """

    for field_name in (
        "show_image",
        "show_flyer",
        "pre_recorded_show",
    ):
        file = getattr(instance, field_name)

        if file:
            file.delete(save=False)