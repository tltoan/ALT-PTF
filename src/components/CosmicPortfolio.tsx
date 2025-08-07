import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import sunImage from "../assets/images/sun.png";
import starImage from "../assets/images/star.png";
import mailImage from "../assets/images/mail.png";
import tvImage from "../assets/images/tv.png";
import filesImage from "../assets/images/files.png";
import linkedinImage from "../assets/images/linkedin.png";
import twitterImage from "../assets/images/twitter.png";
import backgroundMusic from "../assets/audio/Tout le monde est fou (Club Version).mp3";

const CosmicPortfolio = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [trailPos, setTrailPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [sunOffset, setSunOffset] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<any[]>([]);
  const [backgroundSquares, setBackgroundSquares] = useState<any[]>([]);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Generate random stars and background squares on mount
  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      const starCount = 60; // Reduced from 150

      for (let i = 0; i < starCount; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1, // Slightly smaller range
          twinkleDelay: Math.random() * 3, // Varied delays for more dynamic twinkling
          rotateSpeed: (Math.random() - 0.5) * 1.5, // Slightly slower rotation
          brightness: Math.random() * 0.6 + 0.4, // Higher brightness range (0.4-1.0)
        });
      }

      setStars(starArray);
    };

    const generateBackgroundSquares = () => {
      const squareArray = [];
      const squareCount = 250; // Increased from 150

      for (let i = 0; i < squareCount; i++) {
        squareArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.8, // Bigger range (0.8-2.8px)
          twinkleDelay: Math.random() * 6, // Slower, more subtle twinkling
          brightness: Math.random() * 0.3 + 0.2, // Slightly brighter (0.2-0.5)
        });
      }

      setBackgroundSquares(squareArray);
    };

    generateStars();
    generateBackgroundSquares();
  }, []);

  // Initialize audio on mount
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(backgroundMusic);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // Set volume to 50%
    }

    // Try to play on first user interaction
    const handleFirstInteraction = async () => {
      if (!hasUserInteracted && audioRef.current) {
        setHasUserInteracted(true);
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // Audio play failed
        }
      }
    };

    // Attempt immediate autoplay
    const attemptAutoplay = async () => {
      try {
        await audioRef.current?.play();
        setIsPlaying(true);
        setHasUserInteracted(true);
      } catch (error) {
        // Autoplay blocked, waiting for user interaction
        // Add event listeners for first interaction
        document.addEventListener("click", handleFirstInteraction, {
          once: true,
        });
        document.addEventListener("mousemove", handleFirstInteraction, {
          once: true,
        });
        document.addEventListener("touchstart", handleFirstInteraction, {
          once: true,
        });
        document.addEventListener("keydown", handleFirstInteraction, {
          once: true,
        });
      }
    };

    attemptAutoplay();

    return () => {
      audioRef.current?.pause();
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("mousemove", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [hasUserInteracted]);

  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current || !hasUserInteracted) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, hasUserInteracted]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Set cursor position in pixels for smoother movement
      const newPos = {
        x: e.clientX,
        y: e.clientY,
      };
      setCursorPos(newPos);
    };

    // Track cursor globally for smoother movement
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Smooth trail animation
  useEffect(() => {
    const animateTrail = () => {
      setTrailPos((prev) => {
        const dx = cursorPos.x - prev.x;
        const dy = cursorPos.y - prev.y;

        // Easing factor (0.15 = smooth following, lower = more lag)
        const ease = 0.15;

        return {
          x: prev.x + dx * ease,
          y: prev.y + dy * ease,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animateTrail);
    };

    animationFrameRef.current = requestAnimationFrame(animateTrail);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cursorPos]);

  // Calculate sun movement based on cursor position (wading effect)
  useEffect(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from cursor to sun center
    const dx = cursorPos.x - centerX;
    const dy = cursorPos.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Wading effect - stronger but still less than stars
    const effectRange = 250; // Increased range
    const maxOffset = 60; // Increased offset

    if (distance < effectRange && distance > 0) {
      // Sun moves away from cursor (wading effect)
      const repulsionStrength = (effectRange - distance) / effectRange;
      const offsetX = -(dx / distance) * repulsionStrength * maxOffset;
      const offsetY = -(dy / distance) * repulsionStrength * maxOffset;

      setSunOffset({ x: offsetX, y: offsetY });
    } else {
      // Smoothly return to center when cursor is far
      setSunOffset((prev) => {
        const newX = prev.x * 0.85;
        const newY = prev.y * 0.85;
        // Snap to 0 when very close to center
        return {
          x: Math.abs(newX) < 0.5 ? 0 : newX,
          y: Math.abs(newY) < 0.5 ? 0 : newY,
        };
      });
    }
  }, [cursorPos]);

  // Track hover state for interactive elements
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.style.cursor === "pointer"
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const getStarPosition = (star: any) => {
    if (!containerRef.current) return { x: 0, y: 0, brightness: 1 };

    const rect = containerRef.current.getBoundingClientRect();
    const starX = (star.x / 100) * rect.width;
    const starY = (star.y / 100) * rect.height;

    // Calculate distance from cursor to star
    const dx = cursorPos.x - (starX + rect.left);
    const dy = cursorPos.y - (starY + rect.top);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Repulsion effect - push stars away from cursor with increased range and strength
    const repulsionRange = 150; // Increased range
    const maxRepulsion = 80; // Increased strength

    if (distance < repulsionRange && distance > 0) {
      const repulsionStrength = (repulsionRange - distance) / repulsionRange;
      const force = repulsionStrength * maxRepulsion;
      const pushX = -(dx / distance) * force;
      const pushY = -(dy / distance) * force;
      // Brightness increases as cursor gets closer (up to 2x brighter)
      const brightnessMult = 1 + repulsionStrength;
      return { x: pushX, y: pushY, brightness: brightnessMult };
    }

    return { x: 0, y: 0, brightness: 1 };
  };

  const handleSunClick = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    setIsPlaying(!isPlaying);
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowSocialModal(false);
      setIsModalClosing(false);
    }, 300); // Match animation duration
  };

  const getBackgroundSquarePosition = (square: any) => {
    if (!containerRef.current) return { x: 0, y: 0, brightness: 1 };

    const rect = containerRef.current.getBoundingClientRect();
    const squareX = (square.x / 100) * rect.width;
    const squareY = (square.y / 100) * rect.height;

    // Calculate distance from cursor to square
    const dx = cursorPos.x - (squareX + rect.left);
    const dy = cursorPos.y - (squareY + rect.top);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Subtle repulsion effect for background squares
    const repulsionRange = 80; // Smaller range than X-stars
    const maxRepulsion = 30; // Much less strength

    if (distance < repulsionRange && distance > 0) {
      const repulsionStrength = (repulsionRange - distance) / repulsionRange;
      const force = repulsionStrength * maxRepulsion;
      const pushX = -(dx / distance) * force;
      const pushY = -(dy / distance) * force;
      // Subtle brightness increase (up to 1.5x brighter)
      const brightnessMult = 1 + repulsionStrength * 0.5;
      return { x: pushX, y: pushY, brightness: brightnessMult };
    }

    return { x: 0, y: 0, brightness: 1 };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-none">
      {/* Background Squares - with glimmering effects */}
      {backgroundSquares.map((square) => {
        const effect = getBackgroundSquarePosition(square);
        return (
          <div
            key={`bg-${square.id}`}
            className="absolute bg-white pointer-events-none"
            style={{
              left: `${square.x}%`,
              top: `${square.y}%`,
              width: `${square.size}px`,
              height: `${square.size}px`,
              transform: `translate(${effect.x}px, ${effect.y}px)`,
              transition:
                "transform 0.4s ease-out, opacity 0.3s ease-out, box-shadow 0.3s ease-out",
              opacity: square.brightness * effect.brightness,
              boxShadow: `0 0 ${square.size * 2 * effect.brightness}px rgba(255, 255, 255, ${square.brightness * 0.6 * effect.brightness})`,
              animation: `twinkle ${4 + square.twinkleDelay}s infinite ease-in-out alternate,
                         scale ${3 + square.twinkleDelay}s infinite ease-in-out alternate`,
              animationDelay: `${square.twinkleDelay}s`,
            }}
          />
        );
      })}

      {/* Title Text */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none"
        style={{ zIndex: 20, paddingTop: "40px" }}>
        <h1
          className={`text-white font-normal tracking-wider ${isMobile ? "text-lg" : "text-2xl"}`}
          style={{
            fontFamily: "'Josefin Slab', serif",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.3)",
            letterSpacing: isMobile ? "0.1em" : "0.2em",
          }}>
          ANTONY L TRAN
        </h1>
      </div>

      {/* Central Sun Container */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}>
        <div
          className="cursor-pointer pointer-events-auto"
          onClick={handleSunClick}
          style={{
            width: isMobile ? "200px" : "300px",
            height: isMobile ? "200px" : "300px",
            transform: `translate(${sunOffset.x}px, ${sunOffset.y}px)`,
            transition: "transform 0.3s ease-out",
          }}>
          <div className="w-full h-full relative">
            {/* Sun Image */}
            <img
              src={sunImage}
              alt="Sun"
              className="absolute inset-0 w-full h-full z-10"
              style={{
                animation:
                  "sunPulse 3s infinite ease-in-out, sunImagePulse 2.5s infinite ease-in-out, sunRotate 20s infinite linear",
                opacity: 1,
              }}
            />

            {/* Fractal Spikes - Positioned at exact center */}
            <div
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                width: "0",
                height: "0",
                animation: "sunRotateScale 30s infinite linear",
              }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={`spike-${i}`}
                  className="absolute"
                  style={{
                    left: "0",
                    top: "0",
                    transform: `rotate(${i * 45}deg)`,
                  }}>
                  <div
                    style={{
                      position: "absolute",
                      width: "12px",
                      height: "90px",
                      left: "-6px",
                      top: "-45px",
                      background: `linear-gradient(to bottom, 
                      transparent 0%, 
                      rgba(255, 200, 50, 0.2) 5%, 
                      rgba(255, 200, 50, 0.6) 20%, 
                      rgba(255, 255, 255, 1) 50%, 
                      rgba(255, 200, 50, 0.6) 80%, 
                      rgba(255, 200, 50, 0.2) 95%, 
                      transparent 100%)`,
                      filter: "blur(1px)",
                      boxShadow: `0 0 20px rgba(255, 200, 50, 0.8), 
                               0 0 35px rgba(255, 200, 50, 0.5)`,
                      animation: `spikeGlow ${2.5 + i * 0.1}s infinite ease-in-out`,
                      animationDelay: `${i * 0.1}s`,
                      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Static Icons Container */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 15 }}>
        {/* Star - Top Right */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            pointerEvents: "none",
            animation: isMobile
              ? "iconFloat1Mobile 4s infinite ease-in-out"
              : "iconFloat1 4s infinite ease-in-out",
          }}>
          {/* Star with wrapper */}
          <div
            className="relative"
            style={{
              width: isMobile ? "90px" : "120px",
              height: isMobile ? "90px" : "120px",
            }}>
            <img
              src={starImage}
              alt="Orbiting Star"
              style={{
                width: "100%",
                height: "100%",
                animation: "iconBreathe 3s infinite ease-in-out",
              }}
            />
            {/* 00 Text - Counter-rotating to stay horizontal */}
            <div
              className="absolute"
              style={{
                top: isMobile ? "-5px" : "-10px",
                right: isMobile ? "-15px" : "-20px",
                transformOrigin: "center",
              }}>
              <span
                className="text-white"
                style={{
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: "400",
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}>
                00
              </span>
            </div>
          </div>
        </div>

        {/* Mail - Bottom Right - Clickable */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            pointerEvents: "auto",
            animation: isMobile
              ? "iconFloat2Mobile 5s infinite ease-in-out"
              : "iconFloat2 5s infinite ease-in-out",
            cursor: "pointer",
          }}
          onClick={() => setShowSocialModal(true)}>
          {/* Mail with wrapper */}
          <div
            className="relative"
            style={{
              width: isMobile ? "60px" : "100px",
              height: isMobile ? "60px" : "100px",
            }}>
            <img
              src={mailImage}
              alt="Orbiting Mail"
              style={{
                width: "100%",
                height: "100%",
                animation: "iconBreathe 3.5s infinite ease-in-out",
              }}
            />
            {/* Mail Text - Counter-rotating to stay horizontal */}
            <div
              className="absolute"
              style={{
                top: isMobile ? "-5px" : "-10px",
                right: isMobile ? "-18px" : "-25px",
                transformOrigin: "center",
              }}>
              <span
                className="text-white"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}>
                01
              </span>
            </div>
          </div>
        </div>

        {/* TV - Bottom Left - Clickable */}
        <div
          className="absolute cursor-pointer hover:scale-110 transition-transform"
          onClick={() => navigate("/media")}
          style={{
            left: "50%",
            top: "50%",
            pointerEvents: "auto",
            animation: isMobile
              ? "iconFloat3Mobile 6s infinite ease-in-out"
              : "iconFloat3 6s infinite ease-in-out",
          }}>
          {/* TV with wrapper */}
          <div
            className="relative"
            style={{
              width: isMobile ? "100px" : "120px",
              height: isMobile ? "100px" : "120px",
            }}>
            <img
              src={tvImage}
              alt="Orbiting 3D"
              style={{
                width: "100%",
                height: "100%",
                animation: "iconBreathe 4s infinite ease-in-out",
              }}
            />
            {/* 3D Text - Counter-rotating to stay horizontal */}
            <div
              className="absolute"
              style={{
                top: isMobile ? "-5px" : "-10px",
                right: isMobile ? "-20px" : "-30px",
                transformOrigin: "center",
              }}>
              <span
                className="text-white"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}>
                02
              </span>
            </div>
          </div>
        </div>

        {/* Files - Top Left - Clickable */}
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            pointerEvents: "auto",
            animation: isMobile
              ? "iconFloat4Mobile 7s infinite ease-in-out"
              : "iconFloat4 7s infinite ease-in-out",
            cursor: "pointer",
          }}
          onClick={() => navigate("/projects")}>
          {/* Files with wrapper */}
          <div
            className="relative"
            style={{
              width: isMobile ? "110px" : "140px",
              height: isMobile ? "110px" : "140px",
            }}>
            <img
              src={filesImage}
              alt="Orbiting Files"
              style={{
                width: "100%",
                height: "100%",
                animation: "iconBreathe 4.5s infinite ease-in-out",
              }}
            />
            {/* Files Text - Counter-rotating to stay horizontal */}
            <div
              className="absolute"
              style={{
                top: isMobile ? "-5px" : "-10px",
                right: isMobile ? "-22px" : "-35px",
                transformOrigin: "center",
              }}>
              <span
                className="text-white"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  display: "inline-block",
                  whiteSpace: "nowrap",
                }}>
                03
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* X-shaped Pixelated Stars */}
      {stars.map((star) => {
        const effect = getStarPosition(star);
        return (
          <div
            key={star.id}
            className="absolute pointer-events-none"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              transform: `translate(${effect.x}px, ${effect.y}px)`,
              transition: "transform 0.3s ease-out, opacity 0.2s ease-out",
              opacity: star.brightness * effect.brightness,
            }}>
            {/* X-shaped Star Pattern with largest square in center */}
            <div
              className="relative"
              style={{
                width: `${star.size * 5}px`,
                height: `${star.size * 5}px`,
                animation: `starTwinkle ${2 + star.twinkleDelay}s infinite ease-in-out,
                           rotateAndScale ${20 + star.twinkleDelay * 3}s infinite linear`,
                animationDelay: `${star.twinkleDelay}s`,
                filter: `brightness(${effect.brightness * 1.5})`,
                transition: "filter 0.2s ease-out",
              }}>
              {/* Center square - largest */}
              <div
                className="absolute bg-white"
                style={{
                  width: `${star.size * 2}px`,
                  height: `${star.size * 2}px`,
                  left: `${star.size * 1.5}px`,
                  top: `${star.size * 1.5}px`,
                  boxShadow: `0 0 ${star.size * 4}px rgba(255, 255, 255, ${star.brightness}),
                           0 0 ${star.size * 8}px rgba(255, 255, 255, ${star.brightness * 0.5})`,
                }}
              />

              {/* Top-left diagonal square */}
              <div
                className="absolute bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `0px`,
                  top: `0px`,
                  boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, ${star.brightness * 0.7})`,
                }}
              />

              {/* Top-right diagonal square */}
              <div
                className="absolute bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `${star.size * 4}px`,
                  top: `0px`,
                  boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, ${star.brightness * 0.7})`,
                }}
              />

              {/* Bottom-left diagonal square */}
              <div
                className="absolute bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `0px`,
                  top: `${star.size * 4}px`,
                  boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, ${star.brightness * 0.7})`,
                }}
              />

              {/* Bottom-right diagonal square */}
              <div
                className="absolute bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `${star.size * 4}px`,
                  top: `${star.size * 4}px`,
                  boxShadow: `0 0 ${star.size}px rgba(255, 255, 255, ${star.brightness * 0.7})`,
                }}
              />

              {/* Inner diagonal connection squares */}
              <div
                className="absolute bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `${star.size}px`,
                  top: `${star.size}px`,
                  boxShadow: `0 0 ${star.size * 1.5}px rgba(255, 255, 255, ${star.brightness * 0.8})`,
                }}
              />

              <div
                className="absolute bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `${star.size * 3}px`,
                  top: `${star.size}px`,
                  boxShadow: `0 0 ${star.size * 1.5}px rgba(255, 255, 255, ${star.brightness * 0.8})`,
                }}
              />

              <div
                className="absolute bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `${star.size}px`,
                  top: `${star.size * 3}px`,
                  boxShadow: `0 0 ${star.size * 1.5}px rgba(255, 255, 255, ${star.brightness * 0.8})`,
                }}
              />

              <div
                className="absolute bg-white"
                style={{
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  left: `${star.size * 3}px`,
                  top: `${star.size * 3}px`,
                  boxShadow: `0 0 ${star.size * 1.5}px rgba(255, 255, 255, ${star.brightness * 0.8})`,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* Custom Cursor - Main */}
      <div
        className="fixed border-2 border-white rounded-full pointer-events-none mix-blend-difference"
        style={{
          zIndex: 9999,
          width: isHovering ? "30px" : "20px",
          height: isHovering ? "30px" : "20px",
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "width 0.2s ease-out, height 0.2s ease-out",
          borderWidth: isHovering ? "1px" : "2px",
        }}
      />

      {/* Custom Cursor - Center Dot */}
      <div
        className="fixed bg-white rounded-full pointer-events-none"
        style={{
          zIndex: 9999,
          width: "4px",
          height: "4px",
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: "translate(-50%, -50%)",
          opacity: isHovering ? 0 : 1,
          transition: "opacity 0.2s ease-out",
        }}
      />

      {/* Custom Cursor - Glow Trail Effect */}
      <div
        className="fixed rounded-full pointer-events-none"
        style={{
          zIndex: 9998,
          width: isHovering ? "50px" : "32px",
          height: isHovering ? "50px" : "32px",
          left: `${trailPos.x}px`,
          top: `${trailPos.y}px`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, rgba(255,255,255,${isHovering ? "0.3" : "0.2"}) 0%, transparent 70%)`,
          filter: "blur(3px)",
          transition:
            "width 0.2s ease-out, height 0.2s ease-out, background 0.2s ease-out",
        }}
      />

      {/* Footer Text */}
      <div
        className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none"
        style={{ zIndex: 20, paddingBottom: "40px" }}>
        <div className="text-center">
          <p
            className="text-white text-xs opacity-40"
            style={{
              fontFamily: "'Josefin Slab', serif",
              letterSpacing: "0.08em",
            }}>
            Tap the sun to stop the music.
          </p>
          <p
            className="text-white text-xs opacity-40"
            style={{
              fontFamily: "'Josefin Slab', serif",
              letterSpacing: "0.08em",
            }}>
            (00) Me : (01) Twitter/Linkedin : (02) Media : (03) Current Projects
          </p>
          <p
            className="text-white text-xs opacity-40"
            style={{
              fontFamily: "'Josefin Slab', serif",
              letterSpacing: "0.08em",
            }}>
            Built with React & Cosmic Energy
          </p>
        </div>
      </div>

      {/* Social Media Modal */}
      {showSocialModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 10000,
            backgroundColor: isModalClosing
              ? "rgba(0, 0, 0, 0)"
              : "rgba(0, 0, 0, 0.8)",
            transition: "background-color 0.3s ease-out",
          }}
          onClick={handleCloseModal}>
          <div
            className="relative border border-white rounded-lg"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              minWidth: isMobile ? "90%" : "550px",
              maxWidth: isMobile ? "90%" : "550px",
              paddingTop: isMobile ? "2rem" : "3rem",
              paddingLeft: isMobile ? "2rem" : "3rem",
              paddingRight: isMobile ? "2rem" : "3rem",
              paddingBottom: isMobile ? "1.5rem" : "2rem",
              boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
              transform: isModalClosing ? "scale(0.8)" : "scale(1)",
              opacity: isModalClosing ? 0 : 1,
              animation: !isModalClosing ? "modalAppear 0.3s ease-out" : "none",
              transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors"
              style={{
                fontSize: "32px",
                fontWeight: "200",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
              }}
              onClick={handleCloseModal}>
              ×
            </button>

            {/* Social Icons Container */}
            <div className="flex justify-around items-center gap-8 mt-6">
              {/* Twitter */}
              <a
                href="https://x.com/antonyltran"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group">
                <div
                  className="relative"
                  style={{
                    width: isMobile ? "80px" : "120px",
                    height: isMobile ? "80px" : "120px",
                    animation: "iconBreathe 3s infinite ease-in-out",
                  }}>
                  <img
                    src={twitterImage}
                    alt="Twitter"
                    className="w-full h-full object-contain"
                    style={{
                      filter: "brightness(1) contrast(1)",
                      transition: "filter 0.3s ease",
                    }}
                  />
                </div>
                <span
                  className="text-white mt-4 text-base"
                  style={{
                    fontFamily: "'Josefin Slab', serif",
                    letterSpacing: "0.1em",
                    opacity: 0.8,
                  }}>
                  Twitter
                </span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/antonytran05/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group">
                <div
                  className="relative"
                  style={{
                    width: isMobile ? "80px" : "120px",
                    height: isMobile ? "80px" : "120px",
                    animation: "iconBreathe 3s infinite ease-in-out",
                    animationDelay: "0.5s",
                  }}>
                  <img
                    src={linkedinImage}
                    alt="LinkedIn"
                    className="w-full h-full object-contain"
                    style={{
                      filter: "brightness(1) contrast(1)",
                      transition: "filter 0.3s ease",
                    }}
                  />
                </div>
                <span
                  className="text-white mt-4 text-base"
                  style={{
                    fontFamily: "'Josefin Slab', serif",
                    letterSpacing: "0.1em",
                    opacity: 0.8,
                  }}>
                  LinkedIn
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmicPortfolio;
