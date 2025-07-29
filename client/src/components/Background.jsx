const Background = () => {
  return (
    <video
      className="fixed right-0 bottom-0 -z-10000 mix-blend-overlay w-full h-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      src="/src/assets/galaxy.mp4"
    />
  );
};

export default Background;
