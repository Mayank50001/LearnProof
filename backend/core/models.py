from django.db import models
import uuid
from django.core.exceptions import ValidationError

# Create your models here.
class UserProfile(models.Model):
    uid = models.CharField(max_length=128 , unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    profile_pic = models.URLField(blank=True , null=True)
    xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    streak_count = models.IntegerField(default=0)
    joined_at = models.DateTimeField(auto_now_add=True)

    def calculate_level(self):
        return (self.xp // 100) + 1;

    def __str__(self):
        return self.email
    
class Playlist(models.Model):
    user = models.ForeignKey(UserProfile , on_delete=models.CASCADE)
    pid = models.CharField(max_length=100 , unique=True)
    name = models.CharField(max_length=200)
    url = models.URLField()
    thumbnail = models.URLField(blank=True , null=True)
    imported_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Video(models.Model):
    user = models.ForeignKey(UserProfile , on_delete=models.CASCADE)
    vid = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    url = models.URLField()
    description = models.TextField(blank=True , null=True)
    playlist = models.ForeignKey(Playlist , on_delete=models.SET_NULL , null=True , blank=True)
    imported_at = models.DateTimeField()
    watch_progress = models.FloatField(default = 0.0)
    is_completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user' , 'vid')

    def __str__(self):
        return self.name
    
class Quiz(models.Model):
    user = models.ForeignKey(UserProfile , on_delete=models.CASCADE)
    video = models.ForeignKey(Video , on_delete=models.SET_NULL , null=True , blank=True)
    playlist = models.ForeignKey(Playlist, on_delete=models.SET_NULL, null=True, blank=True)
    questions = models.JSONField(default=list)
    score = models.FloatField(null=True, blank=True)
    passed = models.BooleanField(null=True, blank=True)
    attempted_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        if not self.video and not self.playlist:
            raise ValidationError("Quiz must be linked to either a video or playlist.")

    def __str__(self):
        return f"Quiz {self.id} - {self.user}"


# 📜 Certificate
class Certificate(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.SET_NULL, null=True, blank=True)
    playlist = models.ForeignKey(Playlist, on_delete=models.SET_NULL, null=True, blank=True)
    certificate_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    download_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return str(self.certificate_id)

class UserActivityLog(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100)
    details = models.JSONField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.activity_type}"