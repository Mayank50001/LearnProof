import streamlit as st
import requests

backend_url = "http://localhost:8000/api"

if "user" not in st.session_state:
    st.warning("Please login from the Login page.")
    st.stop()

st.title("📺 Course Watcher")

video_url = st.text_input("Enter video or playlist URL")

if video_url:
    if "playlist?list=" in video_url:
        st.subheader("🎞 Playlist Detected!")
        with st.spinner("Fetching playlist...."):
            res = requests.post(f"{backend_url}/get_playlist/", json={"url": video_url})
            if res.status_code == 200:
                videos = res.json().get("videos", [])
                st.success(f"Found {len(videos)} videos.")
                titles = [v["title"] for v in videos]
                selected_title = st.selectbox("Choose video", titles)
                selected = next((v for v in videos if v["title"] == selected_title), None)
                if selected:
                    embed = requests.post(f"{backend_url}/get_embed/", json={"url": selected["url"]})
                    st.markdown(
                        f"<iframe width='700' height='400' src='{embed.json().get('embed_url')}' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>",
                        unsafe_allow_html=True
                    )
            else:
                st.error("Error fetching playlist.")
    else:
        res = requests.post(f"{backend_url}/get_embed/", json={"url": video_url})
        if res.status_code == 200:
            embed_url = res.json().get("embed_url")
            st.markdown(
                f"<iframe width='700' height='400' src='{embed_url}' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>",
                unsafe_allow_html=True
            )
        else:
            st.warning("Invalid URL or embed failed.")
