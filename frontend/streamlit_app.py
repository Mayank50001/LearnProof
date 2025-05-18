import streamlit as st
from utils.firebase_auth import login_user , create_user
from utils.youtube_embed import get_youtube_embed
from utils.yt_playlist import get_playlist_videos

st.title("📺 LearnProof – YouTube Course Verifier")

menu = ["Login" , "Sign Up"]
choice = st.sidebar.selectbox("Menu" , menu)

email = st.sidebar.text_input("Email")
password = st.sidebar.text_input("Password" , type='password')

if choice == "Login":
    if st.sidebar.button("Login"):
        user = login_user(email , password)
        if user:
            st.success("Logged in successfully!")
            st.session_state['user'] = user
        else:
            st.error("Invalid credentials")

elif choice == "Sign Up":
    if st.sidebar.button("Create Account"):
        user = create_user(email, password)
        if user:
            st.success("Account created! Go to Login.")
        else:
            st.error("Signup failed")



if 'user' in st.session_state:
    st.subheader("Paste YouTube Video Link: ")
    video_url = st.text_input("Enter video URL")

    if video_url:
        if "playlist?list=" in video_url:
            st.subheader("🎞 Playlist Detected!")
            videos = get_playlist_videos(video_url)
            if videos:
                st.success(f"Found {len(videos)} videos:")
                video_titles = [video["title"] for video in videos]
                selected_video = st.selectbox("Select a video to watch" , video_titles)

                # Find the selected video
                selected = next((video for video in videos if video["title"] == selected_video), None)
                if selected:
                    embed_url = get_youtube_embed(selected["url"])
                    if embed_url:
                        st.markdown(
                            f"<iframe width='700' height='400' src='{embed_url}' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>",
                            unsafe_allow_html=True
                        )
            else:
                st.error("Could not fetch playlist videos.")
        
        else:
            embed_url = get_youtube_embed(video_url)
            if embed_url:
                st.markdown(
                    f"<iframe width='700' height='400' src='{embed_url}' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></iframe>",
                    unsafe_allow_html=True
                )
            else:
                st.warning("Invalid YouTube URL")