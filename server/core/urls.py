from django.urls import path, include, re_path
from rest_framework import routers
from .views import SalesView, FileUploadView, ClientView, EmployeeView, FileUpload

app_name = 'core'


router = routers.DefaultRouter()
# router.register(r'values', viewset=SalesView, basename='values')
# router.register(r'clients', viewset=ClientView, basename='clients')
# router.register(r'employees', viewset=EmployeeView, basename='employees')

urlpatterns = [
    path('', include(router.urls)),
    re_path(r'^upload/(?P<filename>[^/]+)$',
            FileUploadView.as_view(), name="view1"),
    path('file', FileUpload.as_view(), name="view2"),
]
