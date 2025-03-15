const API_KEY = "bc44aff762863c9f76e5249ca577be5c";
const BASE_URL = "https://api.themoviedb.org/3";

// Get movie ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Fetch and display movie details
async function fetchMovieDetails() {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const movie = await response.json();

        document.getElementById('movieDetails').innerHTML = `
            <h1 class="text-4xl font-bold mb-5">${movie.title}</h1>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="rounded-lg mb-5">
            <p class="text-lg mb-5">${movie.overview}</p>
            <p class="text-gray-400">Release Date: ${movie.release_date}</p>
            <p class="text-gray-400">Rating: ${movie.vote_average}</p>
        `;
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

fetchMovieDetails();