from django.db import models


class DonateText(models.Model):
    id = models.AutoField(primary_key=True)
    content = models.CharField(max_length=500, null=True, blank=True, help_text='Content that is populated in the donation context area of the site.')
    
    class Meta:
        verbose_name_plural = "Donate Text"

    def __str__(self):
        return 'Donate Text'