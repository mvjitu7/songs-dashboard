from django.shortcuts import get_object_or_404
from django.db.models.functions import Lower
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import status, serializers
from .models import Song
from .serializers import SongSerializer, RatingSerializer

# Helper functions
def get_pagination_metadata(paginator, page):
    return {
        'total_records': page.paginator.count,
        'current_page': page.number,
        'total_pages': page.paginator.num_pages,
        'next_page': page.next_page_number() if page.has_next() else None,
        'prev_page': page.previous_page_number() if page.has_previous() else None
    }

def apply_sorting(queryset, sort_key, sort_direction):
    valid_fields = [f.name for f in Song._meta.fields]
    if sort_key not in valid_fields:
        sort_key = 'title'  # Default sort key

    if sort_direction not in ['asc', 'desc']:
        sort_direction = 'asc'

    sort_field = Lower(sort_key)
    if sort_direction == 'desc':
        return queryset.order_by(sort_field.desc())
    else:
        return queryset.order_by(sort_field.asc())

# Serializer for rating
#class RatingSerializer(serializers.Serializer):
    #rating = serializers.IntegerField(min_value=1, max_value=5)

@api_view(['GET'])
def get_all_songs(request):
    paginator = PageNumberPagination()
    try:
        paginator.page_size = int(request.query_params.get('per_page', 10))
    except ValueError:
        return Response(
            {'error': 'Invalid per_page value. Must be an integer.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Retrieve sorting parameters
    sort_key = request.query_params.get('sort_key', 'title')
    sort_direction = request.query_params.get('direction', 'asc')

    # Retrieve title filter
    title = request.query_params.get('title', '')

    # Filter songs if title is provided
    songs = Song.objects.all()
    if title:
        songs = songs.filter(title__icontains=title)

    # Apply sorting and pagination
    songs = apply_sorting(songs, sort_key, sort_direction)
    result_page = paginator.paginate_queryset(songs, request)
    serializer = SongSerializer(result_page, many=True)

    return Response({
        'data': serializer.data,
        'pagination': get_pagination_metadata(paginator, paginator.page)
    })

@api_view(['PATCH'])
def rate_song(request, id):
    song = get_object_or_404(Song, id=id)
    serializer = RatingSerializer(data=request.data)
    if serializer.is_valid():
        song.rating = serializer.validated_data['rating']
        song.save()
        return Response(
            {'message': 'Rating updated successfully', 'rating': song.rating},
            status=status.HTTP_200_OK
        )
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)