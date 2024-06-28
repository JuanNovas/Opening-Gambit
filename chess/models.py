from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Course(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    public = models.BooleanField(default=False)

class Task(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    side = models.CharField(max_length=5)
    moves = models.TextField(default="")
    pgn = models.TextField(default="")