from django import urls
from . import views
from django.urls import path


urlpatterns = [
    path('', views.index, name='index'),
    path('episodes', views.episode_list, name='episode_list'),
    path('episode/<int:pk>/', views.episode_detail, name='episode_detail'),
    path('episode/new_episode/', views.new_episode, name='new_episode'),
    path('episode/news/', views.news, name='news'),
    path('drafts/', views.episode_draft_list, name='episode_draft_list'),
    path('episode/<pk>/publish/', views.episode_publish, name='episode_publish'),
    path('episode/<int:pk>/edit/', views.episode_edit, name='episode_edit'),
    path('about-us/', views.about_us, name='about_us'),
]
