from django.urls import path
from .views import firebase_login , fetch_youtube_metadata , save_imported_content

urlpatterns = [
    path('firebase-login/' , firebase_login),
    path('import/fetch-metadata/' , fetch_youtube_metadata),
    path("import/save/" , save_imported_content),
]