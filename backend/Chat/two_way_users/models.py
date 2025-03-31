from django.db import models
from django.contrib.auth.models import User
from two_way_chat.models import two_way_chat_room
# Create your models here.
class two_way_user(models.Model):
    chat=models.ForeignKey(two_way_chat_room,on_delete=models.CASCADE,related_name="users")
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="chat_user_property")
    type=models.CharField(max_length=4,default="Self")
