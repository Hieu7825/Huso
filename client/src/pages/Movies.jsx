import React from "react";
import { dummyShowsData } from "../assets/assets";
import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import { useAppContext } from "../context/AppContext";
import { Film, Sparkles } from "lucide-react";

const Movies = () => {
  const { shows } = useAppContext();

  return shows.length > 0 ? (
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
            <Film className="w-8 h-8 text-red-500 animate-pulse" />
            <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-bounce" />
          </div>
          <div className="relative">
            <h2 className="gradient text-4xl md:text-5xl font-bold tracking-wide uppercase letter-spacing-2 transform hover:scale-105 transition-all duration-300">
              🎬 Now Showing
            </h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse rounded-full"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-3 h-3 bg-red-300 rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>

      {/* Movies Count Info */}
      <div className="mb-8 text-center animate-fade-in">
        <p className="text-gray-400 text-lg">
          Currently showing{" "}
          <span className="text-red-500 font-bold text-xl">{shows.length}</span>{" "}
          {shows.length === 1 ? "movie" : "movies"}
        </p>
      </div>

      {/* Movies Grid */}
      <div className="flex flex-wrap gap-8 max-sm:justify-center">
        {shows.map((movie, index) => (
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
    <div className="flex flex-col items-center justify-center h-screen animate-fade-in">
      <div className="relative mb-8">
        <Film className="w-24 h-24 text-gray-600 animate-pulse" />
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
      </div>
      <h1 className="text-4xl font-bold text-center gradient-text mb-4">
        No Movies Available
      </h1>
      <p className="text-gray-500 text-center max-w-md">
        It looks like there are no movies in the database right now. Please
        check back later!
      </p>
    </div>
  );
};

export default Movies;
