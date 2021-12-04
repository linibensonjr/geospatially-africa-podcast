import podcast
from django.shortcuts import render, get_list_or_404, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Episode
from .forms import EpisodeForm
from django.utils import timezone
from django.http import HttpResponse
from django.core.paginator import Paginator

# Create your views here.

def index(request):
    episode = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    paginator = Paginator(episode, 3)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'podcast/index.html', {'episodes': page_obj})

def episode_list(request):
    episode = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    return render(request, 'podcast/episodes.html', {'episodes': episode})


def episode_detail(request, pk):
    episode = get_list_or_404(Episode, pk=pk)
    return render(request, 'podcast/episode_detail.html', {'episode': episode})

@login_required
def new_episode(request):
     if request.method == "POST":
        form = EpisodeForm(request.POST)
        if form.is_valid():
            episode = form.save(commit=False)
            episode.author = request.user
            # episode.published_date = timezone.now()
            episode.save()
            return redirect('episode_detail', pk=episode.pk)
     else:
        form = EpisodeForm()
     return render(request, 'podcast/add_episode.html', {'form': form})

@login_required
def episode_edit(request, pk):
    episode = get_object_or_404(Episode, pk=pk)
    if request.method == "POST":
       form = EpisodeForm(request.POST, instance=episode)
       if form.is_valid():
           episode = form.save(commit=False)
           episode.author = request.user
        #    episode.published_date = timezone.now()
           episode.save()
           return redirect('episode_detail', pk=episode.pk)
    else:
       form = EpisodeForm(instance=episode)
    return render(request, 'podcast/add_episode.html', {'form': form})


def episode_draft_list(request):
    episodes = Episode.objects.filter(published_date__isnull=True).order_by('created_date')
    return render(request, 'podcast/episode_draft_list.html', {'episodes': episodes})


def episode_publish(request, pk):
    episode = get_object_or_404(Episode, pk=pk)
    episode.publish()
    return redirect('episode_detail', pk=pk)



def listing(request):
    contact_list = Contact.objects.all()
     # Show 25 contacts per page.

    
    return render(request, 'list.html', {'page_obj': page_obj})

def news(request):
    return render(request, 'podcast/news.html')


def about_us(request):
    return render(request, 'podcast/about.html')