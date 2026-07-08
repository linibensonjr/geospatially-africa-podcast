from django import forms
from django.forms import ModelForm
from tinymce.widgets import TinyMCE
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Fieldset, Row, Column, HTML

from .models import Episode, BlogPost


class EpisodeForm(forms.ModelForm):
    description = forms.CharField(
        widget=TinyMCE(attrs={'cols': 80, 'rows': 30}),
        help_text='The full show notes for this episode.'
    )

    class Meta:
        model = Episode
        fields = [
            'title', 'tag', 'season', 'episode', 'published_date',
            'host', 'cohost', 'guest', 'guest_bio', 'guest_image',
            'link', 'applepodcast', 'spotify', 'youtube',
            'summary', 'description',
            'chapters', 'links_mentioned', 'episode_image',
        ]
        widgets = {
            'published_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['published_date'].input_formats = ['%Y-%m-%dT%H:%M']
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Fieldset(
                'Basics',
                'title', 'tag',
                Row(Column('season'), Column('episode'), Column('published_date')),
            ),
            Fieldset(
                'Hosts & guest',
                Row(Column('host'), Column('cohost')),
                Row(Column('guest'), Column('guest_image')),
                'guest_bio',
            ),
            Fieldset(
                'Listen links',
                'link',
                Row(Column('applepodcast'), Column('spotify')),
                'youtube',
            ),
            Fieldset(
                'Show notes',
                'summary', 'description',
            ),
            Fieldset(
                'Extras',
                HTML('<p class="form-section-hint">Optional — leave blank to hide these sections on the episode page.</p>'),
                'chapters', 'links_mentioned',
            ),
            Fieldset(
                'Cover art',
                'episode_image',
            ),
        )


class BlogPostForm(forms.ModelForm):
    content = forms.CharField(
        widget=TinyMCE(attrs={'cols': 80, 'rows': 30}),
        help_text='The full article body.'
    )

    class Meta:
        model = BlogPost
        fields = ['title', 'category', 'excerpt', 'cover_image', 'content', 'published_date']
        widgets = {
            'published_date': forms.DateTimeInput(attrs={'type': 'datetime-local'}, format='%Y-%m-%dT%H:%M'),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['published_date'].input_formats = ['%Y-%m-%dT%H:%M']
        self.helper = FormHelper()
        self.helper.form_tag = False
        self.helper.layout = Layout(
            Fieldset(
                'Basics',
                'title',
                Row(Column('category'), Column('published_date')),
                'excerpt',
            ),
            Fieldset(
                'Cover image',
                'cover_image',
            ),
            Fieldset(
                'Article',
                'content',
            ),
        )
