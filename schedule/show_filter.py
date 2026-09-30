from django.contrib import admin
from django.utils import timezone
from django.utils.encoding import force_str


class ShowFilter(admin.SimpleListFilter):
    """
    Filter shows by whether they are upcoming or have already aired.
    """

    title = "Upcoming"
    parameter_name = "upcoming"

    UPCOMING = "upcoming"
    PAST = "past"

    def lookups(self, request, model_admin):
        """
        Return the available filter options.
        """

        return (
            (self.UPCOMING, "Upcoming"),
            (self.PAST, "Past"),
        )

    def queryset(self, request, queryset):
        """
        Filter shows based on whether they have finished airing.

        Upcoming is the default view.
        """

        now = timezone.now()
        value = self.value()

        if value is None:
            value = self.UPCOMING

        if value == self.UPCOMING:
            return queryset.filter(
                end_date_time__gte=now,
            )

        if value == self.PAST:
            return queryset.filter(
                end_date_time__lt=now,
            ).order_by(
                "-date",
                "-start_date_time",
            )

        return queryset

    def choices(self, changelist):
        """
        Return filter choices without Django's default "All" option.
        """

        current_value = self.value() or self.UPCOMING

        for lookup, title in self.lookup_choices:
            yield {
                "selected": current_value == force_str(lookup),
                "query_string": changelist.get_query_string(
                    {self.parameter_name: lookup},
                    [],
                ),
                "display": title,
            }