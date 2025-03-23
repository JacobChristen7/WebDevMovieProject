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

/*---------------------------
    Mobile Menu Functionality
---------------------------*/

const mobileMenu = document.getElementById("mobileMenu");
const mobileSearchContainer = document.createElement("div");
const mobileFilterContainer = document.createElement("div");
const mobileSearchToggle = document.createElement("button");
const mobileFilterToggle = document.createElement("button");

// Configure Mobile Search Toggle
mobileSearchToggle.textContent = "🔍 Search Movies";
mobileSearchToggle.classList.add("block", "w-full", "text-center", "px-4", "py-2", "bg-gray-700", "rounded-lg", "hover:bg-gray-600", "mt-2");

// Configure Mobile Filter Toggle
mobileFilterToggle.textContent = "⚙️ Filter Movies";
mobileFilterToggle.classList.add("block", "w-full", "text-center", "px-4", "py-2", "bg-gray-700", "rounded-lg", "hover:bg-gray-600", "mt-2");

// Mobile Search Input and Button
mobileSearchContainer.innerHTML = `
    <div class="flex items-center bg-gray-700 rounded-lg p-2 mt-2">
        <input id="mobileSearchInput" type="text" placeholder="Search movies..." class="bg-transparent outline-none text-white px-2 placeholder-gray-400 w-full">
        <button id="mobileSearchButton" class="ml-2 px-4 py-1 bg-red-500 rounded-lg hover:bg-red-600">Search</button>
    </div>
`;
mobileSearchContainer.classList.add("hidden");

// Mobile Filter Dropdown UI
mobileFilterContainer.innerHTML = `
    <div class="bg-gray-800 p-4 rounded-lg mt-2 shadow-lg">
        <h3 class="text-lg font-semibold text-white mb-2">Filter Movies</h3>

        <label for="mobileGenreFilter" class="block text-sm text-white mb-1">Genre:</label>
        <select id="mobileGenreFilter" class="w-full p-2 bg-gray-700 text-white rounded">
            <option value="">All Genres</option>
        </select>

        <label for="mobileYearFilter" class="block text-sm text-white mt-3 mb-1">Release Year:</label>
        <input type="number" id="mobileYearFilter" placeholder="Enter year" class="w-full p-2 bg-gray-700 text-white rounded">

        <label for="mobileRatingFilter" class="block text-sm text-white mt-3 mb-1">Minimum Rating:</label>
        <input type="number" id="mobileRatingFilter" min="0" max="10" step="0.1" placeholder="e.g. 7.5" class="w-full p-2 bg-gray-700 text-white rounded">

        <button id="applyMobileFilters" class="mt-4 w-full bg-red-500 p-2 rounded-lg hover:bg-red-600">Apply Filters</button>
    </div>
`;
mobileFilterContainer.classList.add("hidden");

// Append search and filter buttons to the mobile menu
mobileMenu.appendChild(mobileSearchToggle);
mobileMenu.appendChild(mobileSearchContainer);
mobileMenu.appendChild(mobileFilterToggle);
mobileMenu.appendChild(mobileFilterContainer);

// Toggle Mobile Search
mobileSearchToggle.addEventListener("click", () => {
    mobileSearchContainer.classList.toggle("hidden");
    mobileFilterContainer.classList.add("hidden"); // Hide filter if open
});

// Toggle Mobile Filter
mobileFilterToggle.addEventListener("click", () => {
    mobileFilterContainer.classList.toggle("hidden");
    mobileSearchContainer.classList.add("hidden"); // Hide search if open
});

// Mobile Search Functionality
document.getElementById("mobileSearchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
        searchQuery = e.target.value.trim();
        currentPage = 1;
        isSearchMode = true;
        searchMovies(searchQuery, currentPage, false);
    }
});

document.getElementById("mobileSearchButton").addEventListener("click", () => {
    searchQuery = document.getElementById("mobileSearchInput").value.trim();
    if (searchQuery !== "") {
        currentPage = 1;
        isSearchMode = true;
        searchMovies(searchQuery, currentPage, false);
    }
});

// Mobile Filter Functionality
document.getElementById("applyMobileFilters").addEventListener("click", () => {
    genreFilter.value = document.getElementById("mobileGenreFilter").value;
    yearFilter.value = document.getElementById("mobileYearFilter").value;
    ratingFilter.value = document.getElementById("mobileRatingFilter").value;

    currentPage = 1;
    fetchFilteredMovies(currentPage, false);
    mobileFilterContainer.classList.add("hidden"); // Close dropdown after applying filters
    isSearchMode = false;
});

// Fetch and Populate Mobile Genre Options
async function fetchGenresMobile() {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    const data = await response.json();
    
    const mobileGenreFilter = document.getElementById("mobileGenreFilter");
    mobileGenreFilter.innerHTML = '<option value="">All Genres</option>';
    
    data.genres.forEach((genre) => {
        mobileGenreFilter.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
    });
}

// Call fetchGenresMobile when the page loads
fetchGenresMobile();