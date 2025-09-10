from rest_framework import serializers
from .models import room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')