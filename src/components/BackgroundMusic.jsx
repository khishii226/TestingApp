import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const BackgroundMusic = ({ src = "/background.mp3", volume = 0.015 }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Track user interaction

  // Start the music when the user interacts with the page
  useEffect(() => {
    const audio = document.getElementById("background-music");
    if (!audio) return;

    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Don't start playing until the user interacts with the page
    if (hasInteracted) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {
        console.warn("Autoplay blocked");
      });
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [src, volume, hasInteracted]);

  const handleUserInteraction = () => {
    setHasInteracted(true); // Set interaction flag
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true));
    }
  };

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* 🔊 Attach actual audio tag to DOM so SceneAudio can find it */}
      <audio
        id="background-music"
        src={src}
        preload="auto"
        onPlay={handleUserInteraction} // Trigger interaction on play
      />
      
      {/* Button to toggle sound */}
      <button
        onClick={toggleSound}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          background: "rgba(0,0,0,0.6)",
          border: "none",
          borderRadius: "50%",
          padding: "10px",
          color: "white",
          cursor: "pointer"
        }}
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </>
  );
};

export default BackgroundMusic;
