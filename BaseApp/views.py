from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from .models import Task

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