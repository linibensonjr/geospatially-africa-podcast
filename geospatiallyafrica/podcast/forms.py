from django import forms
from .models import Episode
from django.forms import ModelForm

class EpisodeForm(forms.ModelForm):
    class Meta:
        model = Episode
        fields = "__all__"
        #['season', 'episode', 'tags', 'host', 'guest', 'title', 'link', 'description']
