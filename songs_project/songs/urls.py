from django.urls import path
from .views import get_all_songs, rate_song

urlpatterns = [
    path('songs/', get_all_songs, name='get_all_songs'),
    path('songs/<int:id>/rate/', rate_song, name='rate_song'),
]