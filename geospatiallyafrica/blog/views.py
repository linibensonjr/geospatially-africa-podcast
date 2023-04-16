from django.shortcuts import render, get_list_or_404, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
# from .models import Hosts, Tags, Episode
# from .forms import EpisodeForm
# from django.utils import timezone
# from django.http import HttpResponse
# from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.views.generic import ListView
from cloudinary.forms import cl_init_js_callbacks
from django.contrib.auth.models import User

# Create your views here.


def index(request):
    # episode = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    # paginator = Paginator(episode, 4)
    # page_number = request.GET.get('page')
    # page_obj = paginator.get_page(page_number)
    # # List all tags on sidebar
    # tags = Tags.objects.all()
    return render(request, 'base.html', )
