from pyexpat import model
from .models import Blog, BlogTags
from django.contrib import admin


class BlogList(admin.ModelAdmin):
    list_display = ('title', 'slug', 'author', 'is_draft',)

admin.site.register(BlogTags)

admin.site.register(Blog, BlogList)

