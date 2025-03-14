from django.db import models

# Create your models here.
class message_status(models.Model):
    stage=models.CharField(max_length=1,choices=[("0","Pending"),("1","Delivered"),("2","Seen")])
    time=models.DateTimeField(auto_now=True) 