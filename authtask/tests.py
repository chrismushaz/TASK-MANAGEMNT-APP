from django.test import TestCase
from django.test import TestCase
from .models import Task

class TaskModelTest(TestCase):
    def test_task_creation(self):
        task = Task.objects.create(title="Test Task", status="To Do")
        self.assertEqual(task.title, "Test Task")
        self.assertEqual(task.status, "To Do")

# Create your tests here.
