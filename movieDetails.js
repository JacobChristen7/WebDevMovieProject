const API_KEY = "bc44aff762863c9f76e5249ca577be5c";
const BASE_URL = "https://api.themoviedb.org/3";

let movie; // Declare movie globally

// Get movie ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Fetch and display movie details
async function fetchMovieDetails() {
    try {
        // Fetch movie details
        const movieResponse = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        movie = await movieResponse.json(); // Assign to global variable

        // Fetch cast details
        const castResponse = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
        const castData = await castResponse.json();

        // Get first 20 cast members
        const castList = castData.cast.slice(0, 20).map(actor => `
            <div class="text-center">
                <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'placeholder.jpg'}" 
                     alt="${actor.name}" 
                     class="w-24 h-24 object-cover rounded-full mx-auto mb-2">
                <p class="text-sm font-semibold">${actor.name}</p>
                <p class="text-xs text-gray-400">${actor.character}</p>
            </div>
        `).join('');

        // Render the movie details and cast
        document.getElementById('movieDetails').innerHTML = `
            <div class="flex flex-col md:flex-row gap-10">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="rounded-lg w-full md:w-1/3">
                <div class="flex flex-col justify-center">
                    <h1 class="text-5xl font-bold mb-6">${movie.title}</h1>
                    <p class="text-xl mb-8 leading-relaxed">${movie.overview}</p>
                    <p class="text-gray-400 mb-2">🎬 Release Date: ${movie.release_date}</p>
                    <p class="text-gray-400 mb-2">🎥 Runtime: ${movie.runtime} minutes</p>
                    <p class="text-gray-400 mb-8">⭐ Rating: ${movie.vote_average}</p>
                    <div class="flex flex-wrap gap-2">
                        ${movie.genres.map(genre => `
                            <span class="bg-gray-600 text-white text-sm font-semibold px-4 py-1 rounded-full">${genre.name}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            <h2 class="text-3xl font-bold mt-10 mb-6">Cast List:</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                ${castList}
            </div>
        `;
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

fetchMovieDetails();

window.onload = function () {
    document.getElementById('saveMovieButton').addEventListener('click', () => {
        if (movie) {
            saveMovieToLocalStorage({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                release_date: movie.release_date
            });
        } else {
            console.error('Movie data not loaded yet.');
        }
    });
};

// Show notification
function showNotification(message) {
    const notification = document.getElementById('movieSavedNotification');
    notification.textContent = message;
    notification.classList.add('show');

    // Remove the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

function saveMovieToLocalStorage(movie) {
    let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];

    const movieExists = savedMovies.some(savedMovie => savedMovie.id === movie.id);

    if (!movieExists) {
        savedMovies.push(movie);
        localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
        showNotification("Movie has been saved!");
    } else {
        showNotification("Movie is already saved.");
    }
}