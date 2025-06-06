import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { faSquareWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUserTie, FaBars, FaSearch, FaBullseye, FaUsers, FaHandPointRight } from "react-icons/fa";
import { faUsersViewfinder } from '@fortawesome/free-solid-svg-icons';

export default function FloatingBubbleMenu() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [careerDetail, setCareerDetail] = useState(null);
  const bubbleRef = useRef(null);
  const videoRef = useRef(null);
const styles = {
    linkedin: { color: "#0077B5", fontSize: 32, textShadow: "10px 5px 6px black", },         
    instagram: { color: "#E1306C", fontSize: 32 },        
    whatsapp: { color: "#25D366", fontSize: 32 },         
    whatsappBusiness: { color: "#075E54", fontSize: 32 }, 
  };
  const videos = [ 
  "./v1.mp4",
  "./v2.mp4",
  "./v3.mp4",
];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const menuOptions = ["Careers", "Contact", "Map", "Connect", "Guide", "Vision", "Mission", "Why Us"];
const iconMap = {
  Careers: <FaUserTie style={{ marginRight: 8, color: "#7F8CFF" }} />,
  Contact: <FaEnvelope style={{ marginRight: 8, color: "#3CBC8D" }} />,
  Map: <FaMapMarkerAlt style={{ marginRight: 8, color: "#EB6E6E" }} />,
  Connect: <FaPhone style={{ marginRight: 8, color: "#4E9EF7" }} />,
  Guide: <FontAwesomeIcon icon={faUsersViewfinder} style={{ marginRight: 8, color: "#A29BFE" }} />,
  Vision: <FaSearch style={{ marginRight: 8, color: "#F8C471" }} />,
  Mission: <FaBullseye style={{ marginRight: 8, color: "#E74C3C" }} />,
  "Why Us": <FaUsers style={{ marginRight: 8, color: "#58D68D" }} />,
};



  const careerDetailsData = {
    "Computer Engineer": `We are hiring B.TECH Computer Engineers to join our team. You will work alongside other Computer Engineers and report directly to the Project Manager.Your roles and responsibilities will include Evaluating Business processes, anticipating requirements, uncovering areas for improvement, and developing and implementing solutions. To succeed in this role the individual should have a natural analytical way of thinking and be able to explain difficult concepts to non-technical users.`,
    "Business Analyst": `We are hiring Business Analyst to join our team. You will work alongside other business analysts and report directly to the project manager. Your roles and responsibilities will include performing detailed requirment analysis, documenting processes, and user acceptance testing. To succeed in this role the individual should have a natural analytical way of thinking.
Business Analyst Requirements:
A minimum of 1 years of experience in business analysis or a related field is preferred but freshers can also apply.
Exceptional analytical and conceptual thinking skills.
The ability to influence stakeholders and work closely with them to determine acceptable solutions.
Advanced technical skills.
Excellent documentation skills.
Fundamental analytical and conceptual thinking skills.
Experience creating detailed reports and giving presentations.
Competency in Microsoft applications including Word, Excel, and Outlook.
Excellent planning, organisational, and time management skills.`,
  };

  const contactInfo = {
    Phone: "0265-3548456",
    Email: "info@gharsee.com",
    Address: "SF-226, SIDDHARTH ANNEXE-1, Landmark: Macdonalds, Sama-Savli Rd, near Canal Road, New Sama, Vadodara, Gujarat 390024",
  };

  useEffect(() => {
    if (selected === "Guide") {
      setCurrentVideoIndex(0);
    }
  }, [selected]);

  
  const prevVideo = () => {
    setCurrentVideoIndex((i) => (i === 0 ? videos.length - 1 : i - 1));
  };

  const nextVideo = () => {
    setCurrentVideoIndex((i) => (i === videos.length - 1 ? 0 : i + 1));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target)) {
        setExpanded(false);
      }
    }
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  return (
    <>
      {/* Bubble Menu */}
      <motion.div
        ref={bubbleRef}
        onClick={() => setExpanded(!expanded)}
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(173, 216, 230, 0.5))",
          boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.3), 0 0 8px rgba(255, 255, 255, 0.3), 0 0 20px rgba(173, 216, 230, 0.5), inset 0 0 6px rgba(255,255,255,0.5)",
          backdropFilter: "blur(6px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          animation: "pulse 3s infinite ease-in-out",
          minWidth: 50,
          minHeight: 50,
        }}
        animate={{ scale: expanded ? 1 : [1, 1.03, 1], opacity: 1 }}
        transition={{
          duration: expanded ? 0.3 : 1.8,
          ease: "easeInOut",
          repeat: expanded ? 0 : Infinity,
          repeatType: "loop",
        }}
        whileHover={{ scale: 1.1 }}
      >
        <div className="flower-icon"><FaBars style={{ color: "#333" }} /></div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                position: "absolute",
                bottom: 70,
                left: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                padding: 14,
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                borderRadius: 16,
                boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                zIndex: 1001,
                filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.5))",
                minWidth: 50,
                maxWidth: 100,
              }}
            >
              {menuOptions.map((option) => (
  <button
    key={option}
    onClick={() => {
      setSelected(option);
      setExpanded(false);
      setCareerDetail(null);
    }}
    style={{
      background: "rgba(255,255,255,0.25)",
      border: "none",
      padding: "8px 14px",
      borderRadius: 10,
      color: "white",
      fontWeight: "600",
      cursor: "pointer",
      whiteSpace: "nowrap",
      fontSize: 14,
      display: "flex",
      alignItems: "center",
    }}
  >
    {iconMap[option]} {/* Insert icon */}
    {option}
  </button>
))}

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="overlay"
            className="bubble-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100dvh",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: 20,
            }}
            onClick={() => {
              setSelected(null);
              setCareerDetail(null);
            }}
          >
            <motion.div
              className="bubble-content"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                // background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                padding: 30,
                borderRadius: 20,
                color: "white",
                maxWidth: 480,
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                textAlign: "center",
                boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
              }}
            >
              {/* Careers */}
              {selected === "Careers" && !careerDetail && (
                <>
                  <h2>Careers</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 20 }}>
                    {Object.keys(careerDetailsData).map((career) => (
                      <div key={career} style={{
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: 14,
                        padding: 18,
                        textAlign: "left",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      }}>
                        <h3 style={{color: "#2b0a43"}}><FaUserTie style={{ color: "#54187f", marginRight: "8px" }}/>{career}</h3>
                        <button
                          onClick={() => setCareerDetail(career)}
                          style={{
                            background: "#ffffff22",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: 10,
                            color: "white",
                            cursor: "pointer",
                            marginTop: 6,
                            fontSize: 14,
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      marginTop: 30,
                      background: "#ffffff22",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: 16,
                      width: "100%",
                    }}
                  >
                    Close
                  </button>
                </>
              )}

              {/* Career Details */}
              {selected === "Careers" && careerDetail && (
                <>
                  <h2>{careerDetail} Details</h2>
                  <p style={{
                    marginTop: 14,
                    lineHeight: "1.5em",
                    fontSize: 15,
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                  }}>
                    {careerDetailsData[careerDetail]}
                  </p>
                  <button
                    onClick={() => setCareerDetail(null)}
                    style={{
                      marginTop: 30,
                      background: "#ffffff22",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: 16,
                      width: "100%",
                    }}
                  >
                    Back
                  </button>
                </>
              )}

              {/* Contact */}
              {selected === "Contact" && (
                <>
                  <h2>Contact Details</h2>
                  <div style={{
                    marginTop: 20,
                    textAlign: "left",
                    fontSize: 16,
                    lineHeight: "1.5em",
                  }}>
                    <p>
  <FaPhone style={{ color: "#228B22", marginRight: "8px" }} />
  {contactInfo.Phone}
</p>
<p>
  <FaEnvelope style={{ color: "blue", marginRight: "8px" }} />
  {contactInfo.Email}
</p>
<p>
  <FaMapMarkerAlt style={{ color: "red", marginRight: "8px" }} />
  {contactInfo.Address}
</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      marginTop: 30,
                      background: "#ffffff22",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: 16,
                      width: "100%",
                    }}
                  >
                    Close
                  </button>
                </>
              )}

              {/* Map */}
              {selected === "Map" && (
                <>
                  <h2>Our Location</h2>
                  <div style={{
                    width: "100%",
                    height: "min(400px, 40vh)",
                    borderRadius: 16,
                    overflow: "hidden",
                    marginTop: 20,
                    boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                  }}>
                    <iframe
                      title="Gharsee Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.1249381226445!2d73.1983834!3d22.3511394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fcffb4304bf17%3A0xcc9228197beb8c9b!2sGHARSEE%20TECH%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1716998502314!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      marginTop: 30,
                      background: "#ffffff22",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: 16,
                      width: "100%",
                    }}
                  >
                    Close
                  </button>
                </>
              )}

              {selected === "Connect" && (
  <>
    <h2>Connect With Us</h2>
<div style={{
  display: "flex",
  justifyContent: "center",
  gap: 20,
  marginTop: 20,
  flexWrap: "wrap",
}}>
      <a
        href="https://www.linkedin.com/company/gharsee/"
        target="_blank"
        rel="noopener noreferrer"
        title="LinkedIn"
      >
        <FontAwesomeIcon icon={faLinkedin} style={styles.linkedin} />
      </a>

      <a
        href="https://www.instagram.com/gharsee_tech/?igshid=YmMyMTA2M2Y%3D"
        target="_blank"
        rel="noopener noreferrer"
        title="Instagram"
      >
        <FontAwesomeIcon icon={faInstagram} style={styles.instagram} />
      </a>

      <a
        href="https://whatsapp.com/channel/0029Va9Z23u2ER6qyWTlu91J"
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} style={styles.whatsapp} />
      </a>

      <a
        href="https://wa.me/912653548456"
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp Business"
      >
        <FontAwesomeIcon icon={faSquareWhatsapp} style={styles.whatsappBusiness} />
      </a>
</div>
<button
  onClick={() => setSelected(null)}
  style={{
    marginTop: 30,
    background: "#ffffff22",
    border: "none",
    color:"white",
    padding: "12px 20px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: "600",
    fontSize: 16,
    width: "100%",
  }}
>
  Close
</button>
  </>
)}

{selected === "Guide" && (
  <>
    <h2>Guide</h2>
    <div style={{ marginTop: 20, position: "relative" }}>
      <video
        ref={videoRef}
        key={videos[currentVideoIndex]} // force re-render on src change
        src={videos[currentVideoIndex]}
        width="100%"
        height="auto"
        controls
        style={{
          borderRadius: 16,
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        }}
      >
        Your browser does not support the video tag.
      </video>

      {/* Previous Video Button */}
      <button
        onClick={prevVideo}
        aria-label="Previous Video"
        style={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.3)",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          userSelect: "none",
        }}
      >
        <FiChevronLeft size={24} />
      </button>

      {/* Next Video Button */}
      <button
        onClick={nextVideo}
        aria-label="Next Video"
        style={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",
          background: "rgba(255, 255, 255, 0.3)",
          border: "none",
          borderRadius: "50%",
          width: 40,
          height: 40,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          userSelect: "none",
        }}
      >
        <FiChevronRight size={24} />
      </button>
    </div>

    <div style={{ marginTop: 12, color: "white" }}>
      Video {currentVideoIndex + 1} of {videos.length}
    </div>

    <button
      onClick={() => setSelected(null)}
      style={{
        marginTop: 20,
        background: "#ffffff22",
        border: "none",
        padding: "12px 20px",
        borderRadius: 12,
        cursor: "pointer",
        fontWeight: "600",
        fontSize: 16,
        width: "100%",
        color: "white",
      }}
    >
      Close
    </button>
  </>
)}

{selected === "Vision" && (
                <>
                  <h2><img src="./vision.png" style={{height:"5vh", marginRight: '10px'}}/>OUR VISION</h2>
                  <div style={{
                    marginTop: 20,
                    textAlign: "left",
                    fontSize: 16,
                    lineHeight: "1.5em",
                  }}>
                    <p>To redefine the future of shopping by seamlessly blending physical and digital worlds.
<br/><br/>
<FaHandPointRight style={{ color: "#F8C471", marginRight: 8 }} />
GHARSEE envisions a global shift in e-commerce where immersive experiences replace passive browsing. By pioneering intuitive 3D interfaces and mobile VR technology, we aim to create a universe where users don’t just "see" products—they explore them in lifelike environments, revolutionizing how humanity shops forever.</p>
                    
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      marginTop: 30,
                      background: "#ffffff22",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: 16,
                      width: "100%",
                    }}
                  >
                    Close
                  </button>
                </>
              )}

{selected === "Mission" && (
                <>
                  <h2 ><img src="./mission.png" style={{height:"5vh", marginRight: '10px'}}/>OUR MISSION</h2>
                  <div style={{
                    marginTop: 20,
                    textAlign: "left",
                    fontSize: 16,
                    lineHeight: "1.5em",
                  }}>
                    <p>To elevate how the world shops by bridging imagination and reality through next-gen 3D and VR technology.
<br/>
GHARSEE is committed to revolutionizing commerce by creating seamless, enriching shopping journeys that adapt to every user’s lifestyle:
<br/><br/>
<FaHandPointRight style={{ color: "#F8C471", marginRight: 8 }} /> Next-Gen Access: Whether you’re browsing a product in interactive 3D on your screen or diving into full immersion with a mobile VR headset, GHARSEE ensures cutting-edge technology meets intuitive usability.
<br/><br/><FaHandPointRight style={{ color: "#F8C471", marginRight: 8 }} />Empathetic Design: We craft experiences that prioritize human connection—letting shoppers explore virtual showrooms like real stores, interact socially in shared spaces, and personalize purchases through AI-powered insights.
<br/><br/><FaHandPointRight style={{ color: "#F8C471", marginRight: 8 }} /> Boundless Discovery: From inspecting hyper-realistic 3D textures on your phone to walking through VR-enabled retail worlds, we transform shopping into an adventure that’s engaging, efficient, and endlessly inspiring.
</p>
                    
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      marginTop: 30,
                      background: "#ffffff22",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: 16,
                      width: "100%",
                    }}
                  >
                    Close
                  </button>
                </>
              )}
{selected === "Why Us" && (
                <>
                  <h2><img src="./whyus.png" style={{height:"6vh", marginRight: '10px'}}/>Why GHARSEE?</h2>
                  <div style={{
                    marginTop: 20,
                    textAlign: "left",
                    fontSize: 16,
                    lineHeight: "1.5em",
                  }}>
                    <p>Shopping isn’t just about what you buy—it’s about how it makes you feel.
<br/><br/><FaHandPointRight style={{ color: "#F8C471", marginRight: 8 }} /> Dual immersion: Explore products in rich 3D detail on any screen or step inside a VR world with your headset for the ultimate in-store experience from anywhere.
<br/><br/><FaHandPointRight style={{ color: "#F8C471", marginRight: 8 }} /> Feel the product, not the distance: Touchless yet tactile—see fabrics ripple, hear shoes click against virtual floors, or place furniture in your living room’s exact dimensions before buying.
Social & smart shopping: Invite friends to join VR tours of stores, crowdsource opinions on outfits in real time, or let AI guide you to products that match your style and needs.
<br/><br/><FaHandPointRight style={{ color: "#F8C471", marginRight: 8 }} /> No learning curve, just wow-factor: Our platform is built for everyone—whether you’re a tech enthusiast craving headsets or someone who prefers classic 3D browsing, GHARSEE meets you where you are.</p>
                    
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    style={{
                      marginTop: 30,
                      background: "#ffffff22",
                      color: "white",
                      border: "none",
                      padding: "12px 20px",
                      borderRadius: 12,
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: 16,
                      width: "100%",
                    }}
                  >
                    Close
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

 <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3), 0 0 8px rgba(255, 255, 255, 0.3), 0 0 20px rgba(173, 216, 230, 0.5), inset 0 0 6px rgba(255, 255, 255, 0.5);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.4), 0 0 12px rgba(255, 255, 255, 0.4), 0 0 30px rgba(173, 216, 230, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.6);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .flower-icon {
          font-size: 20px;
          color: white;
          transform-origin: center;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-weight: bold;
        }

        h1,h2, h3, p {
          color: white;
        }

        @media (max-width: 600px) {
          .flower-icon {
            font-size: 18px;
          }

          .bubble-content {
            padding: 16px !important;
            font-size: 14px;
          }

          .bubble-content h2 {
            font-size: 18px;
          }

          .bubble-content h3 {
            font-size: 16px;
          }

          .bubble-content p {
            font-size: 13px;
            line-height: 1.4em;
          }

          .bubble-content button {
            font-size: 13px !important;
            padding: 10px 14px !important;
          }

          .bubble-overlay {
            padding: 14px !important;
          }
        }

        @media (max-height: 500px) and (orientation: landscape) {
          .bubble-overlay {
            padding: 10px !important;
          }

          .bubble-content {
            max-height: 80dvh !important;
            padding: 14px !important;
          }

          .bubble-content h2 {
            font-size: 16px;
          }

          .bubble-content h3 {
            font-size: 14px;
          }

          .bubble-content p {
            font-size: 12px;
          }

          .bubble-content button {
            font-size: 13px !important;
            padding: 8px 12px !important;
          }
        }
      `}</style>

      
    </>
  );
}
