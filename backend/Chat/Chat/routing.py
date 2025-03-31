from django.urls import re_path
from message.consumer import msg_consumer
websocket_url_patterns=[
    re_path(r"ws/chat/$",msg_consumer.as_asgi())
]