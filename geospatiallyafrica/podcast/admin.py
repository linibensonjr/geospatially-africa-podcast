from podcast.models import Episode, Hosts, Tags, Subscriber, BlogPost
from django.contrib import admin

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
    list_display = ('name', 'location', 'bio')
    #inlines = [EpisodeInline]

admin.site.register(Hosts, HostList)

admin.site.register(Tags)

class SubscriberList(admin.ModelAdmin):
    list_display = ('email', 'created_at', 'is_active')
    search_fields = ('email',)

admin.site.register(Subscriber, SubscriberList)

class BlogPostList(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'published_date')
    search_fields = ('title', 'category')

admin.site.register(BlogPost, BlogPostList)

