from email.policy import default
from pyexpat import model
from tabnanny import verbose
from django.db import models
from django.conf import settings
from datetime import datetime, timezone
from django.urls import reverse
from autoslug import AutoSlugField
from ckeditor.fields import RichTextField
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
    
    hosts = [
        ('Iniobong Benson', 'Iniobong'),
        ('Opeyemi Kazeem-Jimoh', 'Opeyemi')
    ]

    tag = models.ManyToManyField(Tags, help_text='select a tag')
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
    guest_image = CloudinaryField('image', default='')

    

    def publish(self):
        self.published_date = datetime.now()
        self.save()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("episode_detail", kwargs={"slug": self.slug})
    

class Hosts(models.Model):
    name = models.CharField(max_length=255)
    bio = RichTextField()
    
    class Meta:
        verbose_name_plural = 'Hosts'

    def __str__(self):
        return self.name

