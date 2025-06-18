from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from firebase_admin import auth as firebase_auth
from rest_framework import status

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