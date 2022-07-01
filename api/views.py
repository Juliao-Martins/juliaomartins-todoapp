from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import TaskSerializers

from .models import Task


@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        'Task list': '/api/task-list/',
        'Detail view': '/api/<str:pk>/task-detail/',
        'Task create': '/api/task-create/',
        'Task edit': '/api/<str:pk>/task-edit/',
        'Task delte': '/api/<str:pk>/task-delete/',
    }
    return Response(api_urls)



@api_view(['GET'])
def taskList(request):
    task = Task.objects.all()
    response = TaskSerializers(task, many=True)
    return Response(response.data)



@api_view(['GET'])
def taskDetail(request, pk):
    task = get_object_or_404(Task, pk=pk)
    response = TaskSerializers(task, many=False)
    return Response(response.data)


@api_view(['POST'])
def taskCreate(request):
    task = TaskSerializers(data=request.data)
    if task.is_valid():
        task.save()
    return Response(task.data)



@api_view(['POST'])
def taskEdit(request, pk):
    selected_task = get_object_or_404(Task, pk=pk)
    task = TaskSerializers(data=request.data, instance=selected_task)
    if task.is_valid():
        task.save()
    return Response(task.data)



@api_view(['DELETE'])
def taskDelete(request, pk):
    task = get_object_or_404(Task, pk=pk)
    task.delete()
    return Response('Item has deleted!')