import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

cred_path = os.getenv("FIREBASE_CREDENTIALS")

# Development fallback - use default credentials if available
if not cred_path or not os.path.exists(cred_path):
    try:
        # Try to use default credentials (for development)
        firebase_admin.initialize_app()
        print("Using default Firebase credentials")
    except Exception as e:
        raise RuntimeError(
            f"Firebase credentials not found. Check .env file. Error: {e}"
        )
else:
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

db = firestore.client()

