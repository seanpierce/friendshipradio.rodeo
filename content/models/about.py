from tinymce.models import HTMLField
from django.db import models


class About(models.Model):
    id = models.AutoField(primary_key=True)
    info = HTMLField(null=True, blank=True, help_text='Content that will be displayed in the info section of the website')

    class Meta:
        verbose_name_plural = 'Info / About'

    def __str__(self):
        return 'Info / About'