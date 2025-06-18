from django.urls import path
from .views import firebase_login

urlpatterns = [
    path('firebase-login/' , firebase_login),
]