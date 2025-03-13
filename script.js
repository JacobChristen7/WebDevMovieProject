const hamburgerMenu = document.getElementById("menuButton");

hamburgerMenu.addEventListener("click", function() {
    document.getElementById("mobileMenu").classList.toggle('hidden');
});

const API_KEY = "bc44aff762863c9f76e5249ca577be5c";
const BASE_URL = "https://api.themoviedb.org/3"; 

// Function to fetch and display popular movies
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
}

// Function to display movies on the page
function displayMovies(movies) {
    const container = document.getElementById('moviesContainer');
    container.innerHTML = ''; // Clear previous movies

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('bg-gray-800', 'rounded-lg', 'p-2', 'text-center');

        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" class="rounded-lg">
            <h3 class="text-lg mt-2">${movie.title}</h3>
            <p class="text-sm text-gray-400">${movie.release_date}</p>
        `;

        container.appendChild(movieElement);
    });
}

// Function to search for movies
async function searchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayMovies(data.results);

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

document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        searchMovies(e.target.value.trim());
    }
});

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query !== '') {
        searchMovies(query);
    }
});

fetchPopularMovies();