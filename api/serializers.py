from rest_framework import serializers
from .models import room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = room
        fields = ('guest_can_pause', 'votes_to_skip')

class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(max_length=8)

    class Meta:
        model = room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')