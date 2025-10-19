import React, { useState, useEffect } from "react";
import { PlayCircle, Film, Sparkles, Play } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import BlurCircle from "./BlurCircle";

// Mock components for demo

const TrailersSection = () => {
  const { shows, image_base_url } = useAppContext();
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [moviesWithTrailers, setMoviesWithTrailers] = useState([]);

  useEffect(() => {
    const filteredMovies = shows
      .filter((movie) => movie.trailer && movie.trailer.trim() !== "")
      .slice(0, 4);

    setMoviesWithTrailers(filteredMovies);

    if (filteredMovies.length > 0) {
      setCurrentTrailer(filteredMovies[0]);
    }
  }, [shows]);

  if (moviesWithTrailers.length === 0) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20">
        <div className="relative flex items-center gap-4 mb-10">
          <div className="relative">
            <Play className="w-6 h-6 text-red-500 animate-pulse" />
            <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <div className="relative">
            <h2 className="gradient-text text-2xl md:text-3xl font-bold tracking-wide uppercase transform hover:scale-105 transition-all duration-300">
              🎬 Trailers
            </h2>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-transparent animate-pulse"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce"></div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-900/20">
          <Film className="w-16 h-16 mb-4" />
          <p className="text-lg">No trailers available at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      {/* Enhanced Header Section */}
      <div className="relative flex items-center gap-4 mb-10">
        <BlurCircle top="-50px" right="-100px" />

        <div className="relative">
          <Play className="w-6 h-6 text-red-500 animate-pulse" />
          <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
        </div>
        <div className="relative">
          <h2 className="gradient-text text-2xl md:text-3xl font-bold tracking-wide uppercase transform hover:scale-105 transition-all duration-300">
            🎬 Trailers
          </h2>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-transparent animate-pulse"></div>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Main Trailer Player */}
      <div className="relative mt-6">
        <div className="mx-auto max-w-[960px] aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500/30 bg-black hover:border-red-500/50 transition-all duration-300 hover:shadow-red-500/20">
          {currentTrailer && (
            <iframe
              key={currentTrailer.trailer}
              src={`https://www.youtube.com/embed/${currentTrailer.trailer}?rel=0&modestbranding=1&controls=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={`${currentTrailer.title} Trailer`}
            ></iframe>
          )}
        </div>

        {/* Movie Title - Enhanced */}
        {currentTrailer && (
          <div className="max-w-[960px] mx-auto mt-6 p-4 bg-gradient-to-r from-gray-900/80 to-transparent rounded-lg border border-red-500/20 backdrop-blur-sm">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Film className="w-5 h-5 text-red-500" />
              </div>
              {currentTrailer.title}
            </h3>
            <p className="text-gray-400 text-sm mt-2 line-clamp-2 pl-11">
              {currentTrailer.overview}
            </p>
          </div>
        )}
      </div>

      {/* Trailer Thumbnails Grid */}
      <div className="group grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10 max-w-[960px] mx-auto">
        {moviesWithTrailers.map((movie, index) => (
          <div
            key={movie._id}
            className={`relative cursor-pointer transition-all duration-300 rounded-xl overflow-hidden animate-fade-in-up
              ${
                currentTrailer?._id === movie._id
                  ? "ring-4 ring-red-500 scale-105 shadow-lg shadow-red-500/50"
                  : "hover:-translate-y-2 hover:shadow-xl hover:shadow-red-500/30"
              }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setCurrentTrailer(movie)}
          >
            {/* Poster Image */}
            <div className="relative aspect-[2/3] md:aspect-video">
              <img
                src={`${image_base_url}${
                  movie.backdrop_path || movie.poster_path
                }`}
                alt={movie.title}
                className="w-full h-full object-cover brightness-75 hover:brightness-100 transition-all duration-300"
                onError={(e) => {
                  e.target.src = `${image_base_url}${movie.poster_path}`;
                }}
              />

              {/* Play Icon Overlay - Enhanced */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all duration-300">
                <div className="relative">
                  <PlayCircle
                    strokeWidth={1.6}
                    className="w-12 h-12 md:w-16 md:h-16 text-white drop-shadow-2xl transform hover:scale-110 transition-all duration-300"
                  />
                  {currentTrailer?._id !== movie._id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-white/50 rounded-full animate-ping"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

              {/* Movie Info on Thumbnail */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <p className="text-white font-bold text-xs md:text-sm line-clamp-1 mb-1">
                  {movie.title}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    <span className="text-yellow-400 text-xs">⭐</span>
                    <span className="text-xs text-white font-semibold">
                      {movie.vote_average?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                  {currentTrailer?._id === movie._id && (
                    <span className="text-[10px] text-red-400 font-semibold uppercase tracking-wider">
                      Now Playing
                    </span>
                  )}
                </div>
              </div>

              {/* Active Indicator - Enhanced */}
              {currentTrailer?._id === movie._id && (
                <div className="absolute top-2 right-2">
                  <div className="relative">
                    <div className="bg-red-500 rounded-full p-2 shadow-lg shadow-red-500/50">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                </div>
              )}

              {/* Hover Border Effect */}
              {currentTrailer?._id !== movie._id && (
                <div className="absolute inset-0 border-2 border-transparent hover:border-red-500/50 rounded-xl transition-all duration-300 pointer-events-none"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show count - Enhanced */}
      <div className="flex items-center justify-center gap-2 mt-8">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500"></div>
        <p className="text-center text-gray-400 text-sm font-medium">
          Showing {moviesWithTrailers.length} trailer
          {moviesWithTrailers.length > 1 ? "s" : ""}
        </p>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500"></div>
      </div>
    </div>
  );
};

export default TrailersSection;
