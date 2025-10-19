import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        navigate("/" + nextUrl);
      }, 8000);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] mt-16 -mb-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[linear-gradient(to_right,#0f0f10_1px,transparent_1px),linear-gradient(to_bottom,#0f0f10_1px,transparent_1px)] bg-[size:1rem_1rem]" />
      </div>

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] animate-pulse" />

      {/* Loading Animation Container */}
      <div className="flex items-center justify-center w-32 h-32 relative z-10">
        {/* Head - Main Circle */}
        <div className="head absolute w-full h-full bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-[0_0_2rem_rgba(220,38,38,0.8)] blur-[0.3rem] z-[1] animate-pulse" />

        {/* Flames - Particles */}
        <div className="flames absolute z-0">
          {/* Particle 1 */}
          <div className="particle particle-1 absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-[0.3rem] border-t-[5px] border-t-red-700 border-l-[5px] border-l-red-700 w-16 h-16 -top-24 shadow-[0_0_15px_rgba(220,38,38,0.6)]" />

          {/* Particle 2 */}
          <div className="particle particle-2 absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-[0.3rem] border-t-[5px] border-t-red-700 border-l-[5px] border-l-red-700 w-6 h-6 -top-32 -left-20 shadow-[0_0_10px_rgba(220,38,38,0.6)]" />

          {/* Particle 3 */}
          <div className="particle particle-3 absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-[0.3rem] border-t-[5px] border-t-red-700 border-l-[5px] border-l-red-700 w-16 h-16 -top-20 -left-16 shadow-[0_0_15px_rgba(220,38,38,0.6)]" />

          {/* Particle 4 */}
          <div className="particle particle-4 absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-[0.3rem] border-t-[5px] border-t-red-700 border-l-[5px] border-l-red-700 w-12 h-12 -top-[7.5rem] shadow-[0_0_12px_rgba(220,38,38,0.6)]" />

          {/* Particle 5 */}
          <div className="particle particle-5 absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-[0.3rem] border-t-[5px] border-t-red-700 border-l-[5px] border-l-red-700 w-8 h-8 -top-36 left-4 shadow-[0_0_10px_rgba(220,38,38,0.6)]" />

          {/* Particle 6 */}
          <div className="particle particle-6 absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-[0.3rem] border-t-[5px] border-t-red-700 border-l-[5px] border-l-red-700 w-8 h-8 -top-[6.8rem] -left-6 shadow-[0_0_10px_rgba(220,38,38,0.6)]" />

          {/* Particle 7 */}
          <div className="particle particle-7 absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-[0.3rem] border-t-[5px] border-t-red-700 border-l-[5px] border-l-red-700 w-4 h-4 -top-40 -left-4 shadow-[0_0_8px_rgba(220,38,38,0.6)]" />

          {/* Particle 8 */}
          <div className="particle particle-8 absolute bg-gradient-to-br from-red-500 to-red-600 rounded-full blur-[0.3rem] border-t-[5px] border-t-red-700 border-l-[5px] border-l-red-700 w-[1.3rem] h-[1.3rem] -top-[7.5rem] -left-8 shadow-[0_0_10px_rgba(220,38,38,0.6)]" />
        </div>

        {/* Eye - Center Circle */}
        <div
          className="eye absolute flex items-center justify-center w-16 h-16 rounded-full z-[2] shadow-[0_0_1.5rem_rgba(220,38,38,0.8)]"
          style={{
            background:
              "radial-gradient(rgba(255, 247, 247, 1) 20%, rgba(255, 150, 150, 1) 100%)",
          }}
        />
      </div>

      {/* Loading Text with Animation */}
      <div className="mt-8 text-center z-10">
        <h2 className="text-3xl font-black bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_2.5s_linear_infinite] drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">
          Loading...
        </h2>

        {/* Dots Animation */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
          <div
            className="w-2 h-2 bg-red-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(220,38,38,0.8)]"
            style={{ animationDelay: "0.2s" }}
          />
          <div
            className="w-2 h-2 bg-red-500 rounded-full animate-bounce shadow-[0_0_8px_rgba(220,38,38,0.8)]"
            style={{ animationDelay: "0.4s" }}
          />
        </div>

        {/* Redirect Info */}
        {nextUrl && (
          <p className="mt-4 text-sm text-gray-400 font-semibold">
            Redirecting in a moment...
          </p>
        )}
      </div>

      {/* Bottom Decorative Line */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse" />
    </div>
  );
};

export default Loading;
