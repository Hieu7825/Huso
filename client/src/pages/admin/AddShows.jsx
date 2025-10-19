import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import {
  CheckIcon,
  DeleteIcon,
  StarIcon,
  DollarSignIcon,
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  Sparkles,
  Film,
  XIcon,
} from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import BlurCircle from "../../components/BlurCircle";

const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get("/api/show/now-playing", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // ⭐ SỬA HÀM NÀY - KHÔNG XÓA dateTimeInput NỮA
  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
    // ❌ KHÔNG XÓA dateTimeInput NỮA - giữ nguyên giá trị để dễ thêm nhiều suất
    // setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      if (
        !selectedMovie ||
        Object.keys(dateTimeSelection).length === 0 ||
        !showPrice
      ) {
        return toast.error("Missing required fields");
      }

      setAddingShow(true);

      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, time]) => ({ date, time })
      );

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice),
      };

      const { data } = await axios.post("/api/show/add", payload, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice("");
        setDateTimeInput(""); // ✅ CHỈ XÓA KHI SUBMIT THÀNH CÔNG
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred. Please try again.");
    }
    setAddingShow(false);
  };

  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  const selectedMovieData = nowPlayingMovies.find(
    (m) => m.id === selectedMovie
  );

  return nowPlayingMovies.length > 0 ? (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <BlurCircle top="10%" left="10%" />
      <BlurCircle top="60%" left="70%" />

      {/* Header */}
      <div className="mb-12">
        <Title text1="Add" text2="Shows" />
        <p className="text-gray-400 text-lg mt-2 ml-1">
          Configure showtimes and pricing for movies
        </p>
      </div>

      {/* Selected Movie Info Card */}
      {selectedMovieData && (
        <div className="mb-10 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-rose-600/30 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300" />
          <div className="relative bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border-2 border-red-600/40 rounded-2xl p-6 flex items-center gap-6">
            <div className="relative">
              <img
                src={image_base_url + selectedMovieData.poster_path}
                alt={selectedMovieData.title}
                className="w-24 h-36 object-cover rounded-lg border-2 border-red-600/50 shadow-lg shadow-red-600/30"
              />
              <div className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1.5 shadow-lg shadow-red-600/50">
                <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Film className="w-5 h-5 text-red-500" />
                <h3 className="text-2xl font-black text-white">
                  Selected Movie
                </h3>
              </div>
              <p className="text-xl font-bold text-red-400 mb-1">
                {selectedMovieData.title}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-semibold">
                    {selectedMovieData.vote_average.toFixed(1)}
                  </span>
                  <span>
                    ({kConverter(selectedMovieData.vote_count)} votes)
                  </span>
                </div>
                <span>•</span>
                <span>{selectedMovieData.release_date}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedMovie(null)}
              className="p-2 hover:bg-red-900/30 rounded-full transition-colors"
            >
              <XIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      )}

      {/* Now Playing Movies Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600 blur-lg opacity-50" />
            <Film className="w-7 h-7 text-red-500 relative z-10 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">
              Now Playing Movies
            </h2>
            <div className="h-0.5 w-48 bg-gradient-to-r from-red-600 via-rose-600 to-transparent mt-1 rounded-full" />
          </div>
          <div className="ml-auto px-4 py-2 bg-red-950/30 border border-red-600/30 rounded-lg">
            <span className="text-red-400 font-bold">
              {nowPlayingMovies.length}
            </span>
            <span className="text-gray-400 text-sm ml-1">available</span>
          </div>
        </div>

        {/* Movies Horizontal Scroll */}
        <div className="relative">
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-5 w-max">
              {nowPlayingMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className={`group relative w-48 cursor-pointer transition-all duration-500 hover:-translate-y-2 ${
                    selectedMovie === movie.id ? "scale-105" : "hover:scale-105"
                  }`}
                  onClick={() => setSelectedMovie(movie.id)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute -inset-1 rounded-2xl blur transition-opacity duration-300 ${
                      selectedMovie === movie.id
                        ? "bg-gradient-to-br from-red-600/50 to-rose-600/50 opacity-100"
                        : "bg-gradient-to-br from-red-900/20 to-rose-900/20 opacity-0 group-hover:opacity-100"
                    }`}
                  />

                  {/* Card */}
                  <div
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedMovie === movie.id
                        ? "border-red-500 shadow-2xl shadow-red-600/50"
                        : "border-red-900/30 group-hover:border-red-600/50 shadow-xl shadow-red-900/20"
                    }`}
                  >
                    {/* Poster */}
                    <div className="relative h-72 overflow-hidden bg-black">
                      <img
                        src={image_base_url + movie.poster_path}
                        alt={movie.title}
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-110 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                      {/* Check Icon */}
                      {selectedMovie === movie.id && (
                        <div className="absolute top-3 right-3 bg-red-600 rounded-full p-2 shadow-lg shadow-red-600/50 animate-bounce">
                          <CheckIcon
                            className="w-5 h-5 text-white"
                            strokeWidth={3}
                          />
                        </div>
                      )}

                      {/* Rating Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1.5 bg-black/80 backdrop-blur-sm rounded-lg border border-red-600/30">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-white">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-black text-white text-lg drop-shadow-lg line-clamp-2 mb-1">
                          {movie.title}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 font-semibold">
                            {movie.release_date}
                          </span>
                          <span className="text-gray-400">
                            {kConverter(movie.vote_count)} votes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      {selectedMovie && (
        <div className="space-y-8">
          {/* Show Price Input */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-4 text-white">
              <DollarSignIcon className="w-5 h-5 text-red-500" />
              Show Price
            </label>
            <div className="relative group inline-block">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
              <div className="relative flex items-center gap-3 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border-2 border-red-900/30 px-5 py-4 rounded-xl group-hover:border-red-600/50 transition-all duration-300">
                <span className="text-gray-400 text-lg font-bold">
                  {currency}
                </span>
                <input
                  min={0}
                  type="number"
                  value={showPrice}
                  onChange={(e) => setShowPrice(e.target.value)}
                  placeholder="Enter show price"
                  className="bg-transparent outline-none text-white text-xl font-semibold w-40 placeholder-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Date Time Selection */}
          <div>
            <label className="flex items-center gap-2 text-lg font-bold mb-4 text-white">
              <CalendarIcon className="w-5 h-5 text-red-500" />
              Select Date and Time
            </label>
            <div className="relative group inline-flex items-center gap-4">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
              <div className="relative flex items-center gap-4 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border-2 border-red-900/30 px-5 py-3 rounded-xl group-hover:border-red-600/50 transition-all duration-300">
                <ClockIcon className="w-5 h-5 text-red-500" />
                <input
                  type="datetime-local"
                  value={dateTimeInput}
                  onChange={(e) => setDateTimeInput(e.target.value)}
                  className="bg-transparent outline-none text-white font-semibold [color-scheme:dark]"
                />
              </div>
              <button
                onClick={handleDateTimeAdd}
                className="group/btn relative px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl font-bold text-white shadow-lg shadow-red-600/40 hover:shadow-red-500/60 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-2">
                  <PlusIcon className="w-5 h-5" />
                  Add Time
                </div>
              </button>
            </div>
          </div>

          {/* Selected DateTime Display */}
          {Object.keys(dateTimeSelection).length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
                <h3 className="text-lg font-black text-white">
                  Selected Showtimes
                </h3>
                <span className="px-3 py-1 bg-red-950/50 border border-red-600/40 rounded-full text-sm font-bold text-red-400">
                  {Object.values(dateTimeSelection).flat().length} slots
                </span>
              </div>

              <div className="space-y-4">
                {Object.entries(dateTimeSelection).map(([date, times]) => (
                  <div key={date} className="relative group/date">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-900/20 to-rose-900/20 rounded-xl blur opacity-50 group-hover/date:opacity-75 transition duration-300" />
                    <div className="relative bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border-2 border-red-900/30 rounded-xl p-5 group-hover/date:border-red-600/40 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        <CalendarIcon className="w-5 h-5 text-red-500" />
                        <span className="font-bold text-white text-lg">
                          {date}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          ({times.length}{" "}
                          {times.length === 1 ? "show" : "shows"})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {times.map((time) => (
                          <div key={time} className="group/time relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/30 to-rose-600/30 rounded-lg blur opacity-0 group-hover/time:opacity-100 transition duration-300" />
                            <div className="relative flex items-center gap-3 px-4 py-2.5 bg-red-950/40 border-2 border-red-600/40 rounded-lg group-hover/time:border-red-500 group-hover/time:bg-red-900/40 transition-all duration-300">
                              <ClockIcon className="w-4 h-4 text-red-400" />
                              <span className="font-semibold text-white">
                                {time}
                              </span>
                              <button
                                onClick={() => handleRemoveTime(date, time)}
                                className="p-1 hover:bg-red-600 rounded transition-colors"
                              >
                                <XIcon className="w-4 h-4 text-red-400 hover:text-white" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              disabled={addingShow}
              className="group relative px-10 py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-xl font-black text-white text-lg shadow-2xl shadow-red-600/50 hover:shadow-red-500/70 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <span>{addingShow ? "Adding Show..." : "Add Show"}</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default AddShows;
