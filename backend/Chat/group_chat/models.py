from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class group_chat_room(models.Model):
    last_message=models.OneToOneField('message.message',null=True,on_delete=models.DO_NOTHING)
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now=True,db_index=True)
    name=models.CharField(max_length=200,default="group")
    description=models.TextField(max_length=400,blank=True,null=True)
    power_to_write=models.CharField(max_length=1,choices=[("0","All"),("1","Admin")],default="0")
    users=models.ManyToManyField(User,related_name="room")
    group_pic=models.ImageField(upload_to="uploads/group/",default="uploads/team.png")
