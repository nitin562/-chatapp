import jwt
from .token import secret
from django.contrib.auth.models import User
from django.http import JsonResponse
from Chat.Responses import failure

ExcludedPaths=["/api/user/register/","/api/user/login/","/api/user/csrf_token/"]
class JWT_AuthMiddleWare:
    def __init__(self,get_response):
        self.get_response=get_response

    def __call__(self, request):
        if request.path in ExcludedPaths or request.path.startswith("/media") or request.path.startswith("/admin"):
            return self.get_response(request)
        token_header=request.headers.get("Authorization")
        if token_header and token_header.startswith("Bearer "):
            token=token_header.split(" ")[1]
            try:
                payload=jwt.decode(token,secret,algorithms="HS256")
                print(type(payload))
                user=User.objects.filter(id=payload["id"])
                if(not user.exists()):
                    return JsonResponse(failure(400,{"type":"token","msg":"User not found, Relogin to Continue"}).to_dict())
                request.user=user[0]
                return self.get_response(request) #next
            except jwt.exceptions.ExpiredSignatureError:
                return JsonResponse(failure(400,{"type":"token","msg":"Session Expired, login again"}).to_dict())
            except jwt.exceptions.InvalidTokenError:
                return JsonResponse(failure(400,{"type":"token","msg":"Session invalid, login again"}).to_dict())
            except Exception as e:
                print(e)
                return JsonResponse(failure(400,{"type":"token","msg":"Server Error occurred, login again"}).to_dict())
        else:
            return JsonResponse(failure(400,{"type":"token","msg":"Session not found, login again"}).to_dict())