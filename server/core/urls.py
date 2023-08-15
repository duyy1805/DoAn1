from django.urls import path, include, re_path
from rest_framework import routers
from .views import SalesView, FileUploadView, TES, DES, SES, RNN, Arima, AutoArima, FileUpload

app_name = 'core'


router = routers.DefaultRouter()
# router.register(r'values', viewset=SalesView, basename='values')
# router.register(r'clients', viewset=ClientView, basename='clients')
# router.register(r'employees', viewset=EmployeeView, basename='employees')

urlpatterns = [
    # path('', include(router.urls)),
    # re_path(r'^upload/(?P<filename>[^/]+)$',
    #         FileUploadView.as_view(), name="view1"),
    path('file', FileUpload.as_view(), name="view2"),
    path('autoarima', AutoArima.as_view(), name="view3"),
    path('arima', Arima.as_view(), name="view4"),
    path('rnn', RNN.as_view(), name="view5"),
    path('ses', SES.as_view(), name="view6"),
    path('des', DES.as_view(), name="view7"),
    path('tes', TES.as_view(), name="view8"),
]
