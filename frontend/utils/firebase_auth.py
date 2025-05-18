import pyrebase

firebase_config = {
    "apiKey" : "AIzaSyAV96gY3SvsfMtiu7F_NdZlrR5a5ecxxs8",
    "authDomain" : "learnproof.firebaseapp.com",
    "databaseURL": "https://learnproof.firebaseio.com",
    "projectId" : "learnproof",
    "storageBucket" : "learnproof.firebasestorage.app",
    "messagingSenderId" : "74980993962",
    "appId" : "1:74980993962:web:6982678c8b00970b08d9d3",
}

firebase = pyrebase.initialize_app(firebase_config)
auth = firebase.auth()

def login_user(email , password):
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        return user
    except:
        return None
    
def create_user(email , password):
    try:
        user = auth.create_user_with_email_and_password(email, password)
        return user
    except Exception as e:
        print("Sign up error:", e)
        return None
