from django.urls import path
from .views import FirebaseAuthView , ImportYoutubeView , SaveLearningView

urlpatterns = [
    path('signup/', FirebaseAuthView.as_view()),
    path('login/', FirebaseAuthView.as_view()),
    path('oauth-login/', FirebaseAuthView.as_view()),  # All handled same way
    path('import/' , ImportYoutubeView.as_view()),
    path("save-learning/" , SaveLearningView.as_view())
]
