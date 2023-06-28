from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UserSerializer
from .models import User
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=['GET'])
    def getProfile(self, request, *args, **kwargs):
        user_id = request.user.id
        profile = User.objects.get(id=user_id)
        serializer = UserSerializer(profile)

        # Customize the response data and structure
        response_data = {
            "success": True,
            "data": serializer.data,
            "message": "Success get profile data"
        }

        return Response(response_data)
    
    def retrieve(self, request, *args, **kwargs):
        pass

    def list(self, request, *args, **kwargs):
        pass

    def create(self, request, *args, **kwargs):
        pass

    def update(self, request, *args, **kwargs):
        pass

    def destroy(self, request, *args, **kwargs):
        pass
