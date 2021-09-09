from django.db import models
from django.conf import settings
from datetime import datetime, timezone

# Create your models here.

class Episode(models.Model):
    season = models.IntegerField(null=True)
    episode = models.IntegerField(null=True)
    tags = models.CharField(max_length=100)
    host = models.CharField(max_length=500)
    guest = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    link = models.URLField(max_length=300)
    summary = models.CharField(max_length=300)
    description = models.TextField()
    created_date = models.DateTimeField(default=datetime.now)
    published_date = models.DateTimeField(blank=True, null=True)


    def publish(self):
        self.published_date = datetime.now()
        self.save()

    def __str__(self):
        return self.title
