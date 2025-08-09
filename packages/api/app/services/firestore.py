import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

cred_path = os.getenv("FIREBASE_CREDENTIALS")
if not cred_path or not os.path.exists(cred_path):
    raise RuntimeError("Firebase credentials not found. Check .env file.")

if not firebase_admin._apps:
 cred = credentials.Certificate(cred_path)
 firebase_admin.initialize_app(cred)

db = firestore.client()

