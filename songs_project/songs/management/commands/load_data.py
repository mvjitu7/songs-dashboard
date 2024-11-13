import pandas as pd
from songs.models import Song
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        data = pd.read_csv('normalized_songs.csv')
        for _, row in data.iterrows():
            Song.objects.create(
                title=row['title'],
                danceability=row['danceability'],
                energy=row['energy'],
                duration_ms=row['duration_ms'],
                tempo=row['tempo'],
                num_segments=row['num_segments'],
                num_sections=row['num_sections'],
                acousticness=row['acousticness'],
            )