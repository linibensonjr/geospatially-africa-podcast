from .base import *
import os
import dj_database_url
import django_heroku

DEBUG = False
ALLOWED_HOSTS = [
    'herokuapp.com', 
    'geospatiallyafrica.com',
    'www.geospatiallyafrica.com'
]


# Production database configuration
DATABASES = {
    'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
}
# Heroku settings
django_heroku.settings(locals())
