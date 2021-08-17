import podcast
from django.shortcuts import render
from .models import Episode
from django.utils import timezone
from django.http import HttpResponse

# Create your views here.

def home_page(request):
    episodes = Episode.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
    return render(request, 'podcast/index.html', {'episodes': episodes})
