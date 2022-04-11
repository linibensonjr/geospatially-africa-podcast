from podcast.models import Episode, Hosts, Tags
from django.contrib import admin
from .models import Episode

# Register your models here.
class EpisodeList(admin.ModelAdmin):
    list_display = ('title', 'season', 'episode', 'host', 'guest', 'tags', 'published_date')

admin.site.register(Episode, EpisodeList)

admin.site.register(Hosts)
admin.site.register(Tags)

