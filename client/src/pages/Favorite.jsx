import React from "react";
import { dummyShowsData } from "../assets/assets";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import { Heart, Sparkles, Film } from "lucide-react";

const Favorite = () => {
  const { favoriteMovies } = useAppContext();

  return favoriteMovies.length > 0 ? (
    <div className="relative my-20 mb-60 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden min-h-[80vh]">
      {/* Background Effects */}
      <BlurCircle top="150px" left="-80px" />
      <BlurCircle bottom="50px" right="50px" />

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full grid-background" />
      </div>

      {/* Enhanced Header Section - Centered Title */}
      <div className="relative flex justify-center pt-20 pb-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Heart className="w-8 h-8 text-red-500 fill-red-500 animate-pulse" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <div className="relative">
            <h2 className="gradient-favorite text-4xl md:text-5xl font-bold tracking-wide uppercase transform hover:scale-105 transition-all duration-300">
              ❤️ Your Favorites
            </h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-pink-500 to-red-600 animate-pulse rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-3 h-3 bg-red-300 rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>

      {/* Favorites Count Info */}
      <div className="mb-8 text-center animate-fade-in">
        <p className="text-gray-400 text-lg">
          You have{" "}
          <span className="text-red-500 font-bold text-xl">
            {favoriteMovies.length}
          </span>{" "}
          favorite {favoriteMovies.length === 1 ? "movie" : "movies"}
        </p>
      </div>

      {/* Movies Grid */}
      <div className="flex flex-wrap gap-8 max-sm:justify-center">
        {favoriteMovies.map((movie, index) => (
          <div
            key={movie._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-screen animate-fade-in px-6">
      {/* Animated Heart Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <Heart className="w-32 h-32 text-gray-700 relative z-10 animate-pulse" />
        <Heart className="w-32 h-32 text-red-500/30 absolute top-0 left-0 animate-ping" />
      </div>

      {/* Main Message */}
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-favorite">
        No Favorites Yet
      </h1>

      {/* Description */}
      <p className="text-gray-400 text-center max-w-md mb-8 text-lg">
        Start building your collection by adding movies to your favorites!
      </p>

      {/* Decorative Elements */}
      <div className="flex gap-3 mb-8">
        <div className="w-4 h-4 bg-red-500/30 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-pink-500/30 rounded-full animate-bounce delay-75"></div>
        <div className="w-4 h-4 bg-red-400/30 rounded-full animate-bounce delay-150"></div>
      </div>

      {/* CTA Card */}
      <div className="relative mt-6 p-8 rounded-2xl bg-gradient-to-br from-[#161329] via-black to-[#1d1b4b] border-2 border-red-500/30 shadow-[0_0_40px_rgba(248,69,101,0.15)] max-w-md">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2 text-lg">
              How to add favorites?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Browse our movie collection and click the{" "}
              <Heart className="w-4 h-4 inline text-red-500" /> icon on any
              movie card to add it to your favorites.
            </p>
          </div>
        </div>

        {/* Explore Button */}
        <a
          href="/movies"
          className="relative group flex items-center justify-center gap-2 mt-6 w-full px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden bg-gradient-to-br from-[#f84565] to-[#d63854] border-2 border-red-500/50 shadow-[0_10px_30px_rgba(248,69,101,0.4)] hover:scale-105"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
          <Film className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Explore Movies</span>
        </a>
      </div>
    </div>
  );
};

export default Favorite;
