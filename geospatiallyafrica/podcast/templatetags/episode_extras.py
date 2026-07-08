from django import template

register = template.Library()


@register.filter
def parse_chapters(text):
    """Turn 'One per line: 00:00 Segment title' into [{'time', 'title'}, ...]."""
    chapters = []
    if not text:
        return chapters
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        parts = line.split(None, 1)
        if len(parts) == 2:
            time, title = parts
        else:
            time, title = '', parts[0]
        chapters.append({'time': time, 'title': title})
    return chapters


@register.filter
def parse_links(text):
    """Turn 'One per line: Label | https://url' into [{'label', 'url'}, ...]."""
    links = []
    if not text:
        return links
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if '|' in line:
            label, url = line.split('|', 1)
            label = label.strip()
            url = url.strip()
        else:
            label = url = line
        links.append({'label': label, 'url': url})
    return links


@register.filter
def host_lookup(hosts, name):
    """Find a Hosts record by name from a queryset/list, or None."""
    for host in hosts:
        if host.name == name:
            return host
    return None
