from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserProfile , Playlist , Video , UserActivityLog
from rest_framework import status
from .serializers import UserProfileSerializer , VideoSerializer , PlaylistSerializer
from .utils.firebase import verify_firebase_token
from .utils.youtube import get_youtube_metadata
from django.utils import timezone
from datetime import timedelta
from datetime import datetime


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

class ContinueWatchingView(APIView):
    def post(self , request):
        idToken = request.data.get("idToken")

        if not idToken:
            return Response({"error":"Missing id token"} , status=404)
        
        try:
            uinfo = verify_firebase_token(idToken)
            uid = uinfo["uid"]
        except:
            return Response({"error" , "Invalid token"} , status=401)
        
        videos = Video.objects.filter(user__uid=uid , is_completed=False).order_by('-imported_at')[:3]
        video_serializer = VideoSerializer(videos , many=True)
        return Response({"videos":video_serializer.data})

class CompletedVideos(APIView):
    def post(self , request):
        idToken = request.data.get("idToken")

        if not idToken:
            return Response({"error" : "Missing ID token"} , status=404)
        
        try:
            decoded = verify_firebase_token(idToken)
            uid = decoded['uid']
            user  = UserProfile.objects.get(uid=uid)
        except:
            return Response({"error":"Invalid or missing user"})
        
        videos = Video.objects.filter(user__uid=uid , is_completed=True)
        video_serializer = VideoSerializer(videos , many=True)

        playlists = Playlist.objects.filter(user__uid=uid)
        completed_playlists = []
        for pl in playlists:
            videos_in_pl = Video.objects.filter(playlist=pl)
            if videos_in_pl.exists() and all(v.is_completed for v in videos_in_pl):
                completed_playlists.append(pl)

        pl_serializer = PlaylistSerializer(completed_playlists , many=True)

        return Response({
            "videos" : video_serializer.data,
            "playlists" : pl_serializer.data
        })
        
class ProfileInfoView(APIView):
    def post(self, request):
        id_token = request.data.get("idToken")
        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
        except:
            return Response({"error": "Invalid token"}, status=401)
    
        try:
            user = UserProfile.objects.get(uid=uid)
        except UserProfile.DoesNotExist:
            return Response({"error":"User not found"} , status=404)
        
        user_serializer = UserProfileSerializer(user)
        return Response(user_serializer.data)
    
class UserActivityGraphView(APIView):
    def post(self, request):
        id_token = request.data.get('idToken')

        if not id_token:
            return Response({"error":"Missing Token"} ,status = 400)
        
        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid = uid)
        except:
            return Response({"error":"Invalid user"} ,status = 401)


        #Prepare activity streak for last 14 days
        today = timezone.now().date()
        streak_data = []

        for i in range(13 , -1 , -1):
            date = today - timedelta(days=i)
            start = timezone.make_aware(datetime.combine(date , datetime.min.time()))
            end = timezone.make_aware(datetime.combine(date , datetime.max.time()))

            count = UserActivityLog.objects.filter(user=user,timestamp__range=(start , end)).count()
            streak_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "activity_count": count
            })

        return Response({"graph":streak_data} ,status=200)