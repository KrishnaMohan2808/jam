from django.urls import path
from . import views
from .views import RoomView

urlpatterns = [
    path('room/', RoomView.as_view(), name='room'),
    path('create-room/', views.CreateRoomView.as_view(), name='create-room'),
    path('get-room/', views.GetRoom.as_view(), name='get-room'),
]
