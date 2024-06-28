import json
from django.shortcuts import render
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from .models import Course, Task

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        
        user_courses = Course.objects.filter(owner=request.user)
        
        return render(request, "index.html",{
            "user_courses" : user_courses
        })
        
    return render(request, "index.html")


def login_view(request):
    if request.method == "POST":

        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "login.html")


def register_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirm-password"]
        if password != confirmation:
            return render(request, "register.html", {
                "message": "Passwords must match."
            })
            
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "register.html", {
                "message": "Username already taken."
            })
        if user != None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        return render(request, "register.html")
    
    
    else:
        return render(request, "register.html")
    
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def practice(request,course_id):
    
    if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("login"))
    
    course = Course.objects.get(pk=course_id)
    tasks = Task.objects.filter(course=course)
    
    return render(request, "practice.html",{
        "course" : course
    })

def create(request,course_id,task_id):
    
    course = Course.objects.get(pk=course_id, owner=request.user)
    
    tasks = Task.objects.filter(course=course)
    try:
        task = Task.objects.get(pk=task_id, course=course)
    except Task.DoesNotExist:
        return HttpResponseRedirect(reverse("create", kwargs={"course_id":course_id, "task_id":tasks[0].pk}))

    
    return render(request, "create.html", {
        "course" : course,
        "tasks" : tasks,
        "task" : task
    })

@csrf_exempt
@login_required
def new_task(request,course_id):
    print("a")
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    pass

    try:
        course = Course.objects.get(pk=course_id, owner=request.user)

        task = Task(course=course, side="W", moves="")
        task.save()

        return JsonResponse({"id": task.pk}, status=201)
    except:
        return JsonResponse({"error": "error"}, status=500)

@csrf_exempt
@login_required
def save_task(request,course_id,task_index):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)


    try:      
        course = Course.objects.get(pk=course_id, owner=request.user)
        
        task = Task.objects.get(pk=task_index, course=course)
        
        data = json.loads(request.body)
        
        task.side = data.get("side")
        
        moves = data.get("moves")
        moves_str = ""
        for move in moves:
            moves_str = moves_str + "/" + move
        task.moves = moves_str
        task.pgn = data.get("pgn")
        
        task.save()
        
        return JsonResponse({"Message": ""}, status=201)
    except:
        return JsonResponse({"error": "error"}, status=500)

@csrf_exempt
@login_required
def delete_task(request,course_id,task_index):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    try:    

        course = Course.objects.get(pk=course_id, owner=request.user)

        tasks = Task.objects.filter(course=course)
        if len(tasks) == 1:
            return JsonResponse({"error": "error"}, status=500)

        task = Task.objects.get(pk=task_index, course=course)
        
        

        task.delete()
        return JsonResponse({"": ""}, status=201)


    except:
        print("b")  
        return JsonResponse({"error": "error"}, status=500)
    



def new_course(request):
    
    # check if user logged in
    if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("login"))

    # redirect
    if request.method != "POST":
        return render(request, "new-course.html")
    
    # create the course
    name = (request.POST["name"]).strip()
    public = request.POST["public"]
    if name == "":
        return render(request, "new-course.html", {
                "message": "A name is needed."
            })
    match public:
        case "True":
            public = True
        case "False":
            public = False
        case _:
            return render(request, "new-course.html", {
                "message": "A type is needed."
            })
            

    try:
        course = Course(owner=request.user, name=name, public=public)
        course.save()
        task = Task(course=course, side="W", moves="")
        task.save()
    except:
        return render(request, "new-course.html", {
            "message": "There's been a problem."
        })
    
    return HttpResponseRedirect(reverse("create", kwargs={"course_id":course.pk, "task_id":task.pk}))
    
@csrf_exempt
@login_required
def get_moves(request,course_id):
    course = Course.objects.get(pk=course_id)
    tasks = Task.objects.filter(course=course)
    
    moves = []
    sides = []
    for task in tasks:
        moves.append(task.moves)
        sides.append(task.side)
    
    return JsonResponse({"moves": moves,
                         "sides": sides,
                         "len" : len(tasks)}, status=201)
    
    

def my_practices(request):
    # check if user logged in
    if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("login"))
        
    user_courses = Course.objects.filter(owner=request.user)
    return render(request, "myPractices.html", {
        "user_courses" : user_courses
    })
    

def search_course(request):
    name = request.GET.get("name", "")
    courses = Course.objects.filter(name__icontains=name, public=True)[:50]
    return render(request, "search.html", {
        "user_courses" : courses
    })
    

def copy(request, course_id):
    
    if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("login"))
    
    course = Course.objects.get(pk=course_id)
    tasks = Task.objects.filter(course=course)
    

    new_course = Course(owner=request.user, name=course.name, public=False)
    new_course.save()
    
    tasks = Task.objects.filter(course=course)
    
    for task in tasks:
        new_task = Task(course=new_course, side=task.side, moves=task.moves, pgn=task.pgn)
        new_task.save()

    
    return HttpResponseRedirect(reverse("create", kwargs={"course_id":new_course.pk, "task_id":0}))