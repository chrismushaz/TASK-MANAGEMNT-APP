'''from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib import messages

# Create your views here.



def signupview(request):
    return render(request, 'authentications/auth.html')  #  No tuple here
 # Redirect back to the registration page
        
def loginview(request):
    return render(request, 'authentications/auth.html')


def loginview(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Dummy check (replace with real authentication logic)
        if email == "test@example.com" and password == "1234":
            messages.success(request, "Login successful!")
            return redirect('login')  # or to dashboard
        else:
            messages.error(request, "Invalid credentials.")

    return render(request, 'authentications/auth.html', {'register': False})


def signupview(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm = request.POST.get('confirm_password')

        if password != confirm:
            messages.error(request, "Passwords do not match.")
        else:
            # Normally you'd save user to DB here
            messages.success(request, "Account created successfully.")
            return redirect('login')

    return render(request, 'authentications/auth.html', {'register': True})'''
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import logout
from django.shortcuts import redirect
def auth_page(request):
    return render(request, 'authentications/auth.html')
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib import messages

def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
            # Authenticate the user
            user = authenticate(request, username=user.username, password=password)
            
            if user is not None:
                auth_login(request, user)
                return redirect('dashboard')  # Redirect to the dashboard after login
            else:
                messages.error(request, 'Invalid credentials')  # Show error message if authentication fails
        except User.DoesNotExist:
            messages.error(request, 'User not found')  # Show error message if user doesn't exist
    
    # Render login form if it's a GET request or after an error
    return render(request, 'authentications/auth.html', {'register': False})  # Pass context to the template


'''def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect('dashboard')
            else:
                messages.error(request, 'Invalid credentials')
        except User.DoesNotExist:
            messages.error(request, 'User not found')
    
    return redirect('auth')  # or render again with context if you prefer'''

def register_view(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('auth')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already in use")
            return redirect('auth')

        username = email.split('@')[0]
        user = User.objects.create_user(username=username, email=email, password=password, first_name=full_name)
        user.save()
        messages.success(request, "Account created successfully. Please log in.")
        return redirect('auth')

    return redirect('auth')


def logout_view(request):
    logout(request)
    return redirect('login')