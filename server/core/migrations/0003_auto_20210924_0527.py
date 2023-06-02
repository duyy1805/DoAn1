# Generated by Django 2.2.14 on 2021-09-24 04:27

from django.db import migrations, models
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_alter_sales_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('FullName', models.CharField(max_length=100)),
                ('Wilaya', models.CharField(max_length=50)),
                ('Email', models.EmailField(max_length=254)),
                ('PhoneNumber', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None)),
                ('Function', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('FullName', models.CharField(max_length=100)),
                ('Wilaya', models.CharField(max_length=50)),
                ('Email', models.EmailField(max_length=254)),
                ('PhoneNumber', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None)),
                ('Function', models.CharField(max_length=50)),
            ],
        ),
        migrations.AlterField(
            model_name='values',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
