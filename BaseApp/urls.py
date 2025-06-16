"""
URL configuration for BaseApp project.

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
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required

def redirect_to_dashboard(request):
    if request.user.is_authenticated:
        return redirect('dashboard')
    return redirect('auth')

urlpatterns = [
    path('', redirect_to_dashboard, name='home'),
    path('admin/', admin.site.urls),
    path('', include('Base.urls')),  # Include URLs from the management app
    path('auth/', include('authtask.urls')),  # Include URLs from the auth app
]
