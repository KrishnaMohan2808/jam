from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics,status
from .models import room
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


class RoomView(generics.ListAPIView):
    queryset = room.objects.all()
    serializer_class = RoomSerializer

class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room_instance = room.objects.filter(code=code)
            if len(room_instance) > 0:
                data = RoomSerializer(room_instance[0]).data
                data['is_host'] = self.request.session.session_key == room_instance[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = room.objects.filter(host=host)
            if queryset.exists():
                room_instance = queryset[0]
                room_instance.guest_can_pause = guest_can_pause
                room_instance.votes_to_skip = votes_to_skip
                room_instance.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room_instance.code
                return Response(RoomSerializer(room_instance).data, status=status.HTTP_200_OK)
            else:
                room_instance = room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room_instance.save()
                self.request.session['room_code'] = room_instance.code
                return Response(RoomSerializer(room_instance).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)





