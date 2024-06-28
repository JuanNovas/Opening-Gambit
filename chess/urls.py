from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("register", views.register_view, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("practice/<int:course_id>", views.practice, name="practice"),
    path("courses/<str:course_id>/<int:task_id>", views.create, name="create"),
    path("new-course", views.new_course, name="new-course"),
    path("courses", views.my_practices, name="my courses"),
    path("search", views.search_course, name="search"),
    path("copy/<int:course_id>", views.copy, name="copy"),
    
    
    
    #api
    path("new/<int:course_id>", views.new_task, name="new task"),
    path("save/<str:course_id>/<int:task_index>", views.save_task, name="save task"),
    path("delete/<str:course_id>/<int:task_index>", views.delete_task, name="delete task"),
    path("moves/<int:course_id>", views.get_moves, name="moves")
]