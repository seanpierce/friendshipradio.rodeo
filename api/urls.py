from django.urls import path
from .views.schedule import cleanup_pre_recorded_shows, initiate_show

urlpatterns = [
    path('schedule/initiate-show/', initiate_show, name='initiate_show'),
    path("schedule/cleanup-pre-recorded-shows/", cleanup_pre_recorded_shows, name='cleanup_pre_recorded_shows')
]