import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import internetLogo from '../assets/images/internet.png';

interface BouncingLogo {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const MediaPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showContent, setShowContent] = useState<boolean>(false);
  const [videoStatus, setVideoStatus] = useState<string>('Loading...');
  const [bouncingLogos, setBouncingLogos] = useState<BouncingLogo[]>([]);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = (clickedId: number, event: React.MouseEvent<HTMLImageElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const logoCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    
    setBouncingLogos(prevLogos => 
      prevLogos.map(logo => {
        if (logo.id === clickedId) {
          // Calculate direction away from click point
          const angle = Math.atan2(
            logoCenter.y - event.clientY,
            logoCenter.x - event.clientX
          );
          
          // Give it a strong push in that direction
          const pushStrength = 8;
          return {
            ...logo,
            vx: Math.cos(angle) * pushStrength,
            vy: Math.sin(angle) * pushStrength
          };
        }
        return logo;
      })
    );
  };

  // Test if video file is accessible
  useEffect(() => {
    fetch('/hand_ascii_final_web.mp4', { method: 'HEAD' })
      .then(response => {
        console.log('Video file response:', response.status, response.headers.get('content-type'));
        if (!response.ok) {
          setVideoStatus(`File not found: ${response.status}`);
        }
      })
      .catch(err => {
        console.error('Failed to fetch video:', err);
        setVideoStatus(`Fetch failed: ${err.message}`);
      });
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const easternTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
      
      const hours = easternTime.getHours().toString().padStart(2, '0');
      const minutes = easternTime.getMinutes().toString().padStart(2, '0');
      const seconds = easternTime.getSeconds().toString().padStart(2, '0');
      
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
      
      // Initialize 5 bouncing logos with random positions and velocities
      const logoSize = 180; // Bigger size for the logos
      const logos: BouncingLogo[] = [];
      for (let i = 0; i < 5; i++) {
        logos.push({
          id: i,
          x: Math.random() * (window.innerWidth - logoSize),
          y: Math.random() * (window.innerHeight - logoSize),
          vx: (Math.random() - 0.5) * 4 + (Math.random() > 0.5 ? 2 : -2), // Random velocity between -4 and 4, but not too slow
          vy: (Math.random() - 0.5) * 4 + (Math.random() > 0.5 ? 2 : -2)
        });
      }
      setBouncingLogos(logos);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Animation loop for bouncing logos
  useEffect(() => {
    if (bouncingLogos.length === 0) return;

    const logoSize = 180; // Same bigger size
    const animate = () => {
      setBouncingLogos(prevLogos => 
        prevLogos.map(logo => {
          let newX = logo.x + logo.vx;
          let newY = logo.y + logo.vy;
          let newVx = logo.vx;
          let newVy = logo.vy;

          // Bounce off walls
          if (newX <= 0 || newX >= window.innerWidth - logoSize) {
            newVx = -newVx;
            newX = newX <= 0 ? 0 : window.innerWidth - logoSize;
          }
          if (newY <= 0 || newY >= window.innerHeight - logoSize) {
            newVy = -newVy;
            newY = newY <= 0 ? 0 : window.innerHeight - logoSize;
          }

          return {
            ...logo,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bouncingLogos.length]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden" ref={containerRef}>
      {/* Debug info - Remove this section once video is working */}
      {videoStatus.includes('Error') && (
        <div className="absolute top-20 left-4 text-white z-40 bg-black bg-opacity-50 p-2">
          <p>Video Status: {videoStatus}</p>
        </div>
      )}

      {/* Bouncing logos */}
      {showContent && bouncingLogos.map(logo => (
        <img
          key={logo.id}
          src={internetLogo}
          alt="Bouncing logo"
          className="absolute transition-opacity duration-1000 cursor-pointer hover:scale-110"
          onClick={(e) => handleLogoClick(logo.id, e)}
          style={{
            left: `${logo.x}px`,
            top: `${logo.y}px`,
            width: '180px',
            height: '180px',
            zIndex: 5,
            opacity: showContent ? 1 : 0,
            transition: 'opacity 1s, transform 0.2s'
          }}
        />
      ))}

      <video
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
        onLoadStart={() => setVideoStatus('Load started')}
        onLoadedData={() => setVideoStatus('Data loaded')}
        onLoadedMetadata={() => setVideoStatus('Metadata loaded')}
        onCanPlay={() => setVideoStatus('Can play')}
        onCanPlayThrough={() => setVideoStatus('Can play through')}
        onPlay={() => setVideoStatus('Playing')}
        onError={(e) => {
          const video = e.currentTarget;
          let errorMsg = 'Unknown error';
          if (video.error) {
            switch(video.error.code) {
              case 1: errorMsg = 'MEDIA_ERR_ABORTED'; break;
              case 2: errorMsg = 'MEDIA_ERR_NETWORK'; break;
              case 3: errorMsg = 'MEDIA_ERR_DECODE'; break;
              case 4: errorMsg = 'MEDIA_ERR_SRC_NOT_SUPPORTED'; break;
            }
          }
          setVideoStatus(`Error: ${errorMsg}`);
        }}
      >
        <source src="/hand_ascii_final_web.mp4" type="video/mp4" />
      </video>

      <button
        onClick={() => navigate('/')}
        className={`absolute top-4 left-4 text-white hover:text-gray-300 z-20 transition-all duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}
        style={{
          fontSize: '18px',
          fontFamily: "'Josefin Slab', serif",
          letterSpacing: '0.1em'
        }}
      >
        ← Back to Portfolio
      </button>

      <div 
        className={`text-center transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <div 
          className="text-8xl mb-8 text-white"
          style={{
            fontFamily: "'Josefin Slab', serif",
            letterSpacing: '0.05em',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}
        >
          {currentTime}
        </div>
        
        <p 
          className="text-2xl text-white"
          style={{
            fontFamily: "'Josefin Slab', serif",
            letterSpacing: '0.1em',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
          }}
        >
          The media room is being built.
        </p>
      </div>
    </div>
  );
};

export default MediaPage;