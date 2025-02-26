
from django.shortcuts import render
from django.http import JsonResponse
from django.views.generic import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .forms import UserForm,LoginForm
from django.contrib.auth.models import User
from .token import createJWT
from Chat.Responses import success,failure
# Create your views here.
@method_decorator(csrf_exempt,name="dispatch")
class user_add_view(View):
  def post(self,request,*args, **kwargs):
    form=UserForm(request.POST,request.FILES)
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
    
@method_decorator(csrf_exempt,name="dispatch")
class login_view(View):
  def post(self,request,*args,**kwargs):
    form=LoginForm(request.POST)
    print(request.POST)
    if form.is_valid():
      user=form.authenticate()
      if(not user):
        form.add_error("password","Password is incorrect.")
        return JsonResponse(failure(400,form.errors.get_json_data()).to_dict())
      
      payload={
        "id":user.id, # we can get chat_user using user.chat_user
        "email":user.email
      }
      token=createJWT(payload,hours=2)
      return JsonResponse(success(200,{"token":token}).to_dict())
    else:
      return JsonResponse(failure(400,form.errors.get_json_data()).to_dict())

      
      
      
    
