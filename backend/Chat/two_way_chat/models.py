from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class two_way_chat_room(models.Model):
    user1=models.ForeignKey(User,null=True,on_delete=models.SET_NULL,related_name="chat_user1")
    user2=models.ForeignKey(User,null=True,on_delete=models.SET_NULL,related_name="chat_user2")
    last_message=models.OneToOneField('message.message',null=True,on_delete=models.DO_NOTHING)
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now=True,db_index=True)
    