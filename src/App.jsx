
import React, { useState, useEffect } from "react";
import "./App.css";

const API_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovies = async (url) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(url, {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      setError("Unable to load movies. Please check your API token.");
      setMovies([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies("https://api.themoviedb.org/3/trending/movie/week");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      fetchMovies("https://api.themoviedb.org/3/trending/movie/week");
      return;
    }

    fetchMovies(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}`
    );
  };

  return (
    <div className="app">
      <header className="navbar">
        <h1 className="logo">MovieFlix</h1>
        <span>Movies & TV Shows</span>
      </header>

      <section className="hero">
        <h2>Unlimited Movies, Endless Entertainment</h2>
        <p>Explore trending movies and your favorite films.</p>

        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            placeholder="Search your favorite movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <main className="movie-section">
        <h2>{search.trim() ? "Search Results" : "Trending Movies"}</h2>

        {loading && <p className="message">Loading movies...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && movies.length === 0 && (
          <p className="message">No movies found.</p>
        )}

        <div className="movie-grid">
          {movies.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/300x450?text=No+Poster"
                }
                alt={movie.title}
              />

              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>⭐ {movie.vote_average?.toFixed(1) || "N/A"}</p>
                <p>{movie.release_date || "Release date unavailable"}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div
            className="movie-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>

            <img
              className="modal-poster"
              src={
                selectedMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                  : "https://placehold.co/300x450?text=No+Poster"
              }
              alt={selectedMovie.title}
            />

            <div className="modal-content">
              <h2>{selectedMovie.title}</h2>
              <p>⭐ Rating: {selectedMovie.vote_average?.toFixed(1) || "N/A"}/10</p>
              <p>Release Date: {selectedMovie.release_date || "N/A"}</p>
              <h3>Overview</h3>
              <p>{selectedMovie.overview || "No description available."}</p>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>© 2026 MovieFlix. All rights reserved.</p>
        <p>Movie data provided by TMDB.</p>
      </footer>
    </div>
  );
}

export default App;
