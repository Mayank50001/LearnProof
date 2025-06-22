from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserProfile
from rest_framework import status
from .serializers import UserProfileSerializer
from .utils import verify_firebase_token

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