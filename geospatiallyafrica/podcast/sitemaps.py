from django.contrib.sitemaps import Sitemap
from django.shortcuts import reverse

class StaticViewSitemap(Sitemap):

    def items(self):
        return ['home', 'episode_list', 'about_us']

    def location(self, item):
        return reverse(item)

