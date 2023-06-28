# Generated by Django 4.2.2 on 2023-06-27 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Inventory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=240, verbose_name='name')),
                ('description', models.TextField()),
                ('quantity', models.PositiveIntegerField()),
            ],
        ),
    ]