from django.db import models


class MarqueeText(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.CharField(max_length=500, null=True, blank=True, help_text='Content that is populated in the marquee')
    active = models.BooleanField(default=True, help_text='Indicates whether or not the content will show on the marquee')

    class Meta:
        verbose_name_plural = "Marquee Text"

    def __str__(self):
        return 'Marquee Text'