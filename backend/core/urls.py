from django.urls import path
from .views import FirebaseAuthView , ImportYoutubeView , SaveLearningView , ContinueWatchingView , CompletedVideos , ProfileInfoView, UserActivityGraphView

urlpatterns = [
    path('signup/', FirebaseAuthView.as_view()),
    path('login/', FirebaseAuthView.as_view()),
    path('oauth-login/', FirebaseAuthView.as_view()),  # All handled same way
    path('import/' , ImportYoutubeView.as_view()),
    path("save-learning/" , SaveLearningView.as_view()),
    path("continue-watch/" , ContinueWatchingView.as_view()),
    path("complete/" , CompletedVideos.as_view()),
    path("profile/" , ProfileInfoView.as_view()),
    path("activity/" , UserActivityGraphView.as_view()),
]
