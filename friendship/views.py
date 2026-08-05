from django.shortcuts import render
from content.models import About


def index(request):
    about = About.objects.first()  # Get the first About object from the database
    context = {
        'about': about.info
    }
    return render(request, 'index.html', context)
