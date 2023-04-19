from django.shortcuts import render, get_list_or_404, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Blog
from datetime import datetime
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
    blog = Blog.objects.filter(created_date__lte=datetime.now()).order_by('-created_date')
    # paginator = Paginator(episode, 4)
    # page_number = request.GET.get('page')
    # page_obj = paginator.get_page(page_number)
    # # List all tags on sidebar
    # tags = Tags.objects.all()
    return render(request, 'blog.html', {'blog':blog} )

def add_blog(request):
    if request.method == 'POST':
        title = request.POST['title']
        content = request.POST['content']
        author = request.user

        # Create a new Blog object and save it to the database
        blog = Blog(title=title, content=content, author=author)
        blog.save()
        return redirect('blog')
    else:
        return render(request, 'add_blog.html')
    return render(request, 'add_blog.html')


def blog_detail(request, slug):
    blog = get_object_or_404(Blog, slug=slug)
    # other logic for rendering the blog detail page
    return render(request, 'detail.html', {'blog': blog})
