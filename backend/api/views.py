from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.utils.youtube_embed import get_youtube_embed
from api.utils.yt_playlist import get_playlist_videos
from rest_framework import status
import pyrebase
from django.conf import settings


firebase_config = {
    "apiKey" : "AIzaSyAV96gY3SvsfMtiu7F_NdZlrR5a5ecxxs8",
    "authDomain" : "learnproof.firebaseapp.com",
    "databaseURL": "https://learnproof.firebaseio.com",
    "projectId" : "learnproof",
    "storageBucket" : "learnproof.firebasestorage.app",
    "messagingSenderId" : "74980993962",
    "appId" : "1:74980993962:web:6982678c8b00970b08d9d3",
}

firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

# Create your views here.
@api_view(['POST'])
def get_video_embed(request):
    url = request.data.get("url")
    if url:
        embed_url = get_youtube_embed(url)
        return Response({"embed_url":embed_url})
    return Response({"error":"URL not provided"}, status=400)

@api_view(['POST'])
def get_playlist_data(request):
    url = request.data.get("url")
    if url:
        videos = get_playlist_videos(url)
        return Response({"videos":videos})
    return Response({"error":"URL not provided"}, status = 400)

@api_view(['POST'])
def firebase_signup(request):
    email = request.data.get("email")
    password = request.data.get("password")
    try:
        user = auth.create_user_with_email_and_password(email , password)
        return Response({"message":"Account created" , "user":user}, status = status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def firebase_login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        return Response({"message": "Login successful", "user": user}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)