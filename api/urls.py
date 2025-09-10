from django.urls import path
from . import views
from .views import RoomView

urlpatterns = [
    path('room/', RoomView.as_view(), name='room'),
]
