"""
URL configuration for Chat project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.urls import path,include
from .views import user_add_view,login_view,getCsrfToken,user_manipulate
urlpatterns = [
    path('register/',user_add_view.as_view(),name="register"),
    path('login/',login_view.as_view(),name="login"),
    path('csrf_token/',getCsrfToken,name="csrf_token"),
    path("profile/",user_manipulate.as_view(),name="user")
]
