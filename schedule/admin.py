from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html

from schedule.helpers import TIMES

from .models import Show
from .show_filter import ShowFilter


@admin.register(Show)
class ShowAdmin(admin.ModelAdmin):
    search_fields = ["title", "info"]
    list_filter = [ShowFilter, "active"]
    list_display = [
        "title",
        "date",
        "start_time",
        "get_formatted_end_time",
        "image_tag",
    ]
    actions = [
        "mark_shows_active",
        "mark_shows_inactive",
    ]

    date_hierarchy = "date"
    readonly_fields = ["image_tag"]

    @admin.action(description="Mark selected shows as active")
    def mark_shows_active(self, request, queryset):
        queryset.update(active=True)

    @admin.action(description="Mark selected shows as inactive")
    def mark_shows_inactive(self, request, queryset):
        queryset.update(active=False)

    @admin.display(description="End Time")
    def get_formatted_end_time(self, obj):
        """
        Return the show's end time formatted using the TIMES choices.
        """

        if not obj.end_date_time:
            return None

        end_time = timezone.localtime(obj.end_date_time)

        return dict(TIMES).get(
            end_time.hour,
            end_time.strftime("%-I %p"),
        )

    @admin.display(description="Image")
    def image_tag(self, obj):
        """
        Display a clickable preview of the show's image.
        """

        if not obj.show_image:
            return "No image available"

        return format_html(
            '<img src="{}" '
            'onclick="window.open(\'{}\', \'_blank\')" '
            'style="cursor:pointer;max-height:150px;max-width:150px;" />',
            obj.show_image.url,
            obj.show_image.url,
        )