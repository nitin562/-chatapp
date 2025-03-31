from django.urls import path,include
from .views import messageView

urlpatterns = [
  path("messages/",messageView.as_view(),name="conversations")
]
