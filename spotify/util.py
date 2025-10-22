from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta

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