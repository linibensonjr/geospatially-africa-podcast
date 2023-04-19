from django import urls
from . import views
from django.urls import path
# from .views import SearchResultView


urlpatterns = [
    path('', views.index, name='blog'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('add/', views.add_blog, name='add_blog'),
    # path('blog/drafts/', views.blog_draft_list, name='episode_draft_list'),
    # path('episode/<pk>/publish/', views.episode_publish, name='episode_publish'),
    # path('episode/<int:pk>/edit/', views.episode_edit, name='episode_edit'),
    # path('episode/<int:pk>/delete/', views.episode_delete, name='episode_delete'),
    # path('about-us/', views.about_us, name='about_us'),
    # path('support-us/', views.support, name='support_us'),
    # path('tags', views.tags, name='tags'),
    # path('guests', views.guests, name='guests'),
    # path('search', SearchResultView.as_view(), name='search_results')
]