/*---------------------------
    Global Variables
    ---------------------------*/

const hamburgerMenu = document.getElementById("menuButton");
let currentPage = 1;
const moviesPerPage = 20;
let isSearchMode = false;  // Track whether we're in search mode
let searchQuery = '';  // Store the search query

const API_KEY = "bc44aff762863c9f76e5249ca577be5c";
const BASE_URL = "https://api.themoviedb.org/3";

/*---------------------------
    Event Liastners
    ---------------------------*/

hamburgerMenu.addEventListener("click", function() {
    document.getElementById("mobileMenu").classList.toggle('hidden');
});

document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        searchQuery = e.target.value.trim();  // Update the search query
        currentPage = 1;  // Reset page number for new search
        isSearchMode = true;  // Switch to search mode
        searchMovies(searchQuery);  // Perform the search
    }
});

document.getElementById('searchButton').addEventListener('click', () => {
    searchQuery = document.getElementById('searchInput').value.trim();  
    if (searchQuery !== '') {
        currentPage = 1;  // Reset page number for new search
        isSearchMode = true;  // Switch to search mode
        searchMovies(searchQuery);  // Perform the search
    }
});

document.getElementById('loadMoreButton').addEventListener('click', () => {
    currentPage++; 
    isSearchMode ? searchMovies(searchQuery, currentPage) : fetchPopularMovies(currentPage);
});

/*---------------------------
    Functions
    ---------------------------*/

// Function to fetch and display popular movies
async function fetchPopularMovies(page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        const data = await response.json();
        displayMovies(data.results, false); // Append new movies without clearing
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

// Function to display movies on the page
function displayMovies(movies, clearContainer = false) {
    const container = document.getElementById('moviesContainer');

    if (clearContainer) {
        container.innerHTML = '';
    }

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('bg-gray-800', 'rounded-lg', 'p-2', 'text-center');
        movieElement.innerHTML = `
            <a href="movieDetails.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="rounded-lg">
                <h3 class="text-lg mt-2">${movie.title}</h3>
                <p class="text-sm text-gray-400">${movie.release_date}</p>
            </a>
        `;
        container.appendChild(movieElement);
    });
}

async function searchMovies(query, page = 1) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Only clear the container on the first page
        const clearContainer = page === 1;

        displayMovies(data.results, clearContainer);

        // Update the heading with search results
        const header = document.getElementById('popularMoviesHeader');
        header.innerHTML = `
            Showing Results For
            <span class="text-red-500 bg-gray-800 text-4xl mt-8 px-3 py-2">${query}</span>
        `;
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

// Gets popular movies on page load
fetchPopularMovies();