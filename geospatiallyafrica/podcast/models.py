from django.db import models
from django.conf import settings
from datetime import datetime, timezone
from django.urls import reverse
from autoslug import AutoSlugField
from cloudinary.models import CloudinaryField

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
    applepodcast = models.CharField(max_length=1500, default='https://podcasts.apple.com/us/podcast/geospatially-africa-podcast-the-podcast-for/id1561204113', help_text='Provide link to episode on Apple Podcasts')
    youtube = models.URLField(max_length=1500, blank=True, null=True, help_text='Link to episode on YouTube')
    spotify = models.CharField(max_length=1500, default='https://open.spotify.com/show/7aqyurtRoF42hTysOqNa9v?si=9779d6cefca74f82', help_text='Provide link to episode on Spotify')
    summary = models.CharField(max_length=1500)
    description = models.TextField()
    tag = models.ManyToManyField(Tags, help_text='select a tag')
    
    hosts = [
        ('Iniobong Benson', 'Iniobong'),
        ('Opeyemi Kazeem-Jimoh', 'Opeyemi'),
        ('David Udoh', 'David')
    ]

    host = models.CharField(max_length=500, choices=hosts)
    cohost = models.CharField(max_length=500, choices=hosts, null=True, blank=True)
    guest = models.CharField(max_length=200)
    guest_bio = models.CharField(max_length=1000, default='This is the guest bio')
    guest_image = models.ImageField(upload_to = 'guest_image', blank=True)
    slug = AutoSlugField(populate_from='title', unique=True)
    episode_image = models.ImageField(upload_to = 'podcast_art/', blank=True)
    created_date = models.DateTimeField(default=datetime.now)
    published_date = models.DateTimeField(blank=True, null=True,)
    # date_published = models.DateTimeField(blank=True)
    chapters = models.TextField(blank=True, null=True, help_text='One per line: 00:00 Segment title')
    links_mentioned = models.TextField(blank=True, null=True, help_text='One per line: Label | https://url')


    def publish(self):
        self.published_date = datetime.now()
        self.save()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("episode_detail", kwargs={"pk": self.id})
    

class Hosts(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField()
    image = models.ImageField(upload_to='host_image', blank=True)
    location = models.CharField(max_length=255, blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)

    class Meta:
        verbose_name_plural = 'Hosts'

    def __str__(self):
        return self.name


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.email

