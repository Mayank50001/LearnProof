from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class ImportedContent(models.Model):
    YT_TYPE_CHOICES = (
        ('video' , 'Video'),
        ('playlist' , 'Playlist'),
    )

    user = models.ForeignKey(User , on_delete=models.CASCADE)
    yt_type = models.CharField(max_length=10, choices=YT_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    thumbnail = models.URLField()
    youtube_url = models.URLField()
    channel_title = models.CharField(max_length=255 , blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.yt_type}) - {self.user.username}"