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
                    
                    <div class="flex items-center space-x-2 mt-4">
                        <span class="text-lg font-medium text-white">Rate this movie:</span>
                        <div class="flex space-x-1" id="starRating">
                            <span class="star cursor-pointer text-gray-400 text-2xl" data-value="1">&#9733;</span>
                            <span class="star cursor-pointer text-gray-400 text-2xl" data-value="2">&#9733;</span>
                            <span class="star cursor-pointer text-gray-400 text-2xl" data-value="3">&#9733;</span>
                            <span class="star cursor-pointer text-gray-400 text-2xl" data-value="4">&#9733;</span>
                            <span class="star cursor-pointer text-gray-400 text-2xl" data-value="5">&#9733;</span>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2 mt-4">
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

        // Attach event listeners to stars after rendering
        setupStarRating();
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Function to handle star rating
function setupStarRating() {
    const stars = document.querySelectorAll("#starRating .star");

    // Retrieve saved rating for this movie
    let savedRating = localStorage.getItem(`rating-${movieId}`);

    if (savedRating) {
        highlightStars(savedRating);
    }

    stars.forEach(star => {
        star.addEventListener("click", function () {
            let rating = this.getAttribute("data-value");

            // If the clicked rating is the same as the saved one, reset to 0
            if (savedRating === rating) {
                localStorage.removeItem(`rating-${movieId}`);
                highlightStars(0);
                savedRating = null;
                console.log("Rating reset to 0 stars");
            } else {
                // Save new rating
                localStorage.setItem(`rating-${movieId}`, rating);
                highlightStars(rating);
                savedRating = rating;
                console.log(`You rated this movie: ${rating} stars`);
            }
        });
    });
}

// Function to highlight stars based on rating
function highlightStars(rating) {
    const stars = document.querySelectorAll("#starRating .star");
    stars.forEach(s => {
        if (s.getAttribute("data-value") <= rating) {
            s.classList.remove("text-gray-400");
            s.classList.add("text-yellow-400");
        } else {
            s.classList.remove("text-yellow-400");
            s.classList.add("text-gray-400");
        }
    });
}

// Handle saving movie to localStorage
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

function showNotification(message) {
    const notification = document.getElementById('movieSavedNotification');
    notification.textContent = message;
    notification.classList.add('show');

    // Remove the notification after set time
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

// Fetch movie details on page load
fetchMovieDetails();









document.addEventListener("DOMContentLoaded", () => {
    const commentList = document.getElementById("commentList");
    const commentInput = document.getElementById("commentInput");
    const nameInput = document.getElementById("nameInput");

    // Get the current movie ID from the URL
    const movieId = new URLSearchParams(window.location.search).get("id");

    if (!movieId) {
        console.error("Movie ID not found in URL.");
        return;
    }

    // Dummy comments with names
    const dummyComments = [
        { name: "Alex", text: "Amazing movie! Highly recommend." },
        { name: "Jamie", text: "Not my favorite, but the story was decent." },
        { name: "Chris", text: "Loved the cinematography!" },
        { name: "Taylor", text: "Great performances by the cast." },
        { name: "Jordan", text: "Could have been better, but still enjoyable." },
        { name: "Morgan", text: "A masterpiece, would watch again!" },
        { name: "Sam", text: "Soundtrack was on point!" }
    ];

    function getRandomComments(count) {
        return dummyComments.sort(() => Math.random() - 0.5).slice(0, count);
    }

    // Load comments (dummy + user comments)
    function loadComments() {
        commentList.innerHTML = ""; // Clear existing comments

        // Get stored comments for this movie
        const storedComments = JSON.parse(localStorage.getItem(`comments-${movieId}`)) || [];

        // Get random dummy comments (e.g., 3)
        const randomComments = getRandomComments(3);

        // Render dummy comments
        randomComments.forEach(({ name, text }) => {
            const commentEl = createCommentElement(name, text, false);
            commentList.appendChild(commentEl);
        });

        // Render stored user comments with delete button
        storedComments.forEach(({ name, text, isUserComment }) => {
            const commentEl = createCommentElement(name, text, isUserComment);
            commentList.appendChild(commentEl);
        });
    }

    function createCommentElement(name, text, isUserComment) {
        const li = document.createElement("li");
        li.classList.add("bg-gray-700", "p-3", "rounded-lg", "mb-2", "text-white");

        // Container for name and delete button (flexbox)
        const topContainer = document.createElement("div");
        topContainer.classList.add("flex", "justify-between", "items-start");

        // Name Element (blue & bold)
        const nameElement = document.createElement("p");
        nameElement.textContent = name;
        nameElement.classList.add("text-blue-400", "font-semibold", "mb-1");

        topContainer.appendChild(nameElement);

        if (isUserComment) {
            // Delete Button (top-right aligned)
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("text-red-500", "hover:underline", "text-sm");
            deleteButton.addEventListener("click", () => {
                deleteComment(name, text);
                li.remove();
            });
            topContainer.appendChild(deleteButton);
        }

        // Comment Text
        const commentText = document.createElement("p");
        commentText.textContent = text;

        // Append elements to the comment box
        li.appendChild(topContainer);
        li.appendChild(commentText);

        return li;
    }

    function saveComment(name, text) {
        const comments = JSON.parse(localStorage.getItem(`comments-${movieId}`)) || [];
        comments.push({ name, text, isUserComment: true }); // Mark as user comment
        localStorage.setItem(`comments-${movieId}`, JSON.stringify(comments));
    }

    function deleteComment(name, text) {
        let comments = JSON.parse(localStorage.getItem(`comments-${movieId}`)) || [];
        comments = comments.filter(comment => !(comment.name === name && comment.text === text));
        localStorage.setItem(`comments-${movieId}`, JSON.stringify(comments));
    }

    document.querySelector("button[onclick='addComment()']").addEventListener("click", () => {
        const userName = nameInput.value.trim();
        const userComment = commentInput.value.trim();

        if (userName && userComment) {
            const commentEl = createCommentElement(userName, userComment, true);
            commentList.appendChild(commentEl);
            saveComment(userName, userComment);
            nameInput.value = "";
            commentInput.value = "";
        }
    });

    loadComments();
});