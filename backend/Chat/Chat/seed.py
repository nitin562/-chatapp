from faker import Faker
from django.contrib.auth.models import User
from two_way_users.models import two_way_user
from two_way_chat.models import two_way_chat_room
from group_chat.models import group_chat_room
from group_users.models import group_users
from message.models import message
from message_status.models import message_status
from django.db.models import Q
fake=Faker()

username="Nitin" #user: Nitin
sendername="Garg" #Garg
nitin=User.objects.get(username=username)
garg=User.objects.get(username=sendername)

#create chatusers
def init():
    text=fake.text(20)
    # Sending from Garg to Nitin
    msg=message(sender=garg,type="0",content=text)
    status=message_status.objects.create(stage="0")
    msg.status=status
    msg.save()
    print("message: ",msg)
    # Create Room
    room=two_way_chat_room.objects.create(last_message=msg,user1=nitin,user2=garg)
    print("room: ",room)
    msg.two_way_room=room
 
    msg.save()
    # create chat_users
    nitin_user=two_way_user.objects.create(chat=room,user=nitin)
    garg_user=two_way_user.objects.create(chat=room,user=garg)
    print("chat users: ",nitin_user,garg_user)

def send():
    text=fake.text(20)
    # Sending from Garg to Nitin
    msg=message(sender=garg,message_type="0",content=text)
    status=message_status.objects.create(stage="0")
    msg.status=status
    condition=Q(user1=nitin,user2=garg) or Q(user1=garg,user2=nitin)
    commonChatRoom=two_way_chat_room.objects.filter(condition).first()
    print(commonChatRoom)
    msg.two_way_room=commonChatRoom
    msg.save()
    if commonChatRoom:
        commonChatRoom.last_message=msg
        commonChatRoom.save() #last_message save

def createGroup():
    text=fake.text(20)
    # Sending from Garg to Nitin
    msg=message(sender=garg,message_type="0",content=text)
    status=message_status.objects.create(stage="0")
    msg.status=status
    msg.save()
    print("message: ",msg)
    # Create Room
    group=group_chat_room.objects.create(last_message=msg,name="Test Group")
    group.users.set([nitin,garg])
    msg.group_room=group
    msg.save()
    nitin_user=group_users.objects.create(chat=group,user=nitin)
    garg_user=group_users.objects.create(chat=group,user=garg)
    print("chat users: ",nitin_user,garg_user)


def sendToGroup():
    text=fake.text(20)
    # Sending from Garg to Nitin
    msg=message(sender=garg,message_type="0",content=text)
    status=message_status.objects.create(stage="0")
    msg.status=status
  
    commonChatRoom=group_chat_room.objects.filter(users=garg).first()
    print(commonChatRoom.users.all())
    msg.group_room=commonChatRoom
    msg.save()
    if commonChatRoom:
        commonChatRoom.last_message=msg
        commonChatRoom.save() #last_message save