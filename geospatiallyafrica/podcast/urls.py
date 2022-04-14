from django import urls
from . import views
from django.urls import path


urlpatterns = [
    path('', views.index, name='home'),
    path('episodes', views.episode_list, name='episode_list'),
    path('login', views.loginView, name='login'),
    path('logout', views.logoutView, name='logout'),
    path('episode/<int:pk>/', views.episode_detail, name='episode_detail'),
    path('episode/new_episode/', views.new_episode, name='new_episode'),
    path('news/', views.news, name='news'),
    path('drafts/', views.episode_draft_list, name='episode_draft_list'),
    path('episode/<pk>/publish/', views.episode_publish, name='episode_publish'),
    path('episode/<int:pk>/edit/', views.episode_edit, name='episode_edit'),
    path('about-us/', views.about_us, name='about_us'),
    path('support-us/', views.support, name='support_us'),
]