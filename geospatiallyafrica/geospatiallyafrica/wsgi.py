"""
WSGI config for geospatiallyafrica project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

if os.getenv('ENV') == 'Heroku':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'geospatiallyafrica.settings.production')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'geospatiallyafrica.settings.development')

application = get_wsgi_application()