# Generated by Django 5.1.3 on 2024-11-13 01:43

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('danceability', models.FloatField()),
                ('energy', models.FloatField()),
                ('duration_ms', models.IntegerField()),
                ('tempo', models.FloatField()),
                ('num_segments', models.IntegerField()),
                ('num_sections', models.IntegerField()),
                ('acousticness', models.FloatField()),
                ('rating', models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]
