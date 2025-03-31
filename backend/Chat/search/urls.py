from django.urls import path,include
from .views import SearchView,SearchByUser

urlpatterns = [
  path("conversations/",SearchView.as_view(),name="conversations"),
  path("search/",SearchByUser,name="search")
]
