from django.urls import path

from . import views

urlpatterns = [
    path('', views.apiOverview, name='index'),
    path('task-list/', views.taskList, name='task-list'),
    path('<str:pk>/task-detail/', views.taskDetail, name='task-detail'),
    path('task-create/', views.taskCreate, name='task-create'),
    path('<str:pk>/task-edit/', views.taskEdit, name='task-edit'),
    path('<str:pk>/task-delete/', views.taskDelete, name='task-delete'),
]