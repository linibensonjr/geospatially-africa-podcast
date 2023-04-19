from django.db import models
from datetime import datetime
from django.urls import reverse
from autoslug import AutoSlugField
from ckeditor.fields import RichTextField


# Create your models here.

class Tags(models.Model):
    tags = models.CharField(max_length=30, help_text='Enter a tag')

    class Meta:
        verbose_name_plural = 'Tags'

    def __str__(self):
        return self.tags


class Episode(models.Model):
    season = models.IntegerField(null=True)
    episode = models.IntegerField(null=True)
    title = models.CharField(max_length=200)
    link = models.CharField(max_length=1500, help_text='Provide embed link to episode audio')
    googlepodcast = models.CharField(max_length=1500,
                                     default='https://podcasts.google.com/feed/aHR0cHM6Ly9hbmNob3IuZm0vcy80ZDg4MWJhMC9wb2RjYXN0L3Jzcw?sa=X&ved=2ahUKEwjFxoL134D7AhUugc4BHXz1BeQQ9sEGegQIARAC',
                                     help_text='Provide link to episode on Google Podcasts')
    applepodcast = models.CharField(max_length=1500,
                                    default='https://podcasts.apple.com/us/podcast/geospatially-africa-podcast-the-podcast-for/id1561204113',
                                    help_text='Provide link to episode on Apple Podcasts')
    spotify = models.CharField(max_length=1500,
                               default='https://open.spotify.com/show/7aqyurtRoF42hTysOqNa9v?si=9779d6cefca74f82',
                               help_text='Provide link to episode on Spotify')
    summary = models.CharField(max_length=1500)
    description = RichTextField()
    tag = models.ManyToManyField(Tags, help_text='select a tag')

    hosts = [
        ('Iniobong Benson', 'Iniobong'),
        ('Opeyemi Kazeem-Jimoh', 'Opeyemi')
    ]

    host = models.CharField(max_length=500, choices=hosts)
    cohost = models.CharField(max_length=500, choices=hosts, null=True, blank=True)
    guest = models.CharField(max_length=200)
    guest_bio = models.CharField(max_length=1000, default='This is the guest bio')
    guest_image = models.ImageField(upload_to='guest_image', blank=True)
    slug = AutoSlugField(populate_from='title', default='slug', unique=True)
    episode_image = models.ImageField(upload_to='podcast_art/', blank=True)
    created_date = models.DateTimeField(default=datetime.now)
    published_date = models.DateTimeField(blank=True, null=True, )

    # date_published = models.DateTimeField(blank=True)

    def publish(self):
        self.published_date = datetime.now()
        self.save()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("episode_detail", kwargs={"pk": self.id})


class Hosts(models.Model):
    name = models.CharField(max_length=255)
    bio = RichTextField()

    class Meta:
        verbose_name_plural = 'Hosts'

    def __str__(self):
        return self.name