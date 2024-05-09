// script.js

const tmdbApiKey = "a94b681a8face88efc881cf223ac970f";
const tmdbBaseUrl = "https://api.themoviedb.org/3";
const tmdbImageBaseUrl = "https://image.tmdb.org/t/p/w500";

function fetchMovieDetails(movieTitle) {
  fetch(
    `${tmdbBaseUrl}/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(
      movieTitle
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        const movie = data.results[0];
        displayMovieDetails(movie);
        fetchMovieCredits(movie.id);
      } else {
        throw new Error("Movie not found");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      updateUIWithError("Movie details could not be fetched.");
    });
}

function fetchMovieCredits(movieId) {
  fetch(`${tmdbBaseUrl}/movie/${movieId}/credits?api_key=${tmdbApiKey}`)
    .then((response) => response.json())
    .then((credits) => {
      displayMovieCredits(credits);
    })
    .catch((error) => {
      console.error("Error fetching credits:", error);
      updateUIWithError("Movie credits could not be fetched.");
    });
}

function displayMovieCredits(credits) {
  const cast = credits.cast;
  const crew = credits.crew;

  const actors = cast
    .slice(0, 5)
    .map((actor) => actor.name)
    .join(", ");

  const director = crew.find((member) => member.job === "Director")?.name;

  const movieDetailsElement = document.getElementById("movie-details");

  movieDetailsElement.innerHTML += `<p><strong>Actors:</strong> ${actors}</p>`;
  movieDetailsElement.innerHTML += `<p><strong>Director:</strong> ${director}</p>`;
}

function displayMovieDetails(movie) {
  const movieDetailsElement = document.getElementById("movie-details");
  const moviePosterElement = document.getElementById("movie-poster");

  movieDetailsElement.innerHTML = `
        <h2 class="movie-title">${movie.title} (${
    movie.release_date.split("-")[0]
  })</h2>
        <p><strong>Summary:</strong> ${movie.overview}</p>
    `;

  if (movie.poster_path) {
    moviePosterElement.src = tmdbImageBaseUrl + movie.poster_path;
    moviePosterElement.alt = `Poster of ${movie.title}`;
    moviePosterElement.removeAttribute("hidden");
  } else {
    displayFallbackImage();
  }
}

function displayFallbackImage() {
  const moviePosterElement = document.getElementById("movie-poster");
  moviePosterElement.src = "image_not_found.jpg";
  moviePosterElement.alt = "Default movie cover art";
}

function updateUIWithError(errorMessage) {
  const movieDetailsElement = document.getElementById("movie-details");
  movieDetailsElement.textContent = errorMessage;

  displayFallbackImage();
}

document
  .getElementById("movie-search-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const movieTitle = document.getElementById("movie-search-input").value;
    fetchMovieDetails(movieTitle);
  });

fetchMovieDetails("The Matrix");
