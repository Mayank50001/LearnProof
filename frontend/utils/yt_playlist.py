from googleapiclient.discovery import build
import re
from .google_api_key import apiKey

YOUTUBE_API_KEY = apiKey  # <-- Yahan apna API key daal dena

def extract_playlist_id(url):
    match = re.search(r"[?&]list=([a-zA-Z0-9_-]+)", url)
    return match.group(1) if match else None

def get_playlist_videos(playlist_url):
    playlist_id = extract_playlist_id(playlist_url)
    if not playlist_id:
        print("Invalid playlist URL")
        return None

    youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

    videos = []
    next_page_token = None

    while True:
        pl_request = youtube.playlistItems().list(
            part="snippet",
            playlistId=playlist_id,
            maxResults=50,
            pageToken=next_page_token
        )

        pl_response = pl_request.execute()

        for item in pl_response['items']:
            video_title = item['snippet']['title']
            video_id = item['snippet']['resourceId']['videoId']
            video_url = f"https://www.youtube.com/watch?v={video_id}"

            videos.append({
                "title": video_title,
                "url": video_url
            })

        next_page_token = pl_response.get('nextPageToken')

        if not next_page_token:
            break

    return videos
