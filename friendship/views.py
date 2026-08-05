from django.shortcuts import render
from content.models import About, MarqueeText, DonateText


def index(request):
    about = About.objects.first()  # Get the first About object from the database
    marquee_text = MarqueeText.objects.first()  # Get the first MarqueeText object from the database
    donate_text = DonateText.objects.first()  # Get the first DonateText object from the database
    context = {
        'about': about.info if about else '',
        'marquee_text': marquee_text.content if marquee_text else '',
        'donate_text': donate_text.content if donate_text else '',
    }
    return render(request, 'index.html', context)
