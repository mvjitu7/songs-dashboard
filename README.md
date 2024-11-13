
# Songs Dashboard

A full-stack music project built with Django for the backend and React for the frontend. This application provides a dashboard for viewing, filtering, sorting, and rating songs, with the option to download song data as a CSV file.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Requirements](#requirements)
3. [Setup Instructions](#setup-instructions)
4. [Backend - Django](#backend---django)
5. [Frontend - React](#frontend---react)
6. [Running Tests](#running-tests)
7. [Notes](#notes)

---

## Project Structure

```plaintext
songs-dashboard/
├── env/                          # Virtual environment 
├── songs_project/                # Backend (Django)
│   ├── manage.py
│   ├── db.sqlite3                # SQLite database (for development)
│   ├── requirements.txt          # Python dependencies for the backend
│   ├── normalized_songs.csv      # Sample data for songs (loaded using management command)
│   ├── songs/                    # Django app
│   │   ├── management/
│   │   │   └── commands/
│   │   │       └── load_data.py  # Script to load data from CSV
│   └── songs_project/            # Django project settings
└── songs-dashboard/              # Frontend (React)
    ├── public/                   # Public assets
    ├── src/
    │   ├── api/                  # API functions for interacting with backend
    │   ├── components/           # React components
    │   │   ├── Charts.jsx
    │   │   └── SongsTable.jsx
    │   ├── App.js                # Main App component
    │   ├── index.js              # React entry point
    │   
    ├── package.json              # Node dependencies for the frontend
    └── .gitignore
```

---

## Requirements

- **Python 3.x** and **pip**
- **Node.js** and **npm**
- **Virtual Environment** (recommended for Django backend)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mvjitu7/songs-dashboard.git
cd songs-dashboard
```

### 2. Install Backend Dependencies

#### Navigate to the `songs_project` directory:

```bash
cd songs_project
```

#### Create and activate a virtual environment:

```bash
python -m venv env
source env/bin/activate  # On macOS/Linux
env\Scripts\activate     # On Windows
```

#### Install Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies

#### Navigate to the `songs-dashboard` directory:

```bash
cd ../songs-dashboard
```

#### Install Node dependencies:

```bash
npm install
```

---

## Backend - Django

### Setup Database

If you’re using the default SQLite database:

```bash
# Navigate to the backend directory if not already there
cd songs_project

# Run migrations
python manage.py migrate
```

### Load Initial Data from CSV

To load initial song data from `normalized_songs.csv` file, run the custom Django management command:

```bash
python manage.py load_data
```

This command reads data from `songs_project/normalized_songs.csv` and populates the database with song records.

### Create a Superuser (optional)

To access the Django admin panel, create a superuser:

```bash
python manage.py createsuperuser
```

### Run the Django Server

Start the Django development server:

```bash
python manage.py runserver
```

By default, the server will be available at `http://127.0.0.1:8000`.

### API Endpoints

- **Get All Songs**: `GET /api/songs/`
- **Search Songs by Title**: `GET /api/songs/?title=<title>`
- **Rate a Song**: `PATCH /api/songs/<id>/rate/`

---

## Frontend - React

### Configure API Endpoint

Ensure that the frontend is configured to point to the correct backend URL (usually `http://127.0.0.1:8000` for local development). This might be set in an environment variable or a configuration file within the `songs-dashboard/src/api` folder.

### Run the React Development Server

Navigate to the `songs-dashboard` directory and start the React development server:

```bash
npm start
```

By default, the React app will be available at `http://localhost:3000`.

---

## Running Tests

### Backend Tests (Django)

To run the Django tests, navigate to the `songs_project` directory and run:

```bash
python manage.py test
```

This will execute all backend tests defined in `tests.py`.

---

## Notes

- **Environment Variables**: You can set up a `.env` file for the backend to store environment-specific variables, like database settings or secret keys.
- **Static Files**: For production, remember to run Django’s `collectstatic` command and configure a web server to serve static files.

---

## Troubleshooting

- **Common Errors**: If you encounter issues with missing dependencies, make sure both `requirements.txt` and `package.json` dependencies are installed.
- **Database Errors**: Ensure migrations are applied (`python manage.py migrate`).
- **API Connectivity**: Ensure the backend server is running and the frontend is correctly configured to point to the backend.

---

## License

This project is licensed under the MIT License.
