import React, { useEffect, useState, useRef } from "react";
import { Html, useProgress } from "@react-three/drei";

const bubbleColors = [
  "rgb(241, 103, 107)",
  "rgb(72, 36, 155)",
  "rgb(242, 66, 192)",
  "rgb(49, 118, 74)",
  "rgb(56, 160, 225)",
  "rgb(227, 147, 34)",
  "rgb(212, 42, 47)",
];

export default function Loader() {
  const { progress } = useProgress();
  const [dots, setDots] = useState(1);
  const mounted = useRef(false);

  const text = "Welcome to Gharsee";
  const [showPopup, setShowPopup] = useState(true);
  const [showWarning, setShowWarning] = useState(false);

  // Track progress changes to detect stalling
  const lastProgressRef = useRef(progress);
  const stallStartRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Error and unhandled rejection catcher
  useEffect(() => {
    function handleError() {
      setShowWarning(true);
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  // Check progress stall only if warning not shown
  useEffect(() => {
    if (showWarning) return; // stop checking once warning is shown

    if (progress === lastProgressRef.current) {
      // No progress change
      if (!stallStartRef.current) {
        stallStartRef.current = Date.now();
      } else {
        const stalledFor = Date.now() - stallStartRef.current;
        if (stalledFor > 30000) {
          // Stall detected > 30 seconds
          setShowWarning(true);
        }
      }
    } else {
      // Progress moved forward
      lastProgressRef.current = progress;
      stallStartRef.current = null;
    }

    // Also if progress stuck below 90% for > 2 mins
    if (progress < 90) {
      if (!stallStartRef.current) {
        stallStartRef.current = Date.now();
      } else {
        const stalledFor = Date.now() - stallStartRef.current;
        if (stalledFor > 120000) {
          setShowWarning(true);
        }
      }
    } else {
      stallStartRef.current = null;
    }
  }, [progress, showWarning]);

  // Dots animation interval stops when warning is shown
  useEffect(() => {
    if (showWarning) return; // freeze everything if warning is shown

    mounted.current = true;

    const interval = setInterval(() => {
      if (mounted.current) {
        setDots((d) => (d >= 3 ? 1 : d + 1));
      }
    }, 500);

    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [showWarning]);

  const letters = text.split("");

  return (
    <Html
      center
      style={{
        width: "100vw",
        height: "100vh",
        background: "transparent",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        pointerEvents: "none",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(1.8rem, 6vw, 4rem)",
          fontWeight: "600",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          lineHeight: "1.2",
        }}
      >
        {letters.map((letter, i) => (
          <span
            key={i}
            className="animated-letter"
            style={{
              animationDelay: `${i * 0.12}s`,
              textShadow: "2px 2px 4px black",
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        ))}
      </h1>

      {!showWarning && (
        <div
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            fontWeight: "400",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            letterSpacing: "0.1em",
            color: "#ddd",
            textShadow: "0 0 5px rgba(255,255,255,0.4)",
          }}
        >
          Loading{". ".repeat(dots)}
        </div>
      )}

      {showPopup && !showWarning && (
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            zIndex: 10,
            pointerEvents: "auto",
            transition: "opacity 1s ease-in-out",
          }}
        >
          ⚠️ Performance and Speed of the website depends on your device.
        </div>
      )}

      {showWarning && (
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#ffcccc",
            backgroundColor: "#330000aa",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            zIndex: 11,
            pointerEvents: "auto",
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          ⏳ Still loading... This might be due to memory or device performance issues.
          <br />
          <button
            onClick={() =>
              (window.location.href = "https://www.gharsee.com/")
            }
            style={{
              marginTop: "0.75rem",
              backgroundColor: "#fff",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "0.95rem",
              pointerEvents: "auto",
              boxShadow: "0 0 5px rgba(0,0,0,0.3)",
            }}
          >
            Check Out 2D Site
          </button>
        </div>
      )}

      <style>{`
        @keyframes letterPulse {
          0%, 100% {
            opacity: 0.6;
            color: ${bubbleColors[0]};
            text-shadow: 2px 2px 4px black, 0 0 5px ${bubbleColors[0]};
          }
          50% {
            opacity: 1;
            color: ${bubbleColors[3]};
            text-shadow: 2px 2px 4px black, 0 0 5px ${bubbleColors[0]};
          }
        }

        .animated-letter {
          display: inline-block;
          animation: letterPulse 2.5s ease-in-out infinite;
          will-change: opacity, color, text-shadow;
        }
      `}</style>
    </Html>
  );
}
