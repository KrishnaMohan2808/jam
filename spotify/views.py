from django.shortcuts import render, redirect
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from rest_framework.views import APIView
from rest_framework.response import Response
from requests import post, Request
from rest_framework import status
from .models import SpotifyToken
from .util import update_or_create_spotify_token, is_spotify_authenticated

# Define Spotify API endpoints
SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize"
SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"

class SpotifyAuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        
        # Get the room_code from the React fetch
        room_code = request.GET.get('room_code')

        auth_url = Request('GET', SPOTIFY_AUTH_URL, params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'state': room_code  # <-- Pass room_code as 'state'
        }).prepare().url

        return Response({'auth_url': auth_url}, status=status.HTTP_200_OK)

def spotify_callback(request):
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    # --- THIS IS THE FIX ---
    # Get the 'state' (which is our room_code) back from Spotify
    room_code = request.GET.get('state')
    # -----------------------

    if error:
        # Redirect to your frontend with an error message
        # We redirect to '/' because we don't know what room they were in
        return redirect('/?error=' + error)

    # Exchange the code for an access token
    response = post(SPOTIFY_TOKEN_URL, data={
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
    
    # Handle error during token exchange
    if not access_token:
        if room_code:
            return redirect(f'/room/{room_code}?error=auth_failed')
        else:
            return redirect('/?error=auth_failed')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_spotify_token(
        user=request.session.session_key,
        access_token=access_token,
        token_type=token_type,
        expires_in=expires_in,
        refresh_token=refresh_token
    )

    # --- THIS IS THE FIX ---
    # Redirect to the room they started from, otherwise to the homepage
    if room_code:
        return redirect(f'/room/{room_code}')
    else:
        return redirect('/')

class IsUserAuthenticated(APIView):
    def get(self, request, format=None):
        if not request.session.exists(request.session.session_key):
            request.session.create()
            
        session_id = request.session.session_key
        is_authenticated = is_spotify_authenticated(session_id)
        
        # Wraps the boolean in a JSON Response object
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)