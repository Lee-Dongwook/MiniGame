from fastapi import Header, HTTPException
from firebase_admin import auth as fb_auth

def verify_firebase_token(authorization:str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise ValueError('Invalid auth scheme')
        decode_token  = fb_auth.verify_id_token(token)
        return decode_token['uid']
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")