from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserProfile , Playlist , Video
from rest_framework import status
from .serializers import UserProfileSerializer
from .utils.firebase import verify_firebase_token
from .utils.youtube import get_youtube_metadata
from django.utils import timezone

class FirebaseAuthView(APIView):
    def post(self , request):
        id_token = request.data.get('idToken')

        if not id_token:
            return Response({"error": "No token provided"} , status=400)
        
        decoded = verify_firebase_token(id_token)
        uid = decoded['uid']
        email = decoded.get('email')
        name = decoded.get('name' , 'No name')
        picture = decoded.get('picture' , '')

        user , created = UserProfile.objects.get_or_create(
            uid=uid , 
            defaults={'email':email , 'name':name ,'profile_pic':picture}
        )

        serializer = UserProfileSerializer(user)
        return Response(serializer.data , status=200)

class ImportYoutubeView(APIView):
    def post(self , request):
        id_token = request.data.get("idToken")
        youtube_url = request.data.get("url")

        if not id_token or not youtube_url:
            return Response({"error":"Missing token or url"} , status=400)
        
        try:
            decoded_token = verify_firebase_token(id_token)
            uid = decoded_token['uid']
        except Exception as e:
            return Response({"error":"Invalid token"} , status=401)
        
        try:
            user = UserProfile.objects.get(uid=uid)
        except UserProfile.DoesNotExist:
            return Response({"error":"User not found"} , status=404)
        
        metadata = get_youtube_metadata(youtube_url)

        if "error" in metadata:
            return Response(metadata , status=400)
        
        return Response({"success":True , "data":metadata} ,status=200)
    
class SaveLearningView(APIView):
    def post(self ,request):
        idToken = request.data.get("idToken")
        data = request.data.get("data")

        if not idToken or not data:
            return Response({"error":"Missing idtoken or data"} ,status=404)
        
        try:
            decoded = verify_firebase_token(idToken)
            uid = decoded['uid']
            user  = UserProfile.objects.get(uid=uid)
        except:
            return Response({"error":"Invalid or missing user"})
        
        content_type = data.get("type")
        if content_type == "video":
            vid = data["id"]
            if Video.objects.filter(user=user , vid=vid).exists():
                return Response({"message":"You have already saved this before"})
            
            video = Video.objects.create(
                user=user,
                vid=vid,
                name=data["title"],
                url = data["url"],
                imported_at = timezone.now(),
                description = data["description"],
            )
            return Response({"message":"Congo!! You have showed your dedication towards learning"})
        
        elif content_type == "playlist":
            pid = data["id"]
            if Playlist.objects.filter(user=user, pid=pid).exists():
                return Response({"message": "Playlist already saved"}, status=200)

            playlist = Playlist.objects.create(
                user=user,
                pid=pid,
                name=data["title"],
                url=data["url"],
                thumbnail=data["thumbnail"],
            )

            for v in data.get("videos", []):
                Video.objects.create(
                    user=user,
                    vid=v["video_id"],
                    name=v["title"],
                    url=v["url"],
                    playlist=playlist,
                    imported_at=timezone.now()
                )

            return Response({"message": "Playlist and videos saved"}, status=201)

        return Response({"error": "Invalid content type"}, status=400)