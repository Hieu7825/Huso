import React from "react";
import BlurCircle from "./BlurCircle";
import { ChevronLeftIcon } from "lucide-react";
import { ChevronRightIcon } from "lucide-react";
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
        className="relative overflow-hidden rounded-2xl p-8 md:p-10"
        style={{
          background: "linear-gradient(180deg, #161329, #000, #1d1b4b)",
          border: "2px solid rgba(248, 69, 101, 0.3)",
          boxShadow: "0 0 40px rgba(248, 69, 101, 0.15)",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        {/* Animated Border Glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, rgba(248, 69, 101, ${
              isHovered ? "0.2" : "0.1"
            }), rgba(234, 88, 12, ${isHovered ? "0.2" : "0.1"}))`,
            filter: "blur(20px)",
            transition: "all 0.4s ease",
          }}
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
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "rgba(248, 69, 101, 0.1)",
                  border: "1px solid rgba(248, 69, 101, 0.3)",
                }}
              >
                <ChevronLeftIcon width={20} className="text-red-400" />
              </button>

              <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                {Object.keys(dateTime).map((date) => {
                  const isSelected = selected === date;
                  return (
                    <button
                      onClick={() => setSelected(date)}
                      key={date}
                      className="relative group flex flex-col items-center justify-center h-14 w-14 aspect-square rounded-xl cursor-pointer transition-all duration-300"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, #dc2626, #f84565)"
                          : "rgba(248, 69, 101, 0.05)",
                        border: `2px solid ${
                          isSelected ? "#f84565" : "rgba(248, 69, 101, 0.2)"
                        }`,
                        boxShadow: isSelected
                          ? "0 8px 25px rgba(248, 69, 101, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)"
                          : "none",
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      {!isSelected && (
                        <div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(248, 69, 101, 0.2), rgba(234, 88, 12, 0.2))",
                            filter: "blur(10px)",
                          }}
                        />
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
                        <div
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full"
                          style={{
                            background: "#fff",
                            boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </span>

              <button
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "rgba(248, 69, 101, 0.1)",
                  border: "1px solid rgba(248, 69, 101, 0.3)",
                }}
              >
                <ChevronRightIcon width={20} className="text-red-400" />
              </button>
            </div>
          </div>

          <button
            onClick={onBookHandle}
            className="relative group px-8 py-4 mt-6 rounded-xl font-bold text-white transition-all duration-300 overflow-hidden cursor-pointer"
            style={{
              background: selected
                ? "linear-gradient(135deg, #f84565, #d63854)"
                : "rgba(248, 69, 101, 0.3)",
              border: "2px solid rgba(248, 69, 101, 0.5)",
              boxShadow: selected
                ? "0 10px 30px rgba(248, 69, 101, 0.4)"
                : "none",
              opacity: selected ? 1 : 0.6,
            }}
          >
            {selected && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                  animation: "shimmer 2s infinite",
                }}
              />
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
