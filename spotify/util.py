from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.utils import timezone
from datetime import timedelta
from .models import SpotifyToken
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from requests import post, Request, get

def get_spotify_token(user):
    """
    Retrieves the SpotifyToken for a given user, or None if it doesn't exist.
    """
    try:
        return SpotifyToken.objects.get(user=user)
    except SpotifyToken.DoesNotExist:
        return None

def update_or_create_spotify_token(user, access_token, token_type, expires_in, refresh_token):
    """
    Updates an existing SpotifyToken or creates a new one for the user.
    This version uses Django's 'update_or_create' method and stores
    the exact 'expires_at' timestamp instead of the 'expires_in' duration.
    """
    # Calculate the absolute timestamp when the token expires
    expires_at = timezone.now() + timedelta(seconds=expires_in)

    # Use Django's built-in method to find a token for 'user'
    # If it exists, update it with the 'defaults'.
    # If it doesn't exist, create it with 'user' and the 'defaults'.
    token, created = SpotifyToken.objects.update_or_create(
        user=user,
        defaults={
            'access_token': access_token,
            'token_type': token_type,
            'expires_at': expires_at,  # Store the timestamp
            'refresh_token': refresh_token
        }
    )
    return token

# Note: This code assumes your 'SpotifyToken' model in models.py
# has a 'DateTimeField' named 'expires_at' instead of 'expires_in'.
#
# Using 'expires_at' is highly recommended, as checking if a token
# is expired becomes a simple query:
#   if token.expires_at <= timezone.now():
#       # refresh token

def is_spotify_authenticated(session_id):
    token = SpotifyToken.objects.filter(user=session_id).first()
    if token:
        # Check if the token has expired
        expiry_time = token.created_at + timedelta(seconds=token.expires_in)
        if expiry_time <= timezone.now():
            return False
        return True
    return False



def refresh_spotify_token(session_id):
    token = SpotifyToken.objects.filter(user=session_id).first()
    if token:
        refresh_token = token.refresh_token
        response = post(SPOTIFY_TOKEN_URL, data={
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }).json()

        access_token = response.get('access_token')
        token_type = response.get('token_type')
        expires_in = response.get('expires_in')

        update_or_create_spotify_token(
            user=session_id,
            access_token=access_token,
            token_type=token_type,
            expires_in=expires_in,
            refresh_token=refresh_token
        ) 

class IsUserAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
