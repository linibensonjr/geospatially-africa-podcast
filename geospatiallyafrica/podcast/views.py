from django.shortcuts import render, get_list_or_404, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Hosts, Tags, Episode
from .forms import EpisodeForm
from django.utils import timezone
from django.http import HttpResponse
from django.core.paginator import Paginator
from django.contrib.auth import authenticate, login, logout
from django.views.generic import ListView
from cloudinary.forms import cl_init_js_callbacks
from django.contrib.auth.models import User

# Create your views here.


def index(request):
    episode = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    paginator = Paginator(episode, 4)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    # List all tags on sidebar
    tags = Tags.objects.all()
    return render(request, 'podcast/index.html', {'episodes': page_obj, 'tags':tags})

def episode_list(request):
    episode = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    return render(request, 'podcast/episodes.html', {'episodes': episode})


def episode_detail(request, slug):
    episode = get_list_or_404(Episode, slug=slug)
    episodes = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')[:3]
    sidebar_eps = Episode.objects.all()[:6]
    print(sidebar_eps)
    host = Hosts.objects.all()
    tags = Tags.objects.all()
    context = {'episode': episode, 'episodes':episodes, 'sidebar_eps':sidebar_eps, 'host':host, 'tags':tags}
    return render(request, 'podcast/episode_detail.html', context)

def redirect_id(request, pk):
    try:
        obj = Episode.objects.get(id=pk)

        return redirect('episode_detail', slug=obj.slug, permanent=True)
    except:
        return redirect ('episode_list')

@login_required
def new_episode(request):
     if request.method == "POST":
        form = EpisodeForm(request.POST, request.FILES)
        if form.is_valid():
            episode = form.save(commit=False)
            episode.author = request.user
            # episode.published_date = timezone.now()
            episode.save()
            form.save_m2m()
            return redirect('episode_detail', slug=episode.slug)
     else:
        form = EpisodeForm()
     return render(request, 'podcast/add_episode.html', {'form': form})

@login_required
def episode_edit(request, slug):
    episode = get_object_or_404(Episode, slug=slug)
    if request.method == "POST":
       form = EpisodeForm(request.POST, request.FILES, instance=episode)
       if form.is_valid():
           episode = form.save(commit=False)
           episode.author = request.user
        #    episode.published_date = timezone.now()
           episode.save()
           form.save_m2m()
           return redirect('episode_detail', slug=episode.slug)
    else:
       form = EpisodeForm(instance=episode)
    return render(request, 'podcast/add_episode.html', {'form': form})

@login_required
def episode_delete(request, slug):
    episode = Episode.objects.filter(slug=slug)
    episode.delete()
    return redirect('episode_list')

@login_required
def episode_draft_list(request):
    episodes = Episode.objects.filter(published_date__isnull=True).order_by('created_date')
    return render(request, 'podcast/episode_draft_list.html', {'episodes': episodes})

@login_required
def episode_publish(request, slug):
    episode = get_object_or_404(Episode, slug=slug)
    episode.publish()
    return redirect('episode_detail', slug=slug)


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

def tags(request):
    template_name = 'podcast/tags.html'
    tag = request.GET.get("tag")
    try:
        print('Request Tag:', tag)
        tag_list = Tags.objects.filter(tags__icontains=tag)
        print('Tag list', tag_list)
        tag_id = tag_list[0]
        print('Tag ID:', tag_id)
        episode_list = Episode.objects.filter(tag=tag_id)
        print(episode_list)
        context = {'tag_list':tag_list, 'tag':tag, 'episode_list':episode_list}
        return render(request, template_name, context)
    except IndexError as e:
        return redirect('/episodes')

    

class SearchResultView(ListView):
    model = Episode
    
    def get_queryset(self):
        query = self.request.GET.get("q")
        search_list = Episode.objects.filter(Q(title__icontains=query) & Q(published_date__isnull=False) | Q(description__icontains=query) & Q(published_date__isnull=False))
        context = {'search_list':search_list, 'query':query}
        return search_list

    template_name = 'podcast/search.html'

def blog(request):
    return render(request, 'podcast/blog/blog.html')


def about_us(request):
    epi_count = len(Episode.objects.all())
    return render(request, 'podcast/about.html', {'count': epi_count})

def support(request):
    return render(request, 'podcast/support.html')

def guests(request):
    return render(request, 'podcast/forms.html')

def page_not_found(request, exception=None):
    data = {}
    return render(request, 'podcast/error/404.html', data)

def server_error(request, exception=None):
    data = {}
    return render(request, 'podcast/error/500.html', data)