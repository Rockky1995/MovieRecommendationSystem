import React, { useState, useEffect } from 'react';
import { Film, Star, ThumbsUp, TrendingUp, User, Search, Heart, Play } from 'lucide-react';

export default function MovieRecommender() {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('select');
  const [userProfile, setUserProfile] = useState(null);

  // Movie database with genres, ratings, and features
  const movieDatabase = [
    { id: 1, title: "The Shawshank Redemption", year: 1994, genre: ["Drama", "Crime"], rating: 9.3, director: "Frank Darabont", poster: "🎬", tags: ["prison", "friendship", "hope"] },
    { id: 2, title: "The Godfather", year: 1972, genre: ["Crime", "Drama"], rating: 9.2, director: "Francis Ford Coppola", poster: "🎭", tags: ["mafia", "family", "power"] },
    { id: 3, title: "The Dark Knight", year: 2008, genre: ["Action", "Crime", "Drama"], rating: 9.0, director: "Christopher Nolan", poster: "🦇", tags: ["superhero", "thriller", "dark"] },
    { id: 4, title: "Pulp Fiction", year: 1994, genre: ["Crime", "Drama"], rating: 8.9, director: "Quentin Tarantino", poster: "🔫", tags: ["nonlinear", "violent", "witty"] },
    { id: 5, title: "Forrest Gump", year: 1994, genre: ["Drama", "Romance"], rating: 8.8, director: "Robert Zemeckis", poster: "🏃", tags: ["inspiring", "historical", "emotional"] },
    { id: 6, title: "Inception", year: 2010, genre: ["Action", "Sci-Fi", "Thriller"], rating: 8.8, director: "Christopher Nolan", poster: "🌀", tags: ["dreams", "mindbending", "heist"] },
    { id: 7, title: "The Matrix", year: 1999, genre: ["Action", "Sci-Fi"], rating: 8.7, director: "Wachowski Brothers", poster: "💊", tags: ["cyberpunk", "philosophy", "action"] },
    { id: 8, title: "Interstellar", year: 2014, genre: ["Adventure", "Drama", "Sci-Fi"], rating: 8.6, director: "Christopher Nolan", poster: "🚀", tags: ["space", "time", "emotional"] },
    { id: 9, title: "The Lion King", year: 1994, genre: ["Animation", "Adventure", "Drama"], rating: 8.5, director: "Roger Allers", poster: "🦁", tags: ["family", "disney", "musical"] },
    { id: 10, title: "Parasite", year: 2019, genre: ["Drama", "Thriller"], rating: 8.6, director: "Bong Joon-ho", poster: "🏠", tags: ["social", "thriller", "twist"] },
    { id: 11, title: "Gladiator", year: 2000, genre: ["Action", "Adventure", "Drama"], rating: 8.5, director: "Ridley Scott", poster: "⚔️", tags: ["historical", "revenge", "epic"] },
    { id: 12, title: "The Prestige", year: 2006, genre: ["Drama", "Mystery", "Sci-Fi"], rating: 8.5, director: "Christopher Nolan", poster: "🎩", tags: ["magic", "rivalry", "twist"] },
    { id: 13, title: "The Departed", year: 2006, genre: ["Crime", "Drama", "Thriller"], rating: 8.5, director: "Martin Scorsese", poster: "🕵️", tags: ["undercover", "crime", "tense"] },
    { id: 14, title: "Whiplash", year: 2014, genre: ["Drama", "Music"], rating: 8.5, director: "Damien Chazelle", poster: "🥁", tags: ["music", "intense", "ambition"] },
    { id: 15, title: "The Green Mile", year: 1999, genre: ["Crime", "Drama", "Fantasy"], rating: 8.6, director: "Frank Darabont", poster: "💚", tags: ["prison", "supernatural", "emotional"] },
    { id: 16, title: "Spirited Away", year: 2001, genre: ["Animation", "Adventure", "Family"], rating: 8.6, director: "Hayao Miyazaki", poster: "🐉", tags: ["fantasy", "ghibli", "magical"] },
    { id: 17, title: "Saving Private Ryan", year: 1998, genre: ["Drama", "War"], rating: 8.6, director: "Steven Spielberg", poster: "🪖", tags: ["war", "heroic", "intense"] },
    { id: 18, title: "The Silence of the Lambs", year: 1991, genre: ["Crime", "Drama", "Thriller"], rating: 8.6, director: "Jonathan Demme", poster: "🦋", tags: ["psychological", "thriller", "suspense"] },
    { id: 19, title: "Se7en", year: 1995, genre: ["Crime", "Drama", "Mystery"], rating: 8.6, director: "David Fincher", poster: "7️⃣", tags: ["dark", "detective", "disturbing"] },
    { id: 20, title: "City of God", year: 2002, genre: ["Crime", "Drama"], rating: 8.6, director: "Fernando Meirelles", poster: "🌆", tags: ["gang", "brazil", "gritty"] },
    { id: 21, title: "Avengers: Endgame", year: 2019, genre: ["Action", "Adventure", "Sci-Fi"], rating: 8.4, director: "Russo Brothers", poster: "💥", tags: ["superhero", "epic", "marvel"] },
    { id: 22, title: "Spider-Man: Into the Spider-Verse", year: 2018, genre: ["Animation", "Action", "Adventure"], rating: 8.4, director: "Bob Persichetti", poster: "🕷️", tags: ["superhero", "animated", "innovative"] },
    { id: 23, title: "Coco", year: 2017, genre: ["Animation", "Adventure", "Family"], rating: 8.4, director: "Lee Unkrich", poster: "🎸", tags: ["family", "music", "pixar"] },
    { id: 24, title: "Joker", year: 2019, genre: ["Crime", "Drama", "Thriller"], rating: 8.4, director: "Todd Phillips", poster: "🤡", tags: ["psychological", "dark", "origin"] },
    { id: 25, title: "1917", year: 2019, genre: ["Drama", "War"], rating: 8.3, director: "Sam Mendes", poster: "🎖️", tags: ["war", "oneshot", "intense"] }
  ];

  const [displayedMovies, setDisplayedMovies] = useState(movieDatabase);

  // Calculate similarity between two movies
  const calculateSimilarity = (movie1, movie2) => {
    let score = 0;
    
    // Genre similarity (most important)
    const genreOverlap = movie1.genre.filter(g => movie2.genre.includes(g)).length;
    score += genreOverlap * 3;
    
    // Director similarity
    if (movie1.director === movie2.director) score += 4;
    
    // Tag similarity
    const tagOverlap = movie1.tags.filter(t => movie2.tags.includes(t)).length;
    score += tagOverlap * 2;
    
    // Rating similarity (closer ratings = more similar)
    const ratingDiff = Math.abs(movie1.rating - movie2.rating);
    score += Math.max(0, 2 - ratingDiff);
    
    // Year proximity (within 10 years)
    const yearDiff = Math.abs(movie1.year - movie2.year);
    if (yearDiff <= 10) score += 1;
    
    return score;
  };

  // Generate recommendations based on selected movies
  const generateRecommendations = () => {
    if (selectedMovies.length === 0) return;

    // Calculate similarity scores for all movies
    const scores = movieDatabase.map(movie => {
      if (selectedMovies.find(m => m.id === movie.id)) {
        return { ...movie, score: -1 }; // Already selected
      }

      // Calculate average similarity to all selected movies
      const similarities = selectedMovies.map(selected => 
        calculateSimilarity(selected, movie)
      );
      const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;

      return { ...movie, score: avgSimilarity };
    });

    // Sort by score and get top recommendations
    const topRecommendations = scores
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setRecommendations(topRecommendations);
    
    // Build user profile
    buildUserProfile();
    
    setActiveView('recommendations');
  };

  // Build user profile based on selected movies
  const buildUserProfile = () => {
    const genreCount = {};
    const directorCount = {};
    const tagCount = {};
    let totalRating = 0;

    selectedMovies.forEach(movie => {
      movie.genre.forEach(g => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
      directorCount[movie.director] = (directorCount[movie.director] || 0) + 1;
      movie.tags.forEach(t => {
        tagCount[t] = (tagCount[t] || 0) + 1;
      });
      totalRating += movie.rating;
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([genre]) => genre);

    const topDirectors = Object.entries(directorCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([director]) => director);

    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    setUserProfile({
      favoriteGenres: topGenres,
      favoriteDirectors: topDirectors,
      commonTags: topTags,
      avgRating: (totalRating / selectedMovies.length).toFixed(1)
    });
  };

  // Toggle movie selection
  const toggleMovieSelection = (movie) => {
    if (selectedMovies.find(m => m.id === movie.id)) {
      setSelectedMovies(selectedMovies.filter(m => m.id !== movie.id));
    } else {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  // Search movies
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setDisplayedMovies(movieDatabase);
    } else {
      const filtered = movieDatabase.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setDisplayedMovies(filtered);
    }
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-2xl p-8 mb-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <Film className="w-12 h-12" />
            <div>
              <h1 className="text-4xl font-bold">Movie Recommendation System</h1>
              <p className="text-purple-200 mt-2">Discover your next favorite movie based on what you love</p>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveView('select')}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeView === 'select'
                  ? 'bg-white text-purple-600'
                  : 'bg-purple-700 text-white hover:bg-purple-600'
              }`}
            >
              Select Movies ({selectedMovies.length})
            </button>
            <button
              onClick={generateRecommendations}
              disabled={selectedMovies.length === 0}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Get Recommendations
            </button>
            {recommendations.length > 0 && (
              <button
                onClick={() => setActiveView('profile')}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  activeView === 'profile'
                    ? 'bg-white text-purple-600'
                    : 'bg-purple-700 text-white hover:bg-purple-600'
                }`}
              >
                Your Profile
              </button>
            )}
          </div>
        </div>

        {/* Movie Selection View */}
        {activeView === 'select' && (
          <div className="bg-white rounded-lg shadow-2xl p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Movies You Love</h2>
              <p className="text-gray-600 mb-4">Choose at least 3 movies to get personalized recommendations</p>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, genre, or director..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Selected Movies Preview */}
            {selectedMovies.length > 0 && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Selected Movies:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMovies.map(movie => (
                    <span key={movie.id} className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm flex items-center gap-2">
                      {movie.poster} {movie.title}
                      <button onClick={() => toggleMovieSelection(movie)} className="hover:text-red-300">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Movie Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedMovies.map(movie => {
                const isSelected = selectedMovies.find(m => m.id === movie.id);
                return (
                  <div
                    key={movie.id}
                    onClick={() => toggleMovieSelection(movie)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-400 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-4xl">{movie.poster}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-gray-800">{movie.title}</h3>
                          {isSelected && <Heart className="w-5 h-5 text-purple-600 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-600">{movie.year} • {movie.director}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-semibold text-gray-700">{movie.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {movie.genre.map((g, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations View */}
        {activeView === 'recommendations' && recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-2xl p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-purple-600" />
                Recommended For You
              </h2>
              <p className="text-gray-600">Based on your selection of {selectedMovies.length} movies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((movie, index) => (
                <div key={movie.id} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border-2 border-purple-200">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{movie.poster}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">{movie.title}</h3>
                          <p className="text-sm text-gray-600">{movie.year} • {movie.director}</p>
                        </div>
                        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          #{index + 1}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-bold text-lg text-gray-800">{movie.rating}</span>
                        <span className="text-sm text-gray-600">IMDb Rating</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {movie.genre.map((g, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                            {g}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {movie.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <div className="flex items-center gap-2 text-sm">
                          <ThumbsUp className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700">
                            <span className="font-semibold">{movie.score.toFixed(1)}</span> match score
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Profile View */}
        {activeView === 'profile' && userProfile && (
          <div className="bg-white rounded-lg shadow-2xl p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <User className="w-7 h-7 text-purple-600" />
                Your Movie Taste Profile
              </h2>
              <p className="text-gray-600">Based on your {selectedMovies.length} selected movies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Favorite Genres */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                <h3 className="font-bold text-lg text-purple-900 mb-4 flex items-center gap-2">
                  <Film className="w-5 h-5" />
                  Favorite Genres
                </h3>
                <div className="space-y-3">
                  {userProfile.favoriteGenres.map((genre, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <span className="text-lg font-semibold text-gray-800">{genre}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Favorite Directors */}
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
                <h3 className="font-bold text-lg text-indigo-900 mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Favorite Directors
                </h3>
                <div className="space-y-3">
                  {userProfile.favoriteDirectors.map((director, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      <span className="text-lg font-semibold text-gray-800">{director}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Tags */}
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-6">
                <h3 className="font-bold text-lg text-pink-900 mb-4">Common Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.commonTags.map((tag, i) => (
                    <span key={i} className="px-4 py-2 bg-pink-600 text-white rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                <h3 className="font-bold text-lg text-green-900 mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average Rating Preference</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-500 fill-current" />
                      <span className="text-3xl font-bold text-gray-800">{userProfile.avgRating}</span>
                      <span className="text-gray-600">/10</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Movies Rated</p>
                    <span className="text-3xl font-bold text-gray-800">{selectedMovies.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Movies */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Your Selected Movies</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {selectedMovies.map(movie => (
                  <div key={movie.id} className="bg-white rounded-lg p-3 text-center border border-gray-200">
                    <div className="text-3xl mb-2">{movie.poster}</div>
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2">{movie.title}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-semibold">{movie.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}