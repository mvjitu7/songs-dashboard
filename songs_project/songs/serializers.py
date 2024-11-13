from rest_framework import serializers
from .models import Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = '__all__'

class RatingSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)