'''from django.urls import path
from authtask import views

urlpatterns = [
    path('login/', views.loginview, name='login'),
    path('signup/', views.signupview, name='signup'),
    
]'''
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.auth_page, name='auth'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
]
