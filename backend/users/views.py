from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from firebase_admin import auth as firebase_auth
from rest_framework import status
import re
from django.views.decorators.csrf import csrf_exempt
import requests
from django.http import JsonResponse
import json
from decouple import config
from .models import ImportedContent
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

YOUTUBE_API_KEY = config('YOUTUBE_API_KEY')

@api_view(['POST'])
def firebase_login(request):
    id_token = request.data.get('idToken')

    if not id_token:
        return Response({"error":"ID token missing"} , status=status.HTTP_400_BAD_REQUEST)
    
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email')
        name = decoded_token.get('name')

        user , created = User.objects.get_or_create(username=uid , defaults = {'email':email , 'first_name':name})

        return Response({
            "message" : "User verified",
            "user": {
                "username" : user.username,
                "email": user.email,
                "name":user.first_name
            }
        })
    except Exception as e:
        return Response({"error" , str(e)} , status=status.HTTP_400_BAD_REQUEST)
    

@csrf_exempt
def fetch_youtube_metadata(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body)
        url = data.get('url')
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    if "youtu" not in url:
        return JsonResponse({"error": "Invalid YouTube URL"}, status=400)
    
    # Regex extract video or playlist ID
    video_match = re.search(r"(?:v=|youtu\.be/)([\w\-]{11})", url)
    playlist_match = re.search(r"list=([\w\-]+)", url)

    if video_match:
        video_id = video_match.group(1)
        yt_url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={video_id}&key={YOUTUBE_API_KEY}"

        res = requests.get(yt_url)
        data = res.json()

        if "items" not in data or not data["items"]:
            return JsonResponse({"error": "Video not found"}, status=404)
        
        snippet = data["items"][0]["snippet"]
        return JsonResponse({
            "type": "video",
            "title": snippet["title"],
            "description": snippet["description"],
            "thumbnail": snippet["thumbnails"]["high"]["url"],
        })
    
    elif playlist_match:
        playlist_id = playlist_match.group(1)
        yt_url = f"https://www.googleapis.com/youtube/v3/playlists?part=snippet&id={playlist_id}&key={YOUTUBE_API_KEY}"

        res = requests.get(yt_url)
        data = res.json()

        if "items" not in data or not data["items"]:
            return JsonResponse({"error": "Playlist not found"}, status=404)

        snippet = data["items"][0]["snippet"]
        return JsonResponse({
            "type": "playlist",
            "title": snippet["title"],
            "description": snippet["description"],
            "thumbnail": snippet["thumbnails"]["high"]["url"],
        })
    
    else:
        return JsonResponse({"error": "Invalid YouTube URL"}, status=400)
    
@csrf_exempt
def save_imported_content(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"} , status=400)
    
    try:
        data = json.loads(request.body)
        token = data.get("idToken")
        metadata = data.get("metadata")

        if not token or not metadata:
            return JsonResponse({"error": "Missing token or metadata"}, status=400)
        
        # Verify Firebase token
        idinfo = firebase_auth.verify_id_token(token)
        uid = idinfo['sub']
        email = idinfo.get('email')
        name = idinfo.get('name')

        user , created = User.objects.get_or_create(username=uid, defaults={'email': email, 'first_name': name})
        print("DATABASE")
        ImportedContent.objects.create(
            user = user,
            yt_type = metadata.get('type'),
            title = metadata.get('title'),
            description = metadata.get('description', ''),
            thumbnail = metadata.get('thumbnail'),
            youtube_url = metadata.get('url'),
            channel_title = metadata.get('channelTitle', ''),
        )

        return JsonResponse({"message": "Content saved successfully"}, status=201)
    
    except ValueError:
        return JsonResponse({"error": "Invalid token"}, status=401)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)