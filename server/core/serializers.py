from rest_framework import serializers
from .models import Times, Client, Employee


class SalesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Times
        fields = ['id','file']

class ClientSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Client
        fields = ['id','FullName','Wilaya','Email','PhoneNumber','Function']


class EmployeeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Employee
        fields = ['id','FullName','Wilaya','Email','PhoneNumber','Function']

	