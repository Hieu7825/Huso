import React from "react";
import BlurCircle from "./BlurCircle";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DateSelect = ({ dateTime, id }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const onBookHandle = () => {
    if (!selected) {
      return toast("please select a date");
    }
    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  };

  return (
    <div id="dateSelect" className="pt-30">
      <div
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 bg-gradient-to-b from-[#161329] via-black to-[#1d1b4b] border-2 border-red-500/30 shadow-[0_0_40px_rgba(248,69,101,0.15)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        {/* Animated Border Glow */}
        <div
          className={`absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br transition-all duration-400 blur-[20px] ${
            isHovered
              ? "from-red-500/20 to-orange-600/20"
              : "from-red-500/10 to-orange-600/10"
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Choose Date
            </p>
            <p className="text-gray-400 mb-5 text-sm">
              Select a date to continue booking
            </p>

            <div className="flex items-center gap-6 text-sm mt-5">
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/30 transition-all hover:scale-110">
                <ChevronLeftIcon width={20} className="text-red-400" />
              </button>

              <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                {Object.keys(dateTime).map((date) => {
                  const isSelected = selected === date;
                  return (
                    <button
                      onClick={() => setSelected(date)}
                      key={date}
                      className={`relative group flex flex-col items-center justify-center h-14 w-14 aspect-square rounded-xl cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-red-600 to-[#f84565] border-2 border-[#f84565] shadow-[0_8px_25px_rgba(248,69,101,0.4),inset_0_0_20px_rgba(255,255,255,0.1)] scale-105"
                          : "bg-red-500/5 border-2 border-red-500/20 scale-100"
                      }`}
                    >
                      {!isSelected && (
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-red-500/20 to-orange-600/20 blur-[10px]" />
                      )}

                      <span
                        className={`text-xl font-bold relative z-10 ${
                          isSelected
                            ? "text-white"
                            : "text-gray-300 group-hover:text-red-400"
                        }`}
                      >
                        {new Date(date).getDate()}
                      </span>
                      <span
                        className={`text-xs font-medium relative z-10 ${
                          isSelected
                            ? "text-white/90"
                            : "text-gray-500 group-hover:text-red-400/80"
                        }`}
                      >
                        {new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </span>

                      {isSelected && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                      )}
                    </button>
                  );
                })}
              </span>

              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/30 transition-all hover:scale-110">
                <ChevronRightIcon width={20} className="text-red-400" />
              </button>
            </div>
          </div>

          <button
            onClick={onBookHandle}
            className={`relative group px-8 py-4 mt-6 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden cursor-pointer border-2 border-red-500/50 ${
              selected
                ? "bg-gradient-to-br from-[#f84565] to-[#d63854] shadow-[0_10px_30px_rgba(248,69,101,0.4)] opacity-100"
                : "bg-red-500/30 opacity-60"
            }`}
          >
            {selected && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
            )}

            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Book Now
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateSelect;
