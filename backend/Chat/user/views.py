
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.generic import View
from django.forms.models import model_to_dict
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.decorators import method_decorator
from .forms import UserForm,LoginForm
from django.contrib.auth.models import User
from .token import createJWT
from Chat.Responses import success,failure
import json
# Create your views here.
# @method_decorator(csrf_exempt,name="dispatch")
class user_add_view(View):
  def post(self,request,*args, **kwargs):
    form=UserForm(request.POST,request.FILES)
    print(request.FILES)
    if form.is_valid():
      instance=form.save(commit=False)
      #user model fields to create required dict
      user_model_fields=["username","first_name","email","last_name"]
      # dictionary to pass into create()
      userFields={key:form.cleaned_data.get(key) for key in user_model_fields if key in form.cleaned_data}
      # creating user instance
      user=User.objects.create(**userFields)
      user.set_password(raw_password=form.cleaned_data.get("password"))
      user.save()
      instance.user=user
      instance.save()
      # Creating Token
      payload={
        "id":user.id, # we can get chat_user using user.chat_user
        "email":user.email
      }
      token=createJWT(payload,hours=2)
      return JsonResponse(success(200,{"token":token}).to_dict())
    else:
      print(form.cleaned_data.get("profile_pic"))
      return JsonResponse(failure(400,form.errors.get_json_data()).to_dict())
    
# @method_decorator(csrf_exempt,name="dispatch")
class login_view(View):
  def post(self,request,*args,**kwargs):
    # here post data is json data but it is stringified
    
    data=json.loads(request.body)
    form=LoginForm(data)
    
    if form.is_valid():
      user=form.authenticate()
      if(not user):
        form.add_error("password","Password is incorrect.")
        return JsonResponse(failure(400,form.errors.get_json_data()).to_dict())
      
      payload={
        "id":user.id, # we can get chat_user using user.chat_user
        "email":user.email
      }
      user.custom.is_online=True
      user.custom.save()
      token=createJWT(payload,hours=2)
      return JsonResponse(success(200,{"token":token}).to_dict())
    else:
      return JsonResponse(failure(400,form.errors.get_json_data()).to_dict())


# API to manipulate user information
class user_manipulate(View):
  def get(self,request,*args, **kwargs):
    print(request.user)
    user=model_to_dict(request.user,fields=["first_name","last_name","email","username"])
    additional_custom_user=model_to_dict(request.user.custom,fields=["description","is_online"])
    print(additional_custom_user,request.user.custom.last_seen)
    additional_custom_user["profile_pic"]=request.user.custom.profile_pic.url
    additional_custom_user["last_seen"]=request.user.custom.last_seen
    additional_custom_user["created"]=request.user.custom.created
    user["demographic"]=additional_custom_user
    return JsonResponse(success(200,user).to_dict())
  
  def post(self,request,*args,**kwargs):
    print(request.GET)
    form=UserForm(request.POST,request.FILES,instance=request.user)
    form.full_clean()
    field=request.GET.get("change")
    if form.has_error(field):
      return JsonResponse(failure(400,{field:form.errors.get(field)[0]}).to_dict())
    
    custom_fields=["profile_pic","description"]
    updatedField=None
    if field in custom_fields:
      if field=="profile_pic":
        getattr(request.user.custom,field).delete(save=False)
      setattr(request.user.custom,field,form.cleaned_data.get(field))
      request.user.custom.save()
    else:
      setattr(request.user,field,form.cleaned_data.get(field))
      request.user.save()
      
    
    if field in custom_fields:
      updatedField=getattr(request.user.custom,field)
      if(field=="profile_pic"):
        updatedField=updatedField.url
    else:
      updatedField=getattr(request.user,field)
    

    
 
    return JsonResponse(success(200,{"message":"Changed","update":updatedField}).to_dict())

def getCsrfToken(request):
  if request.method=="GET":
      csrftoken=get_token(request)
      print(csrftoken)
      return JsonResponse(success(200,csrftoken).to_dict()) 
      
      
    
