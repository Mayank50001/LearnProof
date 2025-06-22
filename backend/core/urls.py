from django.urls import path
from .views import FirebaseAuthView

urlpatterns = [
    path('signup/', FirebaseAuthView.as_view()),
    path('login/', FirebaseAuthView.as_view()),
    path('oauth-login/', FirebaseAuthView.as_view()),  # All handled same way
]
