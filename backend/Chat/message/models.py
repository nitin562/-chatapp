from django.db import models
from django.contrib.auth.models import User
from two_way_chat.models import two_way_chat_room
from group_chat.models import group_chat_room
from message_status.models import message_status
# Create your models here.
class message(models.Model):
    sender=models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name="messages")
    two_way_room=models.ForeignKey(two_way_chat_room,null=True,on_delete=models.CASCADE,related_name="messages")
    group_room=models.ForeignKey(group_chat_room,null=True,on_delete=models.CASCADE,related_name="messages")
    created=models.DateTimeField(auto_now_add=True)
    type=models.CharField(choices=[("0","text"),("1","Audio"),("2","Video"),("3","Image"),("4","Document")])
    # Data to be stored
    attachment=models.FileField(upload_to="uploads/group/attachment/",null=True,blank=True)
    image=models.ImageField(upload_to="uploads/group/images/",null=True,blank=True)
    content=models.TextField(null=True,blank=True)
    status=models.OneToOneField(message_status,on_delete=models.SET_NULL)
