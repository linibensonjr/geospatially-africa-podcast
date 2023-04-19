from django.db import models
from autoslug import AutoSlugField
from ckeditor.fields import RichTextField


# Create your models here.
class BlogTags(models.Model):
    tags = models.CharField(max_length=30, help_text='Enter a tag')

    class Meta:
        verbose_name_plural = 'BlogTags'

    def __str__(self):
        return self.tags
class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = RichTextField()
    author = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    slug = AutoSlugField(populate_from='title', unique=True)
    tag = models.ManyToManyField(BlogTags, help_text='select a tag')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_draft = models.BooleanField(default=True)

    def publish(self):
        self.is_draft = False
        self.save()

    def __str__(self):
        return self.title
