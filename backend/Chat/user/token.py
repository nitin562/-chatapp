import jwt
from datetime import datetime, timedelta,timezone
secret="sec123$5" # secret key

#creating jwt
def createJWT(payload,hours):
  expiry=datetime.now(tz=timezone.utc)+timedelta(hours=hours)
  payload["exp"]=expiry
  return jwt.encode(payload,secret,algorithm="HS256")
