from django.urls import path
from .views import FirebaseAuthView , ImportYoutubeView , SaveLearningView , ContinueWatchingView , CompletedVideos , ProfileInfoView, UserActivityGraphView, MyLearningsView , CertificateView, StartQuizView, QuizListView, SubmitQuizView, ClassroomView, MarkVideoAsCompletedView, DeleteVideo, DeletePlaylist


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
    path("my-learnings/" , MyLearningsView.as_view()),
    path("certs/" , CertificateView.as_view()),
    path("quiz-list/" , QuizListView.as_view()),
    path("start-quiz/" , StartQuizView.as_view()),
    path("submit-quiz/" , SubmitQuizView.as_view()),
    path("classroom/" , ClassroomView.as_view()),
    path("mark-completed/" , MarkVideoAsCompletedView.as_view()),
    path("delete-video/" , DeleteVideo.as_view()),
    path("delete-playlist/" , DeletePlaylist.as_view()),
]
