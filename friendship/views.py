from django.shortcuts import render
from content.models import About, MarqueeText


def index(request):
    about = About.objects.first()  # Get the first About object from the database
    marquee_text = MarqueeText.objects.first()  # Get the first MarqueeText object from the database
    context = {
        'about': about.info,
        'marquee_text': marquee_text.content if marquee_text else '',
    }
    return render(request, 'index.html', context)
