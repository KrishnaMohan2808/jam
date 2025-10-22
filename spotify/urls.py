from django import urls
from .views import SpotifyAuthURL

urlpatterns = [
    urls.path('get-auth-url/', SpotifyAuthURL.as_view(), name='get-auth-url'),
]