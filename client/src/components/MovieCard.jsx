import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";
import { kConverter } from "../lib/kConverter";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { image_base_url } = useAppContext();

  const handleNavigate = () => {
    navigate(`/movies/${movie._id}`);
    scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-black rounded-2xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/80 transition-all duration-500 w-66 transform-gpu hover:scale-105 border-4 border-red-600 hover:border-red-500 shadow-lg shadow-red-600/50 hover:shadow-xl hover:shadow-red-600/70">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          onClick={handleNavigate}
          src={image_base_url + movie.backdrop_path}
          alt={movie.title}
          className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer transition-transform duration-300 hover:scale-110 filter brightness-90"
          onError={(e) => {
            e.target.src = image_base_url + movie.poster_path;
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg border-2 border-red-700/30"></div>
      </div>

      {/* Movie Title */}
      <p className="font-semibold mt-2 truncate text-white drop-shadow-lg">
        {movie.title}
      </p>

      {/* Movie Info */}
      <p className="text-sm text-gray-300 mt-2 drop-shadow-md truncate">
        {new Date(movie.release_date).getFullYear()} |{" "}
        {movie.genres
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}{" "}
        | {timeFormat(movie.runtime)}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between mt-4 pb-3">
        {/* Buy Tickets Button */}
        <button
          onClick={handleNavigate}
          className="px-4 py-2 text-xs bg-gray-900 hover:bg-red-900 text-white transition-all duration-300 rounded-full font-medium cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 border-2 border-red-600 hover:border-red-400 hover:shadow-red-600/50"
        >
          Buy Tickets
        </button>

        {/* Rating */}
        <p className="flex items-center gap-1 text-sm text-gray-300 mt-1 pr-1 drop-shadow-md truncate">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
          {movie.vote_average.toFixed(1)}
          {movie.vote_count && `(${kConverter(movie.vote_count)} votes)`}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
