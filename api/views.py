from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics
from .models import room
from .serializers import RoomSerializer

class RoomView(generics.ListAPIView):
    queryset = room.objects.all()
    serializer_class = RoomSerializer





