from django.contrib.auth.models import User
from django.db import models
class chat_user(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    profile_pic=models.ImageField(upload_to="uploads/user/")
    description=models.CharField(max_length=200)
    created=models.DateField(auto_now_add=True)