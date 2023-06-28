from django.shortcuts import render
from rest_framework import viewsets
from .serializers import InventorySerializer
from .models import Inventory
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied


class InventoryView(viewsets.ModelViewSet):
    serializer_class = InventorySerializer
    queryset = Inventory.objects.all()  # Add JWT authentication
    permission_classes = (IsAuthenticated,)

    def isAdmin(self, user):
        if user.role != "admin":
            response = {
                'success': False,
                'message': 'You are not authorized to perform this action'
            }
            raise PermissionDenied(response)
    

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)

        # Customize the response data and structure
        response_data = {
            "success": True,
            "data": serializer.data,
            "message": "Success get data"
        }

        return Response(response_data)

    def create(self, request, *args, **kwargs):
        self.isAdmin(request.user)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Customize the response data and structure
        response_data = {
            "success": True,
            "data": serializer.data,
            "message": "Success create data"
            }

        return Response(response_data, status=201)

    def update(self, request, *args, **kwargs):
        self.isAdmin(request.user)

        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Customize the response data and structure
        response_data = {
            "success": True,
            "data": serializer.data,
            "message": "Success update data"
        }

        return Response(response_data)

    def destroy(self, request, *args, **kwargs):
        self.isAdmin(request.user)
        
        instance = self.get_object()
        self.perform_destroy(instance)

        # Customize the response data and structure
        response_data = {
            "success": True,
            "data": None,
            "message": "Success delete data"
        }

        return Response(response_data)
