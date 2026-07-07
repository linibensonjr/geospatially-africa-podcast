import re

from django import template

register = template.Library()

# Matches the 11-char video id out of watch?v=, youtu.be/, /shorts/, or /embed/ URLs
YOUTUBE_ID_RE = re.compile(
    r'(?:youtube(?:-nocookie)?\.com/(?:watch\?v=|embed/|shorts/)|youtu\.be/)'
    r'([A-Za-z0-9_-]{11})'
)


def _extract_youtube_id(url):
    if not url:
        return None
    match = YOUTUBE_ID_RE.search(url)
    return match.group(1) if match else None


@register.filter
def youtube_embed(url):
    """Any YouTube URL form -> a youtube-nocookie embed URL, or '' if unparseable."""
    video_id = _extract_youtube_id(url)
    return f'https://www.youtube-nocookie.com/embed/{video_id}' if video_id else ''


@register.filter
def youtube_thumb(url):
    """Any YouTube URL form -> its hqdefault thumbnail URL, or '' if unparseable."""
    video_id = _extract_youtube_id(url)
    return f'https://i.ytimg.com/vi/{video_id}/hqdefault.jpg' if video_id else ''
