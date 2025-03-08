from django.contrib.auth.models import User
from django.db import models
class chat_user(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name="custom")
    profile_pic=models.ImageField(upload_to="uploads/user/",default="uploads/user.png")
    description=models.CharField(max_length=200,null=True,blank=True)
    created=models.DateField(auto_now_add=True)
    last_seen=models.DateTimeField(auto_now_add=True)
    is_online=models.BooleanField(default=False)