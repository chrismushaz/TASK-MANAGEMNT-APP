from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib import messages
from django.http import HttpResponseForbidden
from .models import Team, Task, Comment, Attachment

# Create your views here.
def index(request):
    return render(request, 'index.html')

def dashboard(request):
    teams = request.user.teams.all()
    tasks = Task.objects.filter(team__in=teams).order_by('-updated_at')  # Order by most recently updated
    task_statuses = [status[0] for status in Task.STATUS_CHOICES]  # Get status choices from model
    priorities = [priority[0] for priority in Task.PRIORITY_CHOICES]  # Get priority choices from model

    context = {
        'teams': teams,
        'tasks': tasks,
        'users': User.objects.exclude(id=request.user.id),
        'task_statuses': task_statuses,
        'priorities': priorities
    }
    
    return render(request, 'dashboard.html', context)

@login_required
def create_team(request):
    if request.method == 'POST':
        name = request.POST.get('team_name')
        if name:
            team = Team.objects.create(name=name, created_by=request.user)
            team.members.add(request.user)
            messages.success(request, f'Team "{name}" created successfully!')
        else:
            messages.error(request, 'Team name is required.')
    return redirect('dashboard')

@login_required
def invite_member(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        team_id = request.POST.get('team_id')
        try:
            team = Team.objects.get(id=team_id)
            user = User.objects.get(email=email)
            if user not in team.members.all():
                team.members.add(user)
                messages.success(request, f'{user.email} has been added to the team.')
            else:
                messages.info(request, f'{user.email} is already a team member.')
        except (Team.DoesNotExist, User.DoesNotExist):
            messages.error(request, 'Team or user not found.')
    return redirect('dashboard')

@login_required
def create_task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        priority = request.POST.get('priority')
        assignee_id = request.POST.get('assignee_id')
        team_id = request.POST.get('team_id')

        if title and description and team_id:
            team = Team.objects.get(id=team_id)
            assignee = User.objects.filter(id=assignee_id).first() if assignee_id else None
            
            task = Task.objects.create(
                title=title,
                description=description,
                priority=priority,
                assignee=assignee,
                team=team
            )
            messages.success(request, f'Task "{title}" created successfully!')
        else:
            messages.error(request, 'Title, description, and team are required.')
    return redirect('dashboard')

@login_required
def update_task_status(request, task_id):
    if request.method == 'POST':
        task = get_object_or_404(Task, id=task_id)
        
        # Check if user has permission to update this task
        if request.user not in task.team.members.all():
            return HttpResponseForbidden("You don't have permission to update this task.")
        
        new_status = request.POST.get('status')
        if new_status in [status[0] for status in Task.STATUS_CHOICES]:
            task.status = new_status
            task.save()
        
        return redirect('dashboard')
    return redirect('dashboard')

@login_required
def add_comment(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    if request.method == 'POST':
        text = request.POST.get('comment_text')
        if text:
            Comment.objects.create(
                task=task,
                author=request.user,
                text=text
            )
            messages.success(request, 'Comment added successfully!')
        else:
            messages.error(request, 'Comment text is required.')
    return redirect('dashboard')

@login_required
def add_attachment(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    if request.method == 'POST':
        file = request.FILES.get('attachment')
        if file:
            Attachment.objects.create(
                task=task,
                file=file
            )
            messages.success(request, 'Attachment added successfully!')
        else:
            messages.error(request, 'Please select a file to attach.')
    return redirect('dashboard')

@login_required
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    if request.method == 'POST':
        task_title = task.title
        task.delete()
        messages.success(request, f'Task "{task_title}" deleted successfully!')
    return redirect('dashboard')

'''from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Team, Task

@login_required
def dashboard(request):
    
    teams = request.user.teams.all()
    tasks = Task.objects.filter(team__in=teams)
    return render(request, 'dashboard.html', {
        'teams': teams,
        'tasks': tasks,
        'users': User.objects.exclude(id=request.user.id),
    })

@login_required
def create_team(request):
    if request.method == 'POST':
        name = request.POST.get('team_name')
        if name:
            team = Team.objects.create(name=name)
            team.members.add(request.user)
    return redirect('dashboard')

@login_required
def invite_member(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        team_id = request.POST.get('team_id')
        try:
            team = Team.objects.get(id=team_id)
            user = User.objects.get(email=email)
            team.members.add(user)
        except (Team.DoesNotExist, User.DoesNotExist):
            pass
    return redirect('dashboard')

@login_required
def create_task(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        priority = request.POST.get('priority')
        assignee_id = request.POST.get('assignee_id')
        team_id = request.POST.get('team_id')

        if title and description and team_id:
            team = Team.objects.get(id=team_id)
            assignee = User.objects.filter(id=assignee_id).first() if assignee_id else None
            Task.objects.create(
                title=title,
                description=description,
                priority=priority,
                assignee=assignee,
                created_by=request.user,
                team=team
            )
    return redirect('dashboard')'''
