from django import forms
from .models import chat_user
from django.contrib.auth.models import User


class UserForm(forms.ModelForm):
    class Meta:
        model=chat_user
        fields=["description","profile_pic"]
    username=forms.CharField(max_length=50)
    first_name=forms.CharField(max_length=50)
    last_name=forms.CharField(max_length=50,required=False)
    email=forms.EmailField(max_length=50)
    password=forms.CharField(widget=forms.PasswordInput)
    
    
    def clean_email(self):
        email = self.cleaned_data.get("email")
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("Email is already registered.")
        return email

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError("Username already exists.")
        return username

class LoginForm(forms.Form):
    user_or_email=forms.CharField(required=True)
    password=forms.CharField(widget=forms.PasswordInput,required=True)
    filter_by=forms.ChoiceField(choices=(("email","email"),("username","username")))
    def clean_user_or_email(self):
        data = self.cleaned_data["user_or_email"]
        filter_by=self.data["filter_by"]
        arg={filter_by:data}
        exist=User.objects.filter(**arg).exists()
        if not exist:
            raise forms.ValidationError(f"Invalid {filter_by}")
        return data
    
    def authenticate(self):
        data = self.cleaned_data["user_or_email"]
        filter_by=self.data["filter_by"]
        arg={filter_by:data}
        user = User.objects.filter(**arg)[0]
        raw_password=self.cleaned_data["password"]
        if user.check_password(raw_password=raw_password):
            return user
        return None

    

    