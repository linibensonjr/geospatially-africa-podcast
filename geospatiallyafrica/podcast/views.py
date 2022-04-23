from multiprocessing import context
import podcast
from django.shortcuts import render, get_list_or_404, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Hosts, Tags, Episode
from .forms import EpisodeForm
from django.utils import timezone
from django.http import HttpResponse
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.views.generic import ListView

# Create your views here.

def index(request):
    episode = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    paginator = Paginator(episode, 4)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    #List all tags on sidebar
    tags = Tags.objects.all()
    return render(request, 'podcast/index.html', {'episodes': page_obj, 'tags':tags})

def episode_list(request):
    episode = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    return render(request, 'podcast/episodes.html', {'episodes': episode})


def episode_detail(request, pk):
    episode = get_list_or_404(Episode, pk=pk)
    episodes = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')[:3]
    sidebar_eps = Episode.objects.all()
    host = Hosts.objects.all()
    # article = get_object_or_404(Episode, pk=pk)
    # try:
    #     next_ep = episode.get_next_by_date_published()
    # except Episode.DoesNotExist:
    #     next_ep = None

    # try:
    #     previous_ep = episode.get_previous_by_date_published()
    # except Episode.DoesNotExist:
    #     previous_ep = None
    tags = Tags.objects.all()
    context = {'episode': episode, 'episodes':episodes, 'sidebar_eps':sidebar_eps, 'host':host, 'tags':tags}
    return render(request, 'podcast/episode_detail.html', context)

# def next_episode(request, pk):
#     episodes = get_list_or_404(Episode, pk=pk)
#     # episodes = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')[:3]

#     # try:
#     #     next_ep = episodes.get_next_by_published_date()
#     # except Episode.DoesNotExist:
#     #     next_ep = None

#     # try:
#     #     previous_ep = episodes.get_previous_by_published_date()
#     # except Episode.DoesNotExist:
#     #     previous_ep = None

#     context = {'episodes':episodes, 'next_ep':next_ep, 'previous_ep':previous_ep}
#     return render(request, 'podcast/episode_detail.html', context)


@login_required
def new_episode(request):
     if request.method == "POST":
        form = EpisodeForm(request.POST, request.FILES)
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

@login_required
def episode_draft_list(request):
    episodes = Episode.objects.filter(published_date__isnull=True).order_by('created_date')
    return render(request, 'podcast/episode_draft_list.html', {'episodes': episodes})

@login_required
def episode_publish(request, pk):
    episode = get_object_or_404(Episode, pk=pk)
    episode.publish()
    return redirect('episode_detail', pk=pk)


def loginView(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        host = authenticate(request, username=username, password=password)
        if host is None:
            context = {'error': 'Invalid username or password'}
            return render(request, "registration/login.html", context)
        login(request, host)
        return redirect('/')
    return render(request, "registration/login.html")

def logoutView(request):
    logout(request)
    return redirect("/")


def listing(request):
    tag_f = Episode.objects.filter(tag = '5')
    context = {'tags': tag_f}
    return render(request, 'podcast/tags.html', context)

    
    #return render(request, 'list.html', {'page_obj': page_obj})

class SearchResultView(ListView):
    model = Episode

    def get_context_data(self, **kwargs):
        context = super(SearchResultView, self).get_context_data(**kwargs)
        return context

    def get_queryset(self):
        query = self.request.GET.get("q")
        search_list = Episode.objects.filter(title__icontains=query)
        return search_list

    template_name = 'podcast/search.html'

def news(request):
    return render(request, 'podcast/news.html')


def about_us(request):
    return render(request, 'podcast/about.html')

def support(request):
    return render(request, 'podcast/support.html')

def page_not_found(request, exception=None):
    data = {}
    return render(request, 'podcast/404.html', data)

def server_error(request, exception=None):
    data = {}
    return render(request, 'podcast/500.html', data)