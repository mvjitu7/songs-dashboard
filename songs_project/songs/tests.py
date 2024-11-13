# tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Song

class GetAllSongsTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create sample songs for testing with all required fields
        Song.objects.create(
            title='Song One',
            danceability=0.8,
            energy=0.7,
            duration_ms=210000,
            tempo=120.0,
            num_segments=5,
            num_sections=3,
            acousticness=0.3,
            rating=4
        )
        Song.objects.create(
            title='Song Two',
            danceability=0.6,
            energy=0.9,
            duration_ms=180000,
            tempo=130.0,
            num_segments=6,
            num_sections=4,
            acousticness=0.5,
            rating=3
        )
        Song.objects.create(
            title='Another Song',
            danceability=0.9,
            energy=0.5,
            duration_ms=200000,
            tempo=110.0,
            num_segments=7,
            num_sections=5,
            acousticness=0.4,
            rating=5
        )

    def test_get_all_songs_default(self):
        url = reverse('get_all_songs')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify that all songs are returned
        self.assertEqual(len(response.data['data']), 3)
        # Check pagination metadata
        self.assertIn('pagination', response.data)
        self.assertEqual(response.data['pagination']['total_records'], 3)

    def test_pagination(self):
        url = reverse('get_all_songs')
        # Request only 2 songs per page
        response = self.client.get(url, {'per_page': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 2)
        # Verify pagination details
        self.assertEqual(response.data['pagination']['total_pages'], 2)
        self.assertEqual(response.data['pagination']['next_page'], 2)

        # Fetch the second page
        response = self.client.get(url, {'per_page': 2, 'page': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['pagination']['current_page'], 2)
        self.assertIsNone(response.data['pagination']['next_page'])
        self.assertEqual(response.data['pagination']['prev_page'], 1)

    def test_sorting(self):
        url = reverse('get_all_songs')
        # Sort songs by 'danceability' in descending order
        response = self.client.get(url, {'sort_key': 'danceability', 'direction': 'desc'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data['data']
        # Verify that the songs are sorted correctly
        self.assertGreaterEqual(data[0]['danceability'], data[1]['danceability'])
        if len(data) > 2:
            self.assertGreaterEqual(data[1]['danceability'], data[2]['danceability'])

    def test_filter_by_title(self):
        url = reverse('get_all_songs')
        # Filter songs containing 'Song' in the title
        response = self.client.get(url, {'title': 'Song'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data['data']
        self.assertEqual(len(data), 3)  # Updated to expect 3 songs
        for song in data:
            self.assertIn('Song', song['title'])


    def test_invalid_per_page(self):
        url = reverse('get_all_songs')
        # Provide an invalid 'per_page' value
        response = self.client.get(url, {'per_page': 'invalid'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid per_page value. Must be an integer.')

    def test_invalid_sort_direction(self):
        url = reverse('get_all_songs')
        # Provide an invalid 'direction' value
        response = self.client.get(url, {'sort_key': 'title', 'direction': 'invalid'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data['data']
        # Should default to ascending order
        self.assertLessEqual(data[0]['title'].lower(), data[1]['title'].lower())
        if len(data) > 2:
            self.assertLessEqual(data[1]['title'].lower(), data[2]['title'].lower())

    def test_invalid_sort_key(self):
        url = reverse('get_all_songs')
        # Provide an invalid 'sort_key' value
        response = self.client.get(url, {'sort_key': 'invalid_field'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data['data']
        # Should default to sorting by 'title'
        self.assertLessEqual(data[0]['title'].lower(), data[1]['title'].lower())
        if len(data) > 2:
            self.assertLessEqual(data[1]['title'].lower(), data[2]['title'].lower())

    def test_empty_title_filter(self):
        url = reverse('get_all_songs')
        # Provide an empty title filter
        response = self.client.get(url, {'title': ''})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return all songs
        self.assertEqual(len(response.data['data']), 3)

    def test_nonexistent_page(self):
        url = reverse('get_all_songs')
        # Request a page number that doesn't exist
        response = self.client.get(url, {'page': 999})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('detail', response.data)

class RateSongTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        # Create a sample song for testing with all required fields
        cls.song = Song.objects.create(
            title='Song One',
            danceability=0.8,
            energy=0.7,
            duration_ms=210000,
            tempo=120.0,
            num_segments=5,
            num_sections=3,
            acousticness=0.3,
            rating=4
        )

    def test_rate_song_success(self):
        url = reverse('rate_song', args=[self.song.id])
        response = self.client.patch(url, {'rating': 5}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Rating updated successfully')
        self.assertEqual(response.data['rating'], 5)
        # Verify that the rating was updated in the database
        self.song.refresh_from_db()
        self.assertEqual(self.song.rating, 5)

    def test_rate_song_invalid_rating(self):
        url = reverse('rate_song', args=[self.song.id])
        # Provide an invalid rating value (e.g., 6)
        response = self.client.patch(url, {'rating': 6}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rating', response.data)
        self.assertEqual(response.data['rating'][0], 'Ensure this value is less than or equal to 5.')

    def test_rate_song_invalid_rating_type(self):
        url = reverse('rate_song', args=[self.song.id])
        # Provide a non-integer rating value
        response = self.client.patch(url, {'rating': 'bad_value'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rating', response.data)
        self.assertEqual(response.data['rating'][0], 'A valid integer is required.')

    def test_rate_song_missing_rating(self):
        url = reverse('rate_song', args=[self.song.id])
        # Do not provide a rating value
        response = self.client.patch(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rating', response.data)
        self.assertEqual(response.data['rating'][0], 'This field is required.')

    def test_rate_nonexistent_song(self):
        url = reverse('rate_song', args=[9999])  # Assuming this ID does not exist
        response = self.client.patch(url, {'rating': 3}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('detail', response.data)
        self.assertEqual(response.data['detail'], 'No Song matches the given query.')  # Updated message


    def test_rate_song_with_put_method(self):
        url = reverse('rate_song', args=[self.song.id])
        # Attempt to use PUT instead of PATCH
        response = self.client.put(url, {'rating': 5}, format='json')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertIn('detail', response.data)
        self.assertEqual(response.data['detail'], 'Method "PUT" not allowed.')


