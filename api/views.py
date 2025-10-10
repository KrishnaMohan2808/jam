from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics,status
from .models import room
from .serializers import RoomSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


class RoomView(generics.ListAPIView):
    queryset = room.objects.all()
    serializer_class = RoomSerializer





