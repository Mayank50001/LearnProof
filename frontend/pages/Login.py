import streamlit as st
from utils.auth import login_user, create_user

st.title("👤 Login / Sign Up")

menu = ["Login", "Sign Up"]
choice = st.selectbox("Menu", menu)

email = st.text_input("Email")
password = st.text_input("Password", type="password")

if choice == "Login":
    if st.button("Login"):
        user = login_user(email, password)
        if user:
            st.success("Logged in successfully!")
            st.session_state["user"] = user

elif choice == "Sign Up":
    if st.button("Create Account"):
        user = create_user(email, password)
        if user:
            st.success("Account created! Go to Login.")
