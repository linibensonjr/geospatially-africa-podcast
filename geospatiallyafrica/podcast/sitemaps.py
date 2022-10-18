from django.contrib.sitemaps import Sitemap
from django.shortcuts import reverse
from .models import Episode


class EpisodeSitemap(Sitemap):

    changefreq = "weekly"
    priority = 0.5

    def items(self):
        return Episode.objects.all()

    def lastmod(self, obj):
        return obj.published_date
