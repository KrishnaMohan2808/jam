from django import urls
from .views import SpotifyAuthURL, spotify_callback

urlpatterns = [
    urls.path('get-auth-url/', SpotifyAuthURL.as_view(), name='get-auth-url'),
    urls.path('redirect/', spotify_callback, name='spotify-callback'),
]