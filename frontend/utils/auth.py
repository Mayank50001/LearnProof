import requests
import streamlit as st

backend_url = "http://localhost:8000/api"

def login_user(email, password):
    try:
        res = requests.post(f"{backend_url}/login/", json={"email": email, "password": password})
        if res.status_code == 200:
            return res.json()
        else:
            try:
                st.error(res.json().get("error", "Login failed"))
            except:
                st.error(res.text or "Login failed")
    except Exception as e:
        st.error(f"Request failed: {e}")
    return None

def create_user(email, password):
    try:
        res = requests.post(f"{backend_url}/signup/", json={"email": email, "password": password})
        if res.status_code == 201:
            return res.json()
        else:
            try:
                st.error(res.json().get("error", "Signup failed"))
            except:
                st.error(res.text or "Signup failed")
    except Exception as e:
        st.error(f"Request failed: {e}")
    return None
