# Generated by Django 3.2.6 on 2021-09-08 23:02

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('podcast', '0011_alter_episode_summary'),
    ]

    operations = [
        migrations.AddField(
            model_name='episode',
            name='created_date',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]