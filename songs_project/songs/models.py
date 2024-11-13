from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Song(models.Model):
    title = models.CharField(max_length=255)
    danceability = models.FloatField()
    energy = models.FloatField()
    duration_ms = models.IntegerField()
    tempo = models.FloatField()
    num_segments = models.IntegerField()
    num_sections = models.IntegerField()
    acousticness = models.FloatField()
    rating = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        ordering = ['id']  
