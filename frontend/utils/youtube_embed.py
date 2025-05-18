from urllib.parse import urlparse, parse_qs


def get_youtube_embed(url):
    video_id = None

    if "youtube.com" in url:
        query = parse_qs(urlparse(url).query)
        video_id = query.get("v" , [None])[0]
    elif "youtu.be" in url:
        video_id = url.split("/")[-1]

    return f"https://www.youtube.com/embed/{video_id}" if video_id else None