import React, { useState, useRef } from "react";
import { Film, X, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import timeFormat from "../lib/timeFormat";
import Loading from "./Loading";

const timeRunning = 2000;
const displayedThumbnails = 2;
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

const HeroSection = () => {
  const { shows } = useAppContext();
  const [activeSlide, setActiveSlide] = useState(0);
  const [carouselClass, setCarouselClass] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentTrailer, setCurrentTrailer] = useState(null);
  const [currentMovieTitle, setCurrentMovieTitle] = useState("");
  const runTimeOutRef = useRef(null);
  const navigate = useNavigate();

  const carouselData = shows
    .filter((show) => show && show._id && show.title)
    .slice(0, 6);

  const showSlider = (type) => {
    if (carouselData.length === 0) return;

    let newIndex = activeSlide;
    if (type === "next") {
      newIndex = (activeSlide + 1) % carouselData.length;
      setCarouselClass("next");
    } else {
      newIndex = (activeSlide - 1 + carouselData.length) % carouselData.length;
      setCarouselClass("prev");
    }
    setActiveSlide(newIndex);

    if (runTimeOutRef.current) {
      clearTimeout(runTimeOutRef.current);
    }
    runTimeOutRef.current = setTimeout(() => {
      setCarouselClass("");
    }, timeRunning);
  };

  const reorderedSlides = [
    ...carouselData.slice(activeSlide),
    ...carouselData.slice(0, activeSlide),
  ];

  const createLoopedThumbnails = () => {
    const extendedThumbnails = [
      ...carouselData,
      ...carouselData,
      ...carouselData,
    ];
    return extendedThumbnails;
  };

  const loopedThumbnails = createLoopedThumbnails();

  const thumbnailWidth = 150;
  const thumbnailGap = 20;
  const itemWidth = thumbnailWidth + thumbnailGap;

  const baseThumbnailOffset =
    carouselData.length * itemWidth + activeSlide * itemWidth;

  const centerOffset = ((displayedThumbnails - 1) * itemWidth) / 2;
  const finalThumbnailOffset = baseThumbnailOffset - centerOffset;

  // Hàm mở trailer - FIX: Thêm movieTitle vào parameter
  const handleWatchTrailer = (trailerKey, movieTitle) => {
    if (trailerKey) {
      console.log(`Opening trailer for: ${movieTitle}, key: ${trailerKey}`);
      setCurrentTrailer(trailerKey);
      setCurrentMovieTitle(movieTitle);
      setShowTrailer(true);
    } else {
      alert(`Trailer is not available for ${movieTitle}`);
    }
  };

  // Hàm đóng trailer
  const handleCloseTrailer = () => {
    setShowTrailer(false);
    setCurrentTrailer(null);
    setCurrentMovieTitle("");
  };

  // Helper function để get image URL
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${TMDB_IMAGE_BASE_URL}${path}`;
  };

  // Loading state
  if (!shows || shows.length === 0) {
    return <Loading />;
  }

  // Empty state
  if (carouselData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black">
        <Film className="w-24 h-24 text-red-500 mb-4" />
        <p className="text-2xl text-white">No movies available</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`carousel relative h-screen w-screen overflow-hidden ${carouselClass}`}
      >
        {/* list item */}
        <div className="list relative w-full h-full">
          {reorderedSlides.map((item, index) => {
            const hasTrailer = item.trailer && item.trailer.trim() !== "";

            return (
              <div
                key={`${item._id}-${index}`}
                className={`item absolute inset-0 w-full h-full ${
                  index === 0 ? "z-10" : ""
                }`}
                style={
                  index !== 0
                    ? { transform: `translateX(${100 * index}%)`, opacity: 0 }
                    : {}
                }
              >
                <img
                  src={getImageUrl(item.backdrop_path || item.poster_path)}
                  className="w-full h-full object-cover"
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = getImageUrl(item.poster_path);
                  }}
                />
                <div className="content absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[80%] pr-[30%] box-border text-white drop-shadow-lg mt-[70px]">
                  <h1 className="font-bold text-6xl whitespace-nowrap overflow-hidden text-ellipsis max-w-[calc(50vw - 100px)] text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                    {item.title}
                  </h1>
                  <div className="details flex whitespace-nowrap mb-[-20px] text-shadow-sm">
                    <p className="font-bold text-2xl text-yellow-400 px-2 border-r-2 border-white">
                      {new Date(item.release_date).getFullYear()}
                    </p>
                    <p className="font-bold text-2xl text-yellow-400 px-2 border-r-2 border-white">
                      {item.adult ? "18+" : "13+"}
                    </p>
                    <p className="font-bold text-2xl text-yellow-400 px-2 border-r-2 border-white">
                      {timeFormat(item.runtime)}
                    </p>
                    <p className="font-bold text-2xl text-yellow-400 px-2">
                      {item.genres && item.genres[0]
                        ? item.genres[0].name
                        : "Action"}
                    </p>
                  </div>
                  <h4 className="max-w-xs text-base leading-relaxed my-10 line-clamp-3 text-shadow-sm">
                    {item.overview}
                  </h4>
                  <div className="buttons flex gap-4">
                    {/* Play Button */}
                    <button
                      onClick={() => navigate(`/movies/${item._id}`)}
                      className="group relative px-8 py-3 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 hover:from-red-500 hover:via-orange-400 hover:to-yellow-400 text-white font-bold rounded-full transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg hover:shadow-red-500/50 border-2 border-red-500/50 hover:border-red-400/70 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-orange-400/20 to-yellow-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center gap-2">
                        <Ticket className="w-5 h-5 group-hover:animate-pulse" />
                        <span>Buy Tickets</span>
                      </div>
                    </button>

                    {/* Trailer Button - FIX: Pass cả trailer key và movie title */}
                    <button
                      onClick={() =>
                        handleWatchTrailer(item.trailer, item.title)
                      }
                      className={`group relative px-8 py-3 bg-black/80 hover:bg-black/60 text-white font-bold rounded-full transition-all duration-300 shadow-lg border-2 overflow-hidden
                        ${
                          hasTrailer
                            ? "cursor-pointer hover:scale-105 border-white/50 hover:border-white/80 hover:shadow-white/30"
                            : "opacity-50 cursor-not-allowed border-gray-500/50"
                        }`}
                      disabled={!hasTrailer}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center gap-2">
                        <Film
                          className={`w-5 h-5 ${
                            hasTrailer ? "group-hover:animate-bounce" : ""
                          }`}
                        />
                        <span>
                          {hasTrailer ? "Watch Trailer" : "No Trailer"}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* list thumbnail */}
        <div
          className="thumbnail-wrapper absolute bottom-20 -right-40 -translate-x-1/2 z-20 overflow-hidden"
          style={{
            width: `${displayedThumbnails * itemWidth - thumbnailGap}px`,
          }}
        >
          <div
            className="thumbnail flex gap-5 bg-gray-600/40 backdrop-blur-md rounded-tl-full rounded-bl-full shadow-xl transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${finalThumbnailOffset}px)` }}
          >
            {loopedThumbnails.map((item, index) => {
              const originalIndex = index % carouselData.length;
              const isActive = originalIndex === activeSlide;

              return (
                <div
                  key={`${item._id}-thumb-${index}`}
                  className={`item w-[150px] h-[220px] flex-shrink-0 relative cursor-pointer ${
                    isActive ? "active-thumbnail" : ""
                  }`}
                  onClick={() => setActiveSlide(originalIndex)}
                >
                  <img
                    src={getImageUrl(item.poster_path || item.backdrop_path)}
                    className={`w-full h-full object-cover rounded-2xl transition-all duration-300 ${
                      isActive
                        ? "opacity-100 scale-110 shadow-2xl shadow-red-500/50"
                        : "opacity-70 hover:opacity-90"
                    }`}
                    alt={`Thumbnail for ${item.title}`}
                    onError={(e) => {
                      e.target.src = getImageUrl(item.backdrop_path);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl"></div>
                  <div className="thum-content text-white absolute bottom-2 left-2 right-2">
                    <div
                      className={`title font-bold text-sm line-clamp-2 transition-all duration-300 ${
                        isActive ? "text-yellow-400 text-base" : "text-white/90"
                      }`}
                    >
                      {item.title}
                    </div>
                    {item.vote_average && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400 text-xs">⭐</span>
                        <span className="text-xs text-white/80">
                          {item.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="arrows absolute bottom-5 -right-20 z-10 w-72 max-w-[30%] flex gap-2.5 items-center">
          <button
            id="prev"
            onClick={() => showSlider("prev")}
            className="w-12 h-12 rounded-full bg-black/80 hover:bg-red-600 border-2 border-white/30 hover:border-red-400 text-white text-2xl font-bold transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-red-500/50 hover:scale-105 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            &lt;
          </button>
          <button
            id="next"
            onClick={() => showSlider("next")}
            className="w-12 h-12 rounded-full bg-black/80 hover:bg-red-600 border-2 border-white/30 hover:border-red-400 text-white text-2xl font-bold transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-red-500/50 hover:scale-105 backdrop-blur-sm"
            aria-label="Next slide"
          >
            &gt;
          </button>
        </div>

        {/* Time Running Bar */}
        <div className="time absolute z-[1000] w-0 h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 left-0 top-0 shadow-lg"></div>
      </div>

      {/* Trailer Modal với YouTube Player */}
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
              className="absolute -top-14 right-0 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-red-500/50 z-10 group"
              aria-label="Close trailer"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Trailer Title */}
            <div className="absolute -top-14 left-0 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Film className="w-6 h-6 text-red-500" />
                {currentMovieTitle} - Trailer
              </h3>
            </div>

            {/* YouTube Embed Player */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-red-500/30 bg-black">
              <iframe
                key={currentTrailer}
                src={`https://www.youtube.com/embed/${currentTrailer}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={`${currentMovieTitle} Trailer`}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
