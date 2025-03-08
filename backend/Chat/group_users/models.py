from django.db import models
from django.contrib.auth.models import User
from group_chat.models import group_chat_room
# Create your models here.
class group_users(models.Model):
    chat=models.ForeignKey(group_chat_room,on_delete=models.DO_NOTHING,related_name="users")
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="chats")
    role=models.CharField(choices=[("0","Admin"),("1","user")],default="0")
    joined=models.DateTimeField(auto_now_add=True)
    
    
