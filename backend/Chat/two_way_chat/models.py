from django.db import models

# Create your models here.
class two_way_chat_room(models.Model):
    last_message=models.OneToOneField('message.message',on_delete=models.DO_NOTHING)
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now=True)
