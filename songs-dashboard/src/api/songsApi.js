import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 5000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

const handleApiError = (error) => {
    if (error.response) {
        console.error('API Error:', error.response.data);
        throw error.response.data;
    } else if (error.request) {
        console.error('Network Error:', error.request);
        throw { error: 'Network Error' };
    } else {
        console.error('Error:', error.message);
        throw { error: error.message };
    }
};

export const fetchSongs = async (
    page = 1,
    sortKey = 'title',
    direction = 'asc',
    perPage = 10,
    title = ''
) => {
    try {
        const response = await apiClient.get('/songs/', {
            params: { page, per_page: perPage, sort_key: sortKey, direction, title },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const rateSong = async (id, rating) => {
    try {
        const response = await apiClient.patch(`/songs/${id}/rate/`, { rating });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};