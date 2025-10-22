from django.contrib import admin
from django.urls import path, include
from api.views import index  # <-- IMPORT THE NEW 'index' VIEW

urlpatterns = [
    path('admin/', admin.site.urls),

    # 1. API routes:
    # All URLs starting with 'api/' will be handled by your
    # 'api/urls.py' file and the views you posted.
    path('api/', include('api.urls')),

    # 2. Frontend routes:
    # All other URLs will be handled by the 'index' view,
    # which loads your React app.
    path('', index),
    path('join/', index),
    path('create/', index),
    path('room/<str:roomCode>/', index),
    path('spotify/', include('spotify.urls')),
]