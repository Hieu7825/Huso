import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import {
  Heart,
  X,
  Film,
  Sparkles,
  Clock,
  Calendar,
  Languages,
} from "lucide-react";
import timeFormat from "../lib/timeFormat";
import { PlayCircle, Star } from "lucide-react";
import DateSelect from "../components/DateSelect";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { kConverter } from "../lib/kConverter";

const MovieDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState(null);

  const {
    shows,
    axios,
    getToken,
    user,
    fetchFavoriteMovies,
    favoriteMovies,
    image_base_url,
  } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
        console.log("Movie data:", data.movie);
        console.log("Trailer key:", data.movie.trailer);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      const { data } = await axios.post(
        "/api/user/update-favorite",
        { movieId: id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleWatchTrailer = () => {
    const trailerKey = show?.movie?.trailer;

    if (trailerKey && trailerKey.trim() !== "") {
      console.log("Opening trailer:", trailerKey);
      setCurrentTrailer(trailerKey);
      setShowTrailer(true);
    } else {
      toast.error("Trailer is not available for this movie");
    }
  };

  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setCurrentTrailer(null);
  };

  useEffect(() => {
    getShow();
  }, [id]);

  const isFavorite = favoriteMovies.find((movie) => movie._id === id);

  return show ? (
    <>
      <div className="px-6 md:px-16 lg:px-40 pt-30  pb-20 overflow-hidden">
        {/* Hero Backdrop Section */}
        <div className="relative w-full h-[500px]   mb-40">
          <img
            src={image_base_url + show.movie.backdrop_path}
            alt={show.movie.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/60"></div>

          {/* Floating Info on Backdrop - Centered */}
          <div className="absolute inset-0 flex flex-col items-start justify-end text-start px-6 md:px-16 lg:px-40">
            <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
              {/* Featured Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-600 to-red-800 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-red-600/50 animate-pulse-glow">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
              {/* Year Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur-md text-gray-300 text-xs font-semibold rounded-full border border-red-600/30">
                <Calendar className="w-3 h-3" />
                {show.movie.release_date?.split("-")[0] || "N/A"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl mb-4 animate-fade-in-up max-w-4xl">
              {show.movie.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm animate-fade-in-up">
              {/* Rating Badge */}
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-600/30 shadow-md shadow-yellow-600/20">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white font-bold">
                  {show.movie.vote_average?.toFixed(1) || "N/A"}
                </span>
                <span className="text-gray-300">/ 10</span>
                {show.movie.vote_count && (
                  <span className="text-gray-400 text-xs ml-1">
                    ({kConverter(show.movie.vote_count)} votes)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-10 max-w-7xl mx-auto relative">
          <BlurCircle top="-100px" left="-100px" />

          {/* Movie Poster with Enhanced Animation */}
          <div className="relative max-md:mx-auto group animate-fade-in-up">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent rounded-xl blur-[40px] group-hover:blur-[60px] transition-all duration-500"></div>

            <img
              src={image_base_url + show.movie.poster_path}
              alt={show.movie.title}
              className="relative rounded-xl h-[26rem] max-w-[17.5rem] object-cover border-4 border-red-600 shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 hover:border-red-500 transition-all duration-500 hover:scale-105"
            />

            {/* Favorite Badge on Poster */}
            {isFavorite && (
              <div className="absolute top-4 right-4 bg-red-600 rounded-full p-2 shadow-lg shadow-red-600/50 animate-bounce">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
            )}
          </div>

          {/* Movie Info Section */}
          <div
            className="flex flex-col gap-5 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Language Badge */}
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-bold text-sm tracking-widest uppercase bg-red-950/50 px-3 py-1.5 rounded-full w-fit border border-red-600/30">
                {show.movie.original_language?.toUpperCase() || "ENGLISH"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold max-w-2xl text-balance text-white drop-shadow-lg">
              {show.movie.title}
            </h1>

            {/* Rating Card */}
            <div className="flex items-center gap-2 bg-black/50 px-4 py-3 rounded-full w-fit border-2 border-red-600/30 shadow-md shadow-red-600/20">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
              <span className="text-white font-semibold text-lg">
                {show.movie.vote_average?.toFixed(1) || "N/A"}
              </span>
              {show.movie.vote_count && (
                <span className="text-gray-400 text-sm ml-1">
                  • {kConverter(show.movie.vote_count)} votes
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="text-gray-300 leading-relaxed max-w-2xl text-base">
              {show.movie.overview}
            </p>

            {/* Movie Meta Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-full border border-red-600/30 shadow-sm shadow-black/30 text-gray-300">
                <Clock className="w-4 h-4 text-red-500" />
                {timeFormat(show.movie.runtime || 0)}
              </div>
              <span className="text-red-500">•</span>
              <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-full border border-red-600/30 shadow-sm shadow-black/30 text-gray-300">
                <Film className="w-4 h-4 text-red-500" />
                {show.movie.genres?.map((genre) => genre.name).join(", ") ||
                  "N/A"}
              </div>
              <span className="text-red-500">•</span>
              <div className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-full border border-red-600/30 shadow-sm shadow-black/30 text-gray-300">
                <Calendar className="w-4 h-4 text-red-500" />
                {show.movie.release_date?.split("-")[0] || "N/A"}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center flex-wrap gap-4 mt-4">
              {/* Watch Trailer Button */}
              <button
                onClick={handleWatchTrailer}
                disabled={!show.movie.trailer}
                className={`flex items-center gap-2 px-7 py-3.5 text-sm bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-full font-semibold transition-all duration-300 cursor-pointer border-2 border-red-600/30 shadow-lg shadow-black/50 hover:bg-gradient-to-br hover:from-red-800 hover:to-red-900 hover:border-red-600 hover:shadow-xl hover:shadow-red-600/40 hover:-translate-y-0.5 active:scale-95 ${
                  !show.movie.trailer ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {show.movie.trailer ? (
                  <>
                    <PlayCircle className="w-5 h-5" />
                    Watch Trailer
                  </>
                ) : (
                  <>
                    <Film className="w-5 h-5" />
                    No Trailer
                  </>
                )}
              </button>

              {/* Buy Tickets Button */}

              <a
                href="#dateSelect"
                className="px-10 py-3.5 text-sm bg-gradient-to-r from-red-600 to-red-800 text-white rounded-full font-semibold cursor-pointer transition-all duration-300 border-2 border-red-600 shadow-lg shadow-red-600/50 hover:bg-gradient-to-r hover:from-red-800 hover:to-red-900 hover:border-red-500 hover:shadow-xl hover:shadow-red-600/60 hover:-translate-y-0.5 active:scale-95"
              >
                Buy Tickets
              </a>

              {/* Favorite Button */}
              <button
                onClick={handleFavorite}
                className={`p-3 rounded-full transition-all duration-300 cursor-pointer border-2 shadow-lg hover:scale-110 active:scale-95 ${
                  isFavorite
                    ? "bg-red-600 border-red-500 shadow-red-600/60"
                    : "bg-gray-700 border-red-600/30 shadow-black/30 hover:bg-red-800 hover:border-red-600 hover:shadow-red-600/50"
                }`}
                title={
                  isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    isFavorite ? "fill-white text-white" : "text-red-500"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Cast Section */}
        <div className="mt-24 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Sparkles className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <div className="relative">
              <h2 className="gradient-text text-2xl md:text-3xl font-bold tracking-wide">
                Your Favorite Cast
              </h2>
              <div className="cast-section-underline"></div>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-4">
            <div className="flex items-center gap-6 w-max">
              {show.movie.casts?.slice(0, 12).map((cast, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center min-w-[120px] animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative p-1 bg-gradient-to-br from-red-600 to-red-800 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-600/50">
                    <img
                      src={
                        cast.profile_path
                          ? image_base_url + cast.profile_path
                          : "https://via.placeholder.com/80"
                      }
                      alt={cast.name}
                      className="rounded-full h-20 w-20 object-cover border-2 border-black"
                    />
                  </div>
                  <p className="font-semibold text-sm mt-3 text-white">
                    {cast.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {cast.character || "Actor"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Date Select */}
        <div id="dateSelect" className="mt-24">
          <DateSelect dateTime={show.dateTime} id={id} />
        </div>

        {/* You May Also Like */}
        <div className="mt-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-1 w-12 bg-gradient-to-r from-red-600 to-transparent rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
              You May Also Like
            </h2>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-red-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap max-sm:justify-center gap-8">
            {shows.slice(0, 3).map((movie, index) => (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>

        {/* Show More Button */}
        <div className="flex justify-center mt-20">
          <button
            onClick={() => {
              navigate("/movies");
              scrollTo(0, 0);
            }}
            className="group relative px-12 py-4 text-sm bg-gradient-to-r from-red-600 to-red-800 text-white transition-all duration-300 rounded-xl font-semibold cursor-pointer shadow-lg shadow-red-600/50 border-2 border-red-600 overflow-hidden hover:shadow-xl hover:shadow-red-600/60 hover:scale-105 hover:border-red-500 active:scale-95"
          >
            <span className="relative z-10">Show More Movies</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && currentTrailer && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={handleCloseTrailer}
        >
          <div
            className="relative w-full max-w-6xl mx-4 aspect-video animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseTrailer}
              className="group absolute -top-14 right-0 p-3 bg-red-600 hover:bg-red-800 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-2xl shadow-red-600/50 z-10 cursor-pointer border-none"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Trailer Title */}
            <div className="absolute -top-14 left-0 text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-red-500" />
              <h3 className="text-xl font-bold">
                {show.movie.title} - Trailer
              </h3>
            </div>

            {/* YouTube Embed Player */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-red-600/30 bg-black">
              <iframe
                key={currentTrailer}
                src={`https://www.youtube.com/embed/${currentTrailer}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={`${show.movie.title} Trailer`}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <Loading />
  );
};

export default MovieDetails;
