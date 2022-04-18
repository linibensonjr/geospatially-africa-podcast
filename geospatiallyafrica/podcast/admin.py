from pyexpat import model
from podcast.models import Episode, Hosts, Tags
from django.contrib import admin
from .models import Episode

class TagInline(admin.TabularInline):
    model = Tags

class EpisodeList(admin.ModelAdmin):
    list_display = ('title', 'season', 'episode', 'host', 'guest', 'published_date')
   # inlines = [TagInline]

admin.site.register(Episode, EpisodeList)

class EpisodeInline(admin.TabularInline):
    model = Episode
    extra = 0

class HostList(admin.ModelAdmin):
    list_display = ('name', 'bio')
    #inlines = [EpisodeInline]

admin.site.register(Hosts, HostList)

admin.site.register(Tags)

