from django.db import models

# Create your models here.
class SpotifyToken(models.Model):
    user = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=255)
    token_type = models.CharField(max_length=50)
    expires_in = models.IntegerField()
    refresh_token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SpotifyToken for {self.user}"