from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import jwt
from user.token import secret
from django.contrib.auth.models import User
from message.models import message
from group_chat.models import group_chat_room
from two_way_chat.models import two_way_chat_room

class msg_consumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.authenticated=False
        await self.accept()
        await self.send_json({
            "event_name":"authenticate"
        })
        print("Connect")


    async def receive_json(self, content):
        print(content)
        if(content["event_name"]=="token_authenticate"):
            await self.authenticateToken(content["payload"])
            return
        
        if not self.authenticated:
            self.send_json({
                "type":"error",
                "payload":"You are not authenticated."
            })

        
        if content["event_name"]=="join":
            await self.join_groups(content["payload"])
        elif content["event_name"]=="send":
            await self.send_msg_to_room_channels(content["payload"])


    async def disconnect(self, code):
        await self.close()
        for group in self.groups:
            self.channel_layer.group_discard(group,self.channel_name)
        self.groups.clear()
        print("disconnect")
        

    # custom functions used in recieve
    async def join_groups(self,groups):
        await self.channel_layer.group_add(self.user.username,self.channel_name)
        self.groups.append(self.user.username)
        for group_name in groups:
            await self.channel_layer.group_add(group_name,self.channel_name)
            self.groups.append(group_name)
        await self.send_json({
            "type":"join",
            "payload":"Groups Joined"
        })
        print(self.groups)
      
    async def send_msg_to_room_channels(self,content):
        # reciever_uname,data,type_data, chat_id,chat_type
        try:
            msg=await self.saveMessage(content)
            message_payload={
                    "id":msg.id,"chat_id":content["chat_id"],"chat_type":content["chat_type"],"sender_uname":self.user.username,"sender_fname":self.user.first_name,"message_type":content["type_data"],"data":content["data"],"created":msg.created.isoformat()
                            }
            await self.channel_layer.group_send(
                content["reciever_uname"],
                {"type":"send_to_self",
                "payload":message_payload}
            )
        except Exception as e:
            print(e)
            await self.send_json({
                "type":"error",
                "payload":"Sending Failed"
            })
    
    async def send_to_self(self,content):
        await self.send_json({
            "type":"recieve_msg",
            "payload":content["payload"]
        })

    @database_sync_to_async
    def saveMessage(self,message_data):
        data_type=message_data["type_data"]
        data=message_data["data"] # string an text or storage url
        msg=message(sender=self.user,message_type=message_data["type_data"])
        if data_type=="0":
            msg.content=data
        else:
            msg.attachment=data
        
       
        if message_data["chat_type"]=="Self":
            msg.two_way_room_id=message_data["chat_id"]
        else:
            msg.group_room_id=message_data["chat_id"]
        msg.save()
        return msg
    
    async def authenticateToken(self,token):
        msg=None
        try:
            payload=jwt.decode(token,secret,algorithms="HS256")
            print(payload)
            user=await database_sync_to_async(lambda:User.objects.filter(id=payload["id"]).first())()
            
            if(not user):
                msg="User not found, Relogin to Continue"
            else:
                self.user=user

        except jwt.exceptions.ExpiredSignatureError:
            msg="Session Expired, login again"
        except jwt.exceptions.InvalidTokenError:
            msg="Session invalid, login again"
        except Exception as e:
            print(e)
            msg="Server Error occurred, login again"
        
        if msg:
            await self.send_json({
                "type":"error",
                "payload":msg
            })
        else:
            self.authenticated=True
            await self.send_json({
                "type":"authenticated",
                "payload":True
            })
    