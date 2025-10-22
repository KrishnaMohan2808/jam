from django.utils import timezone
from datetime import timedelta
from requests import post, Request, get
from .models import SpotifyToken
from .credentials import CLIENT_ID, CLIENT_SECRET

SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token"

def get_spotify_token(user_identifier):
    """
    Retrieves the SpotifyToken for a given user identifier (e.g., session_key or User object),
    or None if it doesn't exist.
    """
    try:
        return SpotifyToken.objects.get(user=user_identifier)
    except SpotifyToken.DoesNotExist:
        return None

def update_or_create_spotify_token(user_identifier, access_token, token_type, expires_in, refresh_token):
    """
    Updates an existing SpotifyToken or creates a new one for the user.
    Stores the exact 'expires_at' timestamp.
    """
    expires_at = timezone.now() + timedelta(seconds=expires_in)

    token, created = SpotifyToken.objects.update_or_create(
        user=user_identifier,
        defaults={
            'access_token': access_token,
            'token_type': token_type,
            'expires_at': expires_at,
            'refresh_token': refresh_token
        }
    )
    return token

def refresh_spotify_token(user_identifier):
    """
    Uses the refresh_token to get a new access_token from Spotify.
    Returns True on success, False on failure.
    """
    token = get_spotify_token(user_identifier)
    if not token:
        return False  # No token to refresh

    # Request new token from Spotify
    response = post(SPOTIFY_TOKEN_URL, data={
        'grant_type': 'refresh_token',
        'refresh_token': token.refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    
    # Check if the refresh failed
    if not access_token:
        print("Error refreshing token:", response.get('error', 'Unknown error'))
        return False  # Refresh failed

    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    
    # Spotify *may* or *may not* send a new refresh token. Use the new one if provided.
    new_refresh_token = response.get('refresh_token', token.refresh_token)

    # Update the database with the new token info
    update_or_create_spotify_token(
        user_identifier,
        access_token,
        token_type,
        expires_in,
        new_refresh_token
    )
    return True

def is_spotify_authenticated(user_identifier):
    """
    Checks if a user is authenticated:
    1. Do they have a token?
    2. Is the token expired?
    3. If yes, can we refresh it?
    """
    token = get_spotify_token(user_identifier)
    if not token:
        return False  # No token found

    # Check if token is expired (or close to expiring, e.g., 1 minute)
    if token.expires_at <= timezone.now() + timedelta(minutes=1):
        # Token is expired, try to refresh it
        refresh_success = refresh_spotify_token(user_identifier)
        return refresh_success  # Return True if refresh worked, False if not

    # Token exists and is not expired
    return True