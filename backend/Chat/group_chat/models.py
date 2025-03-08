from django.db import models
from message.models import message
# Create your models here.
class group_chat_room(models.Model):
    last_message=models.OneToOneField(message,on_delete=models.DO_NOTHING)
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now=True)
    name=models.CharField(max_length=200,default="group")
    description=models.TextField(max_length=400,blank=True,null=True)
    power_to_write=models.CharField(choices=[("0","All"),("1","Admin")],default="0")
    group_pic=models.ImageField(upload_to="uploads/group/",default="uploads/team.png")
