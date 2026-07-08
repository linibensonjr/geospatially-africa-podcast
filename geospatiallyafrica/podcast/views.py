import hashlib
from django.shortcuts import render, get_list_or_404, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Hosts, Tags, Episode, Subscriber, BlogPost
from .forms import EpisodeForm, BlogPostForm
from django.utils import timezone
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.views.generic import ListView
from cloudinary.forms import cl_init_js_callbacks
from django.contrib.auth.models import User
from django.db.models import Prefetch
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.views.decorators.http import require_POST
from django.conf import settings
import requests

# Create your views here.


def index(request):
    now = timezone.now()
    published = Episode.objects.filter(published_date__lte=now).order_by('-published_date')
    episodes = published[:4]
    latest_videos = published.exclude(youtube__isnull=True).exclude(youtube='')[:2]
    tags = Tags.objects.all()
    return render(request, 'podcast/index.html', {
        'episodes': episodes,
        'latest_videos': latest_videos,
        'tags': tags,
    })

def episode_list(request):
    episodes_tags = Episode.objects.prefetch_related('tags').all()
    # Adjust the related name: use 'tags' or 'tag_set' depending on your model
    tags = Tags.objects.filter(episode__in=episodes_tags).distinct()
    episode = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    return render(request, 'podcast/episodes.html', {'episodes': episode, 'tags': tags})


def episode_detail(request, slug):
    episode = get_list_or_404(Episode, slug=slug)
    episodes = Episode.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')[:3]
    sidebar_eps = Episode.objects.all()[:6]
    episodes_tags = Episode.objects.prefetch_related('tags').all()
    host = Hosts.objects.all()
    tags = Tags.objects.filter(episode__in=episodes_tags).distinct()
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
    context_object_name = 'search_list'
    
    def get_queryset(self):
        query = self.request.GET.get("q")
        if not query:
            return Episode.objects.none()

        return Episode.objects.filter(
            published_date__isnull=False
        ).filter(
            Q(title__icontains=query) | Q(description__icontains=query)
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['query'] = self.request.GET.get("q", "")
        return context

    template_name = 'podcast/search.html'

def blog(request):
    posts = BlogPost.objects.filter(published_date__isnull=False)
    featured_post = posts.first()
    other_posts = posts[1:] if featured_post else posts
    return render(request, 'podcast/blog/blog.html', {
        'featured_post': featured_post,
        'other_posts': other_posts,
    })


def blog_detail(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    recent_posts = BlogPost.objects.filter(published_date__isnull=False).exclude(slug=slug)[:3]
    return render(request, 'podcast/blog/blog_detail.html', {'post': post, 'recent_posts': recent_posts})


@login_required
def new_blog(request):
    if request.method == 'POST':
        form = BlogPostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect('blog_detail', slug=post.slug)
    else:
        form = BlogPostForm()
    return render(request, 'podcast/blog/blog_form.html', {'form': form, 'is_new': True})


@login_required
def blog_edit(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    if request.method == 'POST':
        form = BlogPostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect('blog_detail', slug=post.slug)
    else:
        form = BlogPostForm(instance=post)
    return render(request, 'podcast/blog/blog_form.html', {'form': form, 'is_new': False, 'post': post})


@login_required
def blog_publish(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    post.publish()
    return redirect('blog_detail', slug=slug)


@login_required
def blog_delete(request, slug):
    BlogPost.objects.filter(slug=slug).delete()
    return redirect('blog')


def about_us(request):
    published = Episode.objects.filter(published_date__isnull=False)
    epi_count = published.count()
    season_count = published.exclude(season__isnull=True).values('season').distinct().count()
    guest_count = published.exclude(guest='').values('guest').distinct().count()

    hosts = []
    for host in Hosts.objects.all():
        episodes_hosted = published.filter(
            Q(host=host.name) | Q(cohost=host.name)
        ).order_by('-published_date')[:3]
        hosts.append({'host': host, 'episodes': episodes_hosted})

    context = {
        'count': epi_count,
        'season_count': season_count,
        'guest_count': guest_count,
        'hosts': hosts,
    }
    return render(request, 'podcast/about.html', context)

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


@require_POST
def newsletter_subscribe(request):
    if request.POST.get('website'):
        return JsonResponse({'ok': True, 'message': 'Thanks for subscribing!'})

    email = request.POST.get('email', '').strip()
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({'ok': False, 'message': 'Please enter a valid email address.'})

    Subscriber.objects.get_or_create(email=email)

    if settings.MAILCHIMP_API_KEY and settings.MAILCHIMP_SERVER_PREFIX and settings.MAILCHIMP_LIST_ID:
        try:
            member_hash = hashlib.md5(email.lower().encode()).hexdigest()
            url = (
                f'https://{settings.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/'
                f'lists/{settings.MAILCHIMP_LIST_ID}/members/{member_hash}'
            )
            requests.put(
                url,
                auth=('anystring', settings.MAILCHIMP_API_KEY),
                json={'email_address': email, 'status_if_new': 'subscribed'},
                timeout=5,
            )
        except requests.RequestException:
            pass

    return JsonResponse({'ok': True, 'message': "You're subscribed! Check your inbox."})