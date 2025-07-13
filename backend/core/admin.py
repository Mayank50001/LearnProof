from django.contrib import admin
from .models import Certificate , Playlist , Video , UserProfile, Quiz , UserActivityLog
# Register your models here.
admin.site.register(Certificate)
admin.site.register(Playlist)
admin.site.register(Video)
admin.site.register(UserProfile)
admin.site.register(Quiz)
admin.site.register(UserActivityLog)