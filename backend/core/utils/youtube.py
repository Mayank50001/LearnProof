from googleapiclient.discovery import build
import re
from datetime import timedelta
import isodate
from .apikey import youtubekey

YOUTUBE_API_KEY = youtubekey

def extract_id(youtube_url):
    """Extract video or playlist ID from YouTube URL"""
    # Video ID patterns
    video_patterns = [
        r"(?:v=|youtu\.be/|embed/|watch\?v=)([a-zA-Z0-9_-]{11})",
        r"youtu\.be/([a-zA-Z0-9_-]{11})"
    ]
    
    for pattern in video_patterns:
        v_match = re.search(pattern, youtube_url)
        if v_match:
            return 'video', v_match.group(1)
    
    # Playlist ID
    p_match = re.search(r"(?:list=)([a-zA-Z0-9_-]+)", youtube_url)
    if p_match:
        return 'playlist', p_match.group(1)
    
    return None, None

def format_duration(duration_str):
    """Convert ISO 8601 duration to readable format"""
    try:
        duration = isodate.parse_duration(duration_str)
        total_seconds = int(duration.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        
        if hours > 0:
            return f"{hours}:{minutes:02d}:{seconds:02d}"
        else:
            return f"{minutes}:{seconds:02d}"
    except:
        return duration_str

def get_youtube_metadata(youtube_url, max_playlist_videos=None):
    """Get metadata for YouTube video or playlist
    
    Args:
        youtube_url: YouTube URL
        max_playlist_videos: Maximum videos to fetch for playlists (None = all videos)
    """
    try:
        yt = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)
        content_type, content_id = extract_id(youtube_url)
        
        if not content_type or not content_id:
            return {"error": "Invalid YouTube URL"}
        
        if content_type == 'video':
            res = yt.videos().list(
                part="snippet,contentDetails,statistics", 
                id=content_id
            ).execute()
            
            if not res["items"]:
                return {"error": "Video not found"}
            
            item = res["items"][0]
            snippet = item["snippet"]
            content_details = item["contentDetails"]
            stats = item.get("statistics", {})
            
            return {
                "type": "video",
                "id": content_id,
                "title": snippet["title"],
                "description": snippet.get("description", ""),
                "channel": snippet["channelTitle"],
                "published_at": snippet["publishedAt"],
                "thumbnail": snippet["thumbnails"]["high"]["url"],
                "duration": format_duration(content_details["duration"]),
                "view_count": stats.get("viewCount", "0"),
                "like_count": stats.get("likeCount", "0"),
                "url": f"https://www.youtube.com/watch?v={content_id}"
            }
            
        elif content_type == 'playlist':
            # Get playlist details
            pl_res = yt.playlists().list(
                part="snippet,contentDetails", 
                id=content_id
            ).execute()
            
            if not pl_res["items"]:
                return {"error": "Playlist not found"}
            
            playlist_item = pl_res["items"][0]
            snippet = playlist_item["snippet"]
            content_details = playlist_item["contentDetails"]
            
            # Get all playlist items with pagination
            videos = []
            next_page_token = None
            videos_fetched = 0
            
            while True:
                # Calculate how many to fetch in this request
                if max_playlist_videos:
                    remaining = max_playlist_videos - videos_fetched
                    if remaining <= 0:
                        break
                    current_max = min(50, remaining)
                else:
                    current_max = 50
                
                items_res = yt.playlistItems().list(
                    part="snippet", 
                    playlistId=content_id, 
                    maxResults=current_max,
                    pageToken=next_page_token
                ).execute()
                
                # Process current page videos
                for v in items_res.get("items", []):
                    if v["snippet"]["resourceId"]["kind"] == "youtube#video":
                        videos.append({
                            "video_id": v["snippet"]["resourceId"]["videoId"],
                            "title": v["snippet"]["title"],
                            "position": v["snippet"]["position"] + 1,
                            "url": f"https://www.youtube.com/watch?v={v['snippet']['resourceId']['videoId']}"
                        })
                        videos_fetched += 1
                        
                        # Break if we've reached the limit
                        if max_playlist_videos and videos_fetched >= max_playlist_videos:
                            break
                
                # Check if there are more pages and we haven't hit our limit
                next_page_token = items_res.get("nextPageToken")
                if not next_page_token or (max_playlist_videos and videos_fetched >= max_playlist_videos):
                    break
            
            return {
                "type": "playlist",
                "id": content_id,
                "title": snippet["title"],
                "description": snippet.get("description", ""),
                "channel": snippet["channelTitle"],
                "published_at": snippet["publishedAt"],
                "thumbnail": snippet["thumbnails"]["high"]["url"],
                "video_count": content_details["itemCount"],
                "videos": videos,
                "total_videos_fetched": len(videos),
                "url": f"https://www.youtube.com/playlist?list={content_id}"
            }
            
    except Exception as e:
        return {"error": f"API Error: {str(e)}"}
    
    return {"error": "Unknown content type"}

# Example usage
if __name__ == "__main__":
    # Test with video
    video_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    print("Video metadata:")
    print(get_youtube_metadata(video_url))
    
    # Test with playlist (limit to 100 videos)
    playlist_url = "https://www.youtube.com/playlist?list=PL590L5WQmH8dsxxz7ooJAgmijwOz0lh2H"
    print("\nPlaylist metadata (first 100 videos):")
    print(get_youtube_metadata(playlist_url, max_playlist_videos=100))
    
    # Test with playlist (all videos)
    print("\nPlaylist metadata (all videos):")
    print(get_youtube_metadata(playlist_url))