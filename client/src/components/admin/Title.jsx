import React from "react";
import { Sparkles } from "lucide-react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="relative inline-flex items-center gap-3 group">
      {/* Sparkle Icon */}
      <div className="relative">
        <Sparkles className="w-6 h-6 text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
        {/* Glow behind sparkle */}
        <div className="absolute inset-0 bg-red-600/40 blur-lg rounded-full animate-pulse" />
      </div>

      {/* Title Text */}
      <h1 className="font-bold text-2xl md:text-3xl tracking-wide">
        {/* First Part - Normal Text */}
        <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {text1}{" "}
        </span>

        {/* Second Part - Gradient Animated Text */}
        <span className="relative inline-block">
          {/* Gradient Text */}
          <span className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_2.5s_linear_infinite] font-extrabold drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">
            {text2}
          </span>

          {/* Animated Underline */}
          <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-transparent rounded-full shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" />

          {/* Shimmer Effect */}
          <span className="absolute inset-0 overflow-hidden">
            <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]" />
          </span>
        </span>
      </h1>

      {/* Decorative Dots */}
      <div className="flex gap-1 ml-1">
        <div className="w-1.5 h-1.5 bg-red-600/40 rounded-full animate-pulse" />
        <div
          className="w-1.5 h-1.5 bg-red-600/60 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_6px_rgba(220,38,38,0.8)]"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
};

export default Title;
