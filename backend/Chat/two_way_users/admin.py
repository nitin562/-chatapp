from django.contrib import admin
from two_way_users.models import two_way_user
from two_way_chat.models import two_way_chat_room
from message.models import message
from group_users.models import group_users
from group_chat.models import group_chat_room
from message_status.models import message_status
# Register your models here.
admin.site.register(two_way_chat_room)
admin.site.register(two_way_user)
admin.site.register(message)
admin.site.register(group_chat_room)
admin.site.register(group_users)
admin.site.register(message_status)





