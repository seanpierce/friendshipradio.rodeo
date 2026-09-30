from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    throttle_classes,
)
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from api.authentication import InternalAPIKeyAuthentication
from schedule.services.ezstream_scheduler import cleanup_old_pre_recorded_shows, run_pre_recorded_show_scheduler


@api_view(["POST"])
@authentication_classes([InternalAPIKeyAuthentication])
@throttle_classes([AnonRateThrottle])
def initiate_show(request):
    """
    Checks for a show that is scheduled to begin at this time. 
    If one exists, recreate the schedule show XMl config file for the "/schedule" icecast mountpoint. 
    """
    result = run_pre_recorded_show_scheduler()

    if result["started"]:
        return Response(result, status=status.HTTP_200_OK)

    return Response(result, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([InternalAPIKeyAuthentication])
@throttle_classes([AnonRateThrottle])
def cleanup_pre_recorded_shows(request):
    """
    Deletes pre-recorded show audio files for shows older than one week. This is a maintenance task that is periodically invoked by cron.
    """
    result = cleanup_old_pre_recorded_shows()
    return Response(result)