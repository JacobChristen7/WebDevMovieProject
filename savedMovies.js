document.addEventListener('DOMContentLoaded', () => {
    const savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    displaySavedMovies(savedMovies);
});

function displaySavedMovies(movies) {
    const container = document.getElementById('savedMoviesContainer');

    if (movies.length === 0) {
        container.innerHTML = `<p class="text-center text-gray-400">No movies saved yet.</p>`;
        return;
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
            <button class="mt-2 px-4 py-1 bg-red-500 rounded-lg hover:bg-red-600 remove-movie-btn" data-id="${movie.id}">
                Remove
            </button>
        `;
        container.appendChild(movieElement);
    });

    document.querySelectorAll('.remove-movie-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const movieId = parseInt(e.target.dataset.id);
            removeMovieFromLocalStorage(movieId);
        });
    });
}

function removeMovieFromLocalStorage(movieId) {
    let savedMovies = JSON.parse(localStorage.getItem('savedMovies')) || [];
    savedMovies = savedMovies.filter(movie => movie.id !== movieId);
    localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
    location.reload(); // Reload the page to update UI
}