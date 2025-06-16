from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.dashboard, name='dashboard'),
    
    # Team management
    path('team/create/', views.create_team, name='create_team'),
    path('team/invite/', views.invite_member, name='invite_member'),
    
    # Task management
    path('task/create/', views.create_task, name='create_task'),
    path('task/<int:task_id>/update-status/', views.update_task_status, name='update_task_status'),
    path('task/<int:task_id>/delete/', views.delete_task, name='delete_task'),
    
    # Comments and attachments
    path('task/<int:task_id>/comment/', views.add_comment, name='add_comment'),
    path('task/<int:task_id>/attachment/', views.add_attachment, name='add_attachment'),
]