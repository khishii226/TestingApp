import React, { useState, useEffect } from "react";
import logo from "/logo.png";


export default function Logo({ onClick }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let maxHeight;
  if (windowWidth <= 400) {
    maxHeight = "3.5vh";
  } else if (windowWidth <= 600) {
    maxHeight = "5vh";
  } else {
    maxHeight = "8vh";
  }

  return (
    <img
      src={logo}
      alt="Logo"
      style={{
        position: "fixed",
        top: "14px",
        left: "20px",
        zIndex: 1000,
        border: "none",
        width: "auto",
        maxHeight: maxHeight,
        filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.5))",
        transition: "max-height 0.3s ease",
        cursor: onClick ? "pointer" : "default", // show pointer if clickable
      }}
      onClick={onClick}
    />
  );
}
