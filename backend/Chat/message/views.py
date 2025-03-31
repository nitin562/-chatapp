from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View
from django.http.response import JsonResponse
from Chat.Responses import success,failure
from django.db.models import Q,Case,When,Value,F
from django.db import models
from message.models import message
from django.db import transaction
from two_way_chat.models import two_way_chat_room
from two_way_users.models import two_way_user
from channels.layers import get_channel_layer
from message_status.models import message_status
from asgiref.sync import async_to_sync
# Create your views here.
@method_decorator(csrf_exempt,name="dispatch")
class messageView(View):
    def get(self,request,*args, **kwargs):
        user=request.user
        queryset= message.objects.select_related("two_way_room","sender","status").prefetch_related("group_room__users","status").filter(Q(two_way_room__user1=user) | Q(two_way_room__user2=user) | Q(group_room__users=user)).annotate(
            chat_id=Case(
                When(two_way_room=None,then=F("group_room__id")),
                When(group_room=None,then=F("two_way_room__id")),
                output_field=models.CharField()
            ),
            chat_type=Case(
                When(two_way_room=None,then=Value("Group")),
                When(group_room=None,then=Value("Self")),
                output_field=models.CharField()

            ),
            sender_uname=F("sender__username"),
            sender_fname=F("sender__first_name"),
            data=Case(
                When(message_type="0",then=F("content")),
                default=F("attachment"),
                output_field=models.CharField()
            ),
            delivered=Case(
                When(status__delivered_time=None,then=Value(False)),
                default=Value(True),
                output_field=models.CharField()

            ),
            seen=Case(
                When(status__seen_time=None,then=Value(False)),
                default=Value(True),
                output_field=models.CharField()
            ),
        ).values("id","chat_id","chat_type","sender_uname","sender_fname","message_type","data","delivered","seen","created").order_by("created")

        # group
        print(queryset)
        grouped={}
        for msg in queryset:
            key=msg["chat_type"]+str(msg["chat_id"])
            if key in grouped:
                
                grouped[key].append(msg)
            else:
                grouped[key]=[msg]
        
   
        return JsonResponse(success(200,grouped).to_dict())
    
    # add a first message to direct chat using api
   
    def post(self,request,*args, **kwargs):
        user=request.user
        # for a message in new direct chat, we first create chatroom and their users then message
        to=request.POST.get("to",None) #id
        to_username=request.POST.get("to_username")
        msg_type=request.POST.get("msg_type",None)
        with transaction.atomic():
            try:
                chat_room=two_way_chat_room.objects.create(
                    user1=user,
                    user2_id=to,
                )
                msg=message(
                    sender=user,
                    message_type=msg_type,
                    two_way_room=chat_room
                )
                data=None
                if msg_type=='0':
                    msg.content=request.POST.get("data","")
                    data=msg.content
                else:
                    if request.FILES.get("file",None):
                        msg.attachment=request.FILES.get("file")
                        data=msg.attachment.url
                msg.save()
                two_way_user.objects.bulk_create([
                    two_way_user(user=user,chat=chat_room),
                    two_way_user(user_id=to,chat=chat_room)
                ])
                message_payload={
                        "id":msg.id,"chat_id":chat_room.id,"chat_type":"Self","sender_uname":user.username,"sender_fname":user.first_name,"message_type":msg_type,"data":data,"created":msg.created.isoformat()
                        }
                try:
                    channel_layer=get_channel_layer()
                    async_to_sync(channel_layer.group_send)(
                        to_username,
                        {
                            "type":"send_to_self",
                            "payload":{
                                "chat_new":True,
                                "message":message_payload,
                                "chat_extra_info":{
                                    "img":user.custom.profile_pic.url
                                }
                            }
                        }
                    )
                except Exception as e:
                    print(e)

                
                return JsonResponse(success(200,message_payload).to_dict())
            except Exception as e:
                print(e,"outer")
                return JsonResponse(failure(500,"Database Error occurred").to_dict())
            