from django.db import models
from datetime import datetime
from ..podcast.models import Tags

# Create your models here.

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    tag = models.ManyToManyField(Tags, help_text='select a tag')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_draft = models.BooleanField(default=True)

    def publish(self):
        self.is_draft = False
        self.save()

    def __str__(self):
        return self.title
