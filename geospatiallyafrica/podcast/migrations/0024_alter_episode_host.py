# Generated by Django 3.2.6 on 2022-02-12 11:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('podcast', '0023_episode_date_published'),
    ]

    operations = [
        migrations.AlterField(
            model_name='episode',
            name='host',
            field=models.CharField(choices=[('Iniobong Benson', 'Inobong'), ('Opeyemi Kazeem-Jimoh', 'Opeyemi')], max_length=500),
        ),
    ]