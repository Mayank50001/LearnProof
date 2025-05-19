from django.urls import path
from api.views import get_video_embed , get_playlist_data, firebase_signup, firebase_login

urlpatterns = [
    path('get_embed/' , get_video_embed),
    path('get_playlist/' , get_playlist_data),
    path('signup/', firebase_signup),
    path('login/', firebase_login)
]