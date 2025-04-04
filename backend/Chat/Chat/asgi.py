"""
ASGI config for Chat project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from channels.routing import URLRouter,ProtocolTypeRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddleware
from .routing import websocket_url_patterns
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Chat.settings')

application = ProtocolTypeRouter({
    "http":get_asgi_application(),
    "websocket":URLRouter(
            websocket_url_patterns
        )
    
})
