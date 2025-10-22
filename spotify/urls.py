from django import urls
from .views import SpotifyAuthURL, spotify_callback,is_spotify_authenticated
from .views import SpotifyAuthURL
from .views import IsUserAuthenticated
urlpatterns = [
    urls.path('get-auth-url/', SpotifyAuthURL.as_view(), name='get-auth-url'),
    urls.path('redirect/', spotify_callback, name='spotify-callback'),
    # urls.path('is-authenticated/', is_spotify_authenticated, name='is-spotify-authenticated'),
    urls.path('is-authenticated/', IsUserAuthenticated.as_view(), name='is-authenticated'),
]