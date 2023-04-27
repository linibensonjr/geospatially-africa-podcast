from django import forms
from .models import Episode
from django.forms import ModelForm
from tinymce.widgets import TinyMCE


class EpisodeForm(forms.ModelForm):
    description = forms.CharField(
        widget=TinyMCE(
            attrs={'cols': 80, 'rows': 30})
    )
    class Meta:
        model = Episode
        fields = "__all__"
        #['season', 'episode', 'tags', 'host', 'guest', 'title', 'link', 'description']
