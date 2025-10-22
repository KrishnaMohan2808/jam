from django.shortcuts import render, redirect # Import redirect
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from rest_framework.views import APIView
from rest_framework.response import Response
from requests import post, Request
from rest_framework import status
import time # Import time to calculate expiry
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .util import update_or_create_spotify_token

# Define Spotify API endpoints
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"

class SpotifyAuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        
        # Use the correct Spotify authorization URL
        auth_url = Request('GET', SPOTIFY_AUTH_URL, params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'auth_url': auth_url}, status=status.HTTP_200_OK)

def spotify_callback(request):
    code = request.GET.get('code')
    error = request.GET.get('error')

    # Handle case where user denies access
    if error:
        # Redirect to your frontend with an error message
        return redirect('/?error=' + error) # Or an error page

    # Exchange the code for an access token
    response = post(SPOTIFY_TOKEN_URL, data={ # Use the correct Spotify token URL
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in') # Expiry time in seconds
    refresh_token = response.get('refresh_token')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_spotify_token(
        user=request.session.session_key,
        access_token=access_token,
        token_type=token_type,
        expires_in=expires_in,
        refresh_token=refresh_token
    )
    # Redirect to your frontend after successful authentication
    return redirect('frontend:')  # Adjust the redirect URL as needed
