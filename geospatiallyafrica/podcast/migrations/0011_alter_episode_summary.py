# Generated by Django 3.2.6 on 2021-08-28 22:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('podcast', '0010_episode_summary'),
    ]

    operations = [
        migrations.AlterField(
            model_name='episode',
            name='summary',
            field=models.CharField(max_length=300),
        ),
    ]