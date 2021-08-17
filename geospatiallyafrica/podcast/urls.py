from django import urls
from . import views
from django.urls import path

urlpatterns = [
    path('', views.home_page, name='home_page'),
]