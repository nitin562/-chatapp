from django.http import JsonResponse
from Chat.Responses import success,failure
from django.db.models import F
from django.views.generic import View
from django.contrib.auth.models import User
from two_way_chat.models import two_way_chat_room
from group_chat.models import group_chat_room
from django.db.models import Q,Case,When,Value
from django.db import models
from django.db.models.functions import Concat
from django.conf import settings
# Create your views here.
class SearchView(View):
    def get(self,request):

        querysetForTwoWay=two_way_chat_room.objects.select_related("user1","user2").prefetch_related("user1__custom","user2__custom").filter(Q(user1=request.user) | Q(user2=request.user)).annotate(name=Case(
            When(user1=request.user,then=F("user2__first_name")),
            When(user2=request.user,then=F("user1__first_name")),
            default=Value("Unknown"),output_field=models.CharField()
        ),img=Case(
            When(user1=request.user,then=Concat(Value(settings.MEDIA_URL),F("user2__custom__profile_pic"))),
            When(user2=request.user,then=Concat(Value(settings.MEDIA_URL),F("user1__custom__profile_pic"))),
            default=Value(""),output_field=models.CharField()
        )).values("id","updated","name","img",type=Value("Self"))

        querysetForGroup=group_chat_room.objects.prefetch_related("users").filter(users=request.user).annotate(img=Case(
            default=Concat(Value(settings.MEDIA_URL),F("group_pic")),output_field=models.CharField())).values("id","updated","name","img",type=Value("Group"))


        queryset=querysetForTwoWay.union(querysetForGroup).order_by("updated")
        

        return JsonResponse(success(200,list(queryset)).to_dict())
        

def SearchByUser(request):
    if request.method=="GET":
        value=request.GET.get("value",None)
        print(value)
        if(not value):
            return JsonResponse(success(200,[]).to_dict())
        
        #nitin
        condition=(~Q(id=request.user.id) & ~Q(is_superuser=True))&(Q(username__icontains=value) | Q(first_name__icontains=value) | Q(last_name__icontains=value) | Q(email__icontains=value))
        users=User.objects.prefetch_related("custom").filter(condition).annotate(
            name=F("username"),
            img=F("custom__profile_pic"),
            user_id=F("id"),
            type=Value("Self"),
            created=F("custom__created")
            
        ).values("name","img","user_id","type","created")
        print(users)
        return JsonResponse(success(200,list(users)).to_dict())
     