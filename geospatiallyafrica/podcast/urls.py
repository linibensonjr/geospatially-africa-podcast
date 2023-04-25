from django import urls
from . import views
from django.urls import path
from .views import SearchResultView


urlpatterns = [
    path('', views.index, name='home'),
    path('episodes', views.episode_list, name='episode_list'),
    path('login', views.loginView, name='login'),
    path('logout', views.logoutView, name='logout'),
    path('episodes/<slug:slug>', views.episode_detail, name='episode_detail'),
    path('episode/<int:pk>', views.redirect_id, name='redirect_episode_detail'),
    path('episodes/new_episode/', views.new_episode, name='new_episode'),
    path('blog/', views.blog, name='blog'),
    path('drafts/', views.episode_draft_list, name='episode_draft_list'),
    path('episodes/<slug>/publish/', views.episode_publish, name='episode_publish'),
    path('episodes/<slug:slug>/edit/', views.episode_edit, name='episode_edit'),
    path('episodes/<slug:slug>/delete/', views.episode_delete, name='episode_delete'),
    path('about-us/', views.about_us, name='about_us'),
    path('support-us/', views.support, name='support_us'),
    path('tags', views.tags, name='tags'),
    path('guests', views.guests, name='guests'),
    path('search', SearchResultView.as_view(), name='search_results')
]