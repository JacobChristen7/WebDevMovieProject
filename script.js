/*---------------------------
    Global Variables
    ---------------------------*/

const hamburgerMenu = document.getElementById("menuButton");
let currentPage = 1;
const moviesPerPage = 20;
let isSearchMode = false;  // Track whether we're in search mode
let searchQuery = '';  // Store the search query
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const ratingFilter = document.getElementById('ratingFilter');
const applyFilters = document.getElementById('applyFilters');
const dropdownTrigger = document.getElementById('dropdown-trigger');
const dropdownBox = document.getElementById('dropdown-box')

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
        searchQuery = e.target.value.trim();  
        currentPage = 1;
        isSearchMode = true;  
        searchMovies(searchQuery, currentPage, false);  // Apply search & filters
    }
});

document.getElementById('searchButton').addEventListener('click', () => {
    searchQuery = document.getElementById('searchInput').value.trim();  
    if (searchQuery !== '') {
        currentPage = 1;
        isSearchMode = true;  
        searchMovies(searchQuery, currentPage, false);
    }
});

// Show/Hide Dropdown on Hover
dropdownTrigger.addEventListener('mouseenter', () => dropdownBox.classList.remove('hidden'));
dropdownBox.addEventListener('mouseleave', () => dropdownBox.classList.add('hidden'));

// Event Listener for Apply Filters Button
applyFilters.addEventListener('click', () => {
    currentPage = 1;  // Reset pagination
    fetchFilteredMovies(currentPage, false);  // Load filtered movies (clear container)
    dropdownBox.classList.add('hidden'); // Close dropdown
    isSearchMode = false;  // Ensure Load More works correctly for filters
});

// Call fetchGenres when the page loads
fetchGenres();

document.getElementById('loadMoreButton').addEventListener('click', () => {
    currentPage++; 
    if (isSearchMode) {
        searchMovies(searchQuery, currentPage, true);  // Append search results with filters
    } else {
        fetchFilteredMovies(currentPage, true);  // Append filtered results
    }
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

// Fetch Genres from TMDB API
async function fetchGenres() {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    
    genreFilter.innerHTML = '<option value="">All Genres</option>';
    data.genres.forEach(genre => {
        genreFilter.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
    });
}

// Filter Movies Function
async function fetchFilteredMovies(page = 1, append = false) {
    const genre = genreFilter.value;
    const year = yearFilter.value;
    const rating = ratingFilter.value;

    let filterUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`;

    if (genre) filterUrl += `&with_genres=${genre}`;
    if (year) filterUrl += `&primary_release_year=${year}`;
    if (rating) filterUrl += `&vote_average.gte=${rating}`;

    try {
        const response = await fetch(filterUrl);
        const data = await response.json();

        // If append is false, clear existing movies
        displayMovies(data.results, !append);
    } catch (error) {
        console.error("Error fetching filtered movies:", error);
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

async function searchMovies(query, page = 1, append = false) {
    const genre = genreFilter.value;
    const year = yearFilter.value;
    const rating = ratingFilter.value;

    let searchUrl = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;

    try {
        const response = await fetch(searchUrl);
        const data = await response.json();

        // Apply filtering manually after fetching search results
        let filteredMovies = data.results;

        if (genre) {
            filteredMovies = filteredMovies.filter(movie => movie.genre_ids.includes(parseInt(genre)));
        }
        if (year) {
            filteredMovies = filteredMovies.filter(movie => movie.release_date && movie.release_date.startsWith(year));
        }
        if (rating) {
            filteredMovies = filteredMovies.filter(movie => movie.vote_average >= parseFloat(rating));
        }

        // If append is false, clear the container before displaying new results
        displayMovies(filteredMovies, !append);

        // Update the heading with search results
        const header = document.getElementById('popularMoviesHeader');
        header.innerHTML = `
            Showing Results For
            <span class="text-red-500 bg-gray-800 text-4xl mt-8 px-3 py-2">${query}</span>
        `;

    } catch (error) {
        console.error("Error searching movies:", error);
    }
}

// Gets popular movies on page load
fetchPopularMovies();