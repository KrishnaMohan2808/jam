from django.urls import path
from . import views
from .views import RoomView
from .views import CreateRoomView, GetRoom, JoinRoomView, RoomView,userInRoom

urlpatterns = [
    path('room/', RoomView.as_view(), name='room'),
    path('create-room/', views.CreateRoomView.as_view(), name='create-room'),
    path('get-room/', views.GetRoom.as_view(), name='get-room'),
    path('join-room/', views.JoinRoomView.as_view(), name='join-room'),
    path('user-in-room/', views.userInRoom.as_view(), name='user-in-room')
]
