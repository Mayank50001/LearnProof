from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from .models import UserProfile , Playlist , Video , UserActivityLog , Certificate , Quiz
from rest_framework import status
from .serializers import UserProfileSerializer , VideoSerializer , PlaylistSerializer , CertificateSerializer, QuizSerializer
from .utils.firebase import verify_firebase_token
from .utils.youtube import get_youtube_metadata
from .utils.quiz_generator import generate_quiz
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

            activity = UserActivityLog.objects.create(
                user = user,
                activity_type = "Learning Import",
            )

            return Response({"message":"Congo!! You have showed your dedication towards learning"})
        
        elif content_type == "playlist":
            pid = data["id"]

            if Playlist.objects.filter(user=user, pid=pid).exists():
                return Response({"message": "Playlist already saved"}, status=200)

            # create playlist
            playlist = Playlist.objects.create(
                user=user,
                pid=pid,
                name=data["title"],
                url=data["url"],
                thumbnail=data["thumbnail"],
            )

            for v in data.get("videos", []):
                Video.objects.update_or_create(
                    user=user,
                    vid=v["video_id"],
                    defaults={
                        'name': v["title"],
                        'url': v["url"],
                        'playlist': playlist,
                        'imported_at': timezone.now(),
                        'description': v.get("description", ""),
                        'watch_progress': 0.0,
                        'is_completed': False
                    }
                )
            
            activity = UserActivityLog.objects.create(
                user = user,
                activity_type = "Learning Import",
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
        
        videos = Video.objects.filter(user__uid=uid , is_completed=True)[:3]
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
    
class MyLearningsView(APIView):
    def post(self , request):
        id_token = request.data.get("idToken")
        page = request.data.get("page" , 1)
        page_size = request.data.get("page_size" , 10)
        search_query = request.data.get("searchQuery", "")

        if not id_token:
            return Response({"error" : "Missing Token"} , status=400)
        
        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid = uid)
        except:
            return Response({"error" : "Invalid or missing user"})

        # Force page param into request.GET for paginator
        request._request.GET = request._request.GET.copy()
        request._request.GET['page'] = str(page)

        # Paginated Videos
        videos = Video.objects.filter(user = user).order_by('-imported_at')
        playlists = Playlist.objects.filter(user = user).order_by('-id')

        if search_query:
            videos = videos.filter(name__icontains=search_query)
            playlists = playlists.filter(name__icontains=search_query)

        paginator = PageNumberPagination()
        paginator.page_size = page_size
        paginated_videos = paginator.paginate_queryset(videos , request)
        video_serializer = VideoSerializer(paginated_videos , many=True)
        paginated_video_response = paginator.get_paginated_response(video_serializer.data).data
        
        playlists_data = []
        for pl in playlists:
            pl_videos = Video.objects.filter(playlist = pl)
            pl_video_serializer = VideoSerializer(pl_videos , many=True)
            pl_data = PlaylistSerializer(pl).data
            pl_data["videos"] = pl_video_serializer.data
            playlists_data.append(pl_data)

        return Response({
            "videos" : paginated_video_response,
            "playlists" : playlists_data
        } , status = 200)
    
class CertificateView(APIView):
    def post(self , request):
        id_token = request.data.get("idToken")

        if not id_token:
            return Response({"error":"Missing idToken"} , status=401)
        
        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid = uid)
        except:
            return Response({"error" : "Invalid or missing user"} , status = 404)
        

        certificates = Certificate.objects.filter(user = user).order_by("-issued_at")
        certificate_serializer = CertificateSerializer(certificates , many=True)

        return Response(certificate_serializer.data , status=200)
    
class QuizListView(APIView):
    def post(self, request):
        id_token = request.data.get("idToken")
        if not id_token:
            return Response({"error": "Missing idToken"}, status=400)

        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid=uid)
        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        videos = Video.objects.filter(user=user, playlist__isnull=True, is_completed=True)

        playlists = []
        for pl in Playlist.objects.filter(user=user):
            total = pl.video_set.count()
            completed = pl.video_set.filter(is_completed=True).count()
            if total > 0 and completed == total:
                playlists.append(pl)

        return Response({
            "videos" : VideoSerializer(videos, many=True).data,
            "playlists" : PlaylistSerializer(playlists, many=True).data
        })
    
class StartQuizView(APIView):
    def post(self, request):
        id_token = request.data.get("idToken")
        vid = pid = None
        type = request.data.get("contentType")
        if type == "video":
            vid = request.data.get("contentId")
        else :
            pid = request.data.get("contentId")
        print(f"{vid} - {pid}")

        if not id_token or not (vid or pid):
            return Response({"error": "Missing idToken or videoId"}, status=400)

        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid=uid)
        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if not (vid or pid):
            return Response({"error":"Need a video or a playlist to work with"})
        
        target = None
        if vid:
            try:
                target = Video.objects.get(user=user, vid=vid)
            except Video.DoesNotExist:
                return Response({"error": "Video not found"}, status=404)
        elif pid:
            try:
                target = Playlist.objects.get(user=user, pid=pid)
            except Playlist.DoesNotExist:
                return Response({"error": "Playlist not found"}, status=404)
            

        title = target.name if target else "Quiz"
        desc = getattr(target, 'description', 'No description available')

        questions = generate_quiz(title, desc)

        quiz = Quiz.objects.create(
            user = user,
            video = target if vid else None,
            playlist = target if pid else None,
            questions = questions,
            attempted_at = timezone.now()
        )

        activity = UserActivityLog.objects.create(
            user = user,
            activity_type = "Quiz Started" if vid else "Playlist Quiz Started"
        )

        return Response({
            "quiz" : {
                "quiz_id": quiz.id,
                "questions": questions,
                "time_limit" : 20,  # Example time limit in minutes
            }
        })

class SubmitQuizView(APIView):
    def post(self,request):
        id_token = request.data.get("idToken")
        quiz_id = request.data.get("quizId")
        answers = request.data.get("answers")

        if not id_token or not quiz_id or not answers:
            return Response({"error": "Missing idToken, quizId or answers"}, status=400)

        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid=uid)
        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        try:
            quiz = Quiz.objects.get(id=quiz_id, user=user)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=404)

        score = 0
        for i, question in enumerate(quiz.questions):
            if answers[i] == question['answer']:
                score += 1

        score = round((score / len(quiz.questions)) * 100, 2)
        passed = score >= 50

        quiz.score = score
        quiz.passed = passed
        quiz.save()

        activity = UserActivityLog.objects.create(
            user = user,
            activity_type = "Quiz Submitted" if quiz.video else "Playlist Quiz Submitted"
        )

        if passed:

            if quiz.playlist:
                video_count = quiz.playlist.video_set.count()
                user.xp += video_count * 5  # Example XP for passing a playlist quiz
                user.level = (user.xp // 100) + 1  # Example level calculation
            else:
                user.xp += 10  # Example XP for passing a video quiz
                user.level = (user.xp // 100) + 1  # Example level calculation
            user.save()

            cert = Certificate.objects.create(
                user=user,
                video = quiz.video,
                playlist = quiz.playlist,
                download_url=f"/media/certificates/{quiz.id}.pdf",  # Placeholder URL
                issued_at=timezone.now()
            )
            certificate_url = cert.download_url

            activity = UserActivityLog.objects.create(
                user = user,
                activity_type = "Certificate Issued" if quiz.video else "Playlist Certificate Issued"
            )

        return Response({
            "score": score,
            "passed": passed,
            "certificate_url":certificate_url
        }, status=200)
    
class ClassroomView(APIView):
    def post(self, request):
        id_token = request.data.get("idToken")
        vid = request.data.get("videoId")

        if not id_token or not vid:
            return Response({"error":"Missing idToken or videoId"}, status=400)
        
        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid=uid)
        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        
        try:
            video = Video.objects.select_related('playlist').get(user=user , vid=vid)
        except Video.DoesNotExist:
            return Response({"error":"Video Not found"}, status=404)
        
        video_data = VideoSerializer(video).data
        
        playlist_data = None
        if video.playlist:
            playlist_videos = Video.objects.filter(user=user, playlist=video.playlist)
            playlist_data = {
                "name" : video.playlist.name,
                "videos" : VideoSerializer(playlist_videos, many=True).data,
            }

        activity = UserActivityLog.objects.create(
            user=user,
            activity_type="Classroom Accessed" if video.playlist else "Video Accessed"
        )
        
        return Response({
            "video" : video_data,
            "playlist" : playlist_data
        }, status=200)

class MarkVideoAsCompletedView(APIView):
    def post(self, request):
        id_token = request.data.get("idToken")
        vid = request.data.get("videoId")

        if not id_token or not vid:
            return Response({"error": "Missing idToken or videoId"}, status=400)
        
        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid=uid)
        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        
        try:
            video = Video.objects.get(user=user, vid=vid)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=404)

        video.is_completed = True
        video.watch_progress = 100
        video.save()

        user.xp += 10  # Example XP for completing a video
        user.level = (user.xp // 100) + 1  # Example level calculation
        user.save()

        activity = UserActivityLog.objects.create(
            user = user,
            activity_type = "Video Marked as Completed"
        )

        return Response({"message": "Video marked as completed"}, status=200)
    
class DeleteVideo(APIView):
    def post(self, request):
        id_token = request.data.get("idToken")
        vid = request.data.get("videoId")

        if not id_token or not vid:
            return Response({"error": "Missing idToken or videoId"}, status=400)
        
        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid=uid)
        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        
        try:
            video = Video.objects.get(user=user, vid=vid)
            video.delete()
            return Response({"message": "Video deleted successfully"}, status=200)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=404)
        
class DeletePlaylist(APIView):
    def post(self, request):
        id_token = request.data.get("idToken")
        pid = request.data.get("playlistId")

        if not id_token or not pid:
            return Response({"error": "Missing idToken or playlistId"}, status=400)
        
        try:
            decoded = verify_firebase_token(id_token)
            uid = decoded["uid"]
            user = UserProfile.objects.get(uid=uid)
        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        
        try:
            playlist = Playlist.objects.get(user=user, pid=pid)
            playlist_videos = Video.objects.filter(playlist=playlist)
            deleted_count, details = playlist_videos.delete()  # Delete all videos in the playlist
            playlist.delete()
            return Response({"message": "Playlist and Videos associated with it deleted successfully"}, status=200)
        except Playlist.DoesNotExist:
            return Response({"error": "Playlist not found"}, status=404)
    
