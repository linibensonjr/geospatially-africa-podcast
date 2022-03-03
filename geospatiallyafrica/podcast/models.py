from pyexpat import model
from tabnanny import verbose
from django.db import models
from django.conf import settings
from datetime import datetime, timezone

from autoslug import AutoSlugField
from ckeditor.fields import RichTextField

# Create your models here.

class Episode(models.Model):
    season = models.IntegerField(null=True)
    episode = models.IntegerField(null=True)
    tags = models.CharField(max_length=100)
    hosts = [
        ('Iniobong Benson', 'Iniobong'),
        ('Opeyemi Kazeem-Jimoh', 'Opeyemi')

    ]

    host = models.CharField(max_length=500, choices=hosts)
    guest = models.CharField(max_length=200)
    guest_bio = models.CharField(max_length=1000, default='This is the guest bio')
    title = models.CharField(max_length=200)
    link = models.CharField(max_length=1500)
    summary = models.CharField(max_length=1500)
    description = RichTextField()
    slug = AutoSlugField(populate_from='title', default='slug')
    #episodeimage = models.CharField(max_length=200, null=True)
    episodepic = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to = 'img/', default='ope_lau.jpg')
    created_date = models.DateTimeField(default=datetime.now)
    published_date = models.DateTimeField(blank=True, null=True,)
    date_published = models.DateTimeField()

    

    def publish(self):
        self.published_date = datetime.now()
        self.save()

    def __str__(self):
        return self.title

class Hosts(models.Model):
    name = models.CharField(max_length=255)
    bio = RichTextField()
    
    class Meta:
        verbose_name_plural = 'Hosts'

    def __str__(self):
        return self.name