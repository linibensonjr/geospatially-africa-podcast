release: python manage.py collectstatic --noinput
web: gunicorn geospatiallyafrica.wsgi --log-file - --log-level debug --preload --workers 1