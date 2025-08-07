import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseFile from "../components/BaseFile";

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [flowers, setFlowers] = useState<any[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleFileClick = (fileName: string) => {
    setExpandedFile(expandedFile === fileName ? null : fileName);
  };

  // Track cursor position - same as CosmicPortfolio
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setCursorPos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const projects = [
    { name: "Cykle", meta: "Cykle" },
    { name: "SourcererAI", meta: "SourcererAI" },
    { name: "Halcyon", meta: "Halcyon" },
  ];

  // Flower component with soft, rounded petals
  // Get flower position - same pattern as stars
  const getFlowerPosition = (flower: any) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const flowerX = (flower.x / 100) * rect.width;
    const flowerY = (flower.y / 100) * rect.height;

    // Calculate distance from cursor to flower
    const dx = cursorPos.x - (flowerX + rect.left);
    const dy = cursorPos.y - (flowerY + rect.top);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Repulsion effect - only for small flowers (size < 100)
    const repulsionRange = 150;
    const maxRepulsion = 80;

    if (flower.size < 100 && distance < repulsionRange && distance > 0) {
      const repulsionStrength = (repulsionRange - distance) / repulsionRange;
      const force = repulsionStrength * maxRepulsion;
      const pushX = -(dx / distance) * force;
      const pushY = -(dy / distance) * force;
      return { x: pushX, y: pushY };
    }

    return { x: 0, y: 0 };
  };

  // Generate random flowers on mount
  React.useEffect(() => {
    const petalColors = [
      "#7CB8B8", // Original teal
      "#FF9AA2", // Light pink
      "#FFB7B2", // Peach
      "#FFDAC1", // Light orange
      "#E2F0CB", // Light green
      "#B5EAD7", // Mint
      "#C7CEEA", // Lavender
      "#9AB5D6", // Light blue
      "#F2CC8F", // Sand
      "#E8DCC1", // Beige
      "#D4A5A5", // Dusty rose
      "#A8DADC", // Powder blue
      "#F1E4E8", // Blush
      "#CDB4DB", // Light purple
      "#BDE0E5", // Sky
    ];

    const centerColors = [
      "#C8D647", // Original yellow
      "#FFD700", // Gold
      "#FFA500", // Orange
      "#FF6B6B", // Coral
      "#98D8C8", // Mint
      "#F7DC6F", // Light yellow
      "#F8B195", // Salmon
      "#C06C84", // Rose
      "#6C5B7B", // Purple
      "#355C7D", // Navy
    ];

    const generateFlowers = () => {
      const flowerArray = [];

      // Add 55 small flowers FIRST (so they render behind)
      for (let i = 0; i < 55; i++) {
        flowerArray.push({
          id: `small-${i}`,
          x: Math.random() * 95 + 2.5,
          y: Math.random() * 95 + 2.5,
          size: 30 + Math.random() * 20, // 30-50px
          delay: Math.random() * 1,
          duration: 3 + Math.random() * 2,
          petalColor:
            petalColors[Math.floor(Math.random() * petalColors.length)],
          centerColor:
            centerColors[Math.floor(Math.random() * centerColors.length)],
          opacity: 0,
          zIndex: 1, // Lower z-index
        });
      }

      // Add 5 huge flowers LAST (so they render on top)
      const hugePositions = [
        { x: 15, y: 25 },
        { x: 75, y: 65 },
        { x: 85, y: 15 },
        { x: 25, y: 75 },
        { x: 50, y: 45 }, // New massive flower in center
      ];

      hugePositions.forEach((pos, i) => {
        flowerArray.push({
          id: `huge-${i}`,
          x: pos.x,
          y: pos.y,
          size: 280 + Math.random() * 120, // 280-400px
          delay: Math.random() * 1,
          duration: 4 + Math.random() * 2,
          petalColor:
            petalColors[Math.floor(Math.random() * petalColors.length)],
          centerColor:
            centerColors[Math.floor(Math.random() * centerColors.length)],
          opacity: 0,
          zIndex: 10, // Higher z-index
        });
      });

      // Set all flowers to visible immediately
      setFlowers(flowerArray.map((f) => ({ ...f, opacity: 1 })));
    };

    generateFlowers();
  }, []);

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden"
      ref={containerRef}>
      {/* Background flowers - rendered inline like stars */}
      {flowers.map((flower) => {
        const effect = getFlowerPosition(flower);
        return (
          <div
            key={flower.id}
            className="absolute pointer-events-none"
            style={{
              left: `${flower.x}%`,
              top: `${flower.y}%`,
              transform: `translate(${effect.x}px, ${effect.y}px)`,
              transition: "transform 0.2s ease-out",
              opacity: flower.opacity,
              zIndex: flower.zIndex || 1,
            }}>
            <div
              style={{
                animation: `flowerFloat ${flower.duration}s ease-in-out ${flower.delay}s infinite`,
                width: "100%",
                height: "100%",
              }}>
              <svg
                width={flower.size}
                height={flower.size}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg">
                <g fill={flower.petalColor} opacity="1">
                  <ellipse
                    cx="50"
                    cy="30"
                    rx="11"
                    ry="22"
                    transform="rotate(-5 50 30)"
                  />
                  <ellipse
                    cx="65"
                    cy="40"
                    rx="14"
                    ry="24"
                    transform="rotate(40 65 40)"
                  />
                  <ellipse
                    cx="65"
                    cy="60"
                    rx="11"
                    ry="20"
                    transform="rotate(110 65 60)"
                  />
                  <ellipse
                    cx="32"
                    cy="62"
                    rx="16"
                    ry="25"
                    transform="rotate(220 32 62)"
                  />
                  <ellipse
                    cx="35"
                    cy="40"
                    rx="10"
                    ry="20"
                    transform="rotate(-50 35 40)"
                  />
                </g>
                <circle
                  cx="50"
                  cy="50"
                  r="11"
                  fill={flower.centerColor}
                  opacity="1"
                />
              </svg>
            </div>
          </div>
        );
      })}

      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-black hover:text-gray-600 transition-colors z-10"
        style={{
          fontSize: "18px",
          fontFamily: "'Josefin Slab', serif",
          letterSpacing: "0.1em",
        }}>
        ← Back to Portfolio
      </button>

      {/* Left Sidebar */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-start pl-8 z-10">
        {projects.map((project) => (
          <button
            key={project.meta}
            onClick={() => handleFileClick(project.meta)}
            className={`text-2xl mb-6 transition-all duration-300 ${
              expandedFile === project.meta
                ? "text-black font-bold translate-x-2"
                : "text-gray-600 hover:text-black"
            }`}
            style={{
              fontFamily: "'Josefin Slab', serif",
              letterSpacing: "0.1em",
            }}>
            {project.name}
          </button>
        ))}
      </div>

      {/* Files - Back to original layout with full width */}

      {/* Cykle File - furthest back */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[100vw] h-[95vh] transition-all duration-500 ease-in-out"
        style={{
          transform: `translateX(${expandedFile === "Cykle" ? 10 : 68}%) translateY(-50%)`,
          zIndex: expandedFile === "Cykle" ? 100 : 50,
        }}>
        <BaseFile
          fillColor="rgba(255, 255, 255, 1)"
          strokeColor="black"
          strokeWidth={3}
          meta="Cykle">
          <div
            className="text-black p-8 pl-[300px] mt-10"
            style={{ fontFamily: "'Josefin Slab', serif" }}>
            <h1 className="text-4xl mb-4">
              Cykle | Co-founder : Technical and Product
            </h1>
            <p className="text-lg mb-4">📍 Location Thrifting, Everywhere.</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Features</h3>
                <ul className="list-disc list-inside">
                  <li>Incubated w/ F.INC | Off SEASON</li>
                  <li>Accelerator w/ Launch Chapel Hill</li>
                </ul>
              </div>
            </div>
          </div>
        </BaseFile>
      </div>

      {/* SourcererAI File - middle */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[100vw] h-[95vh] transition-all duration-500 ease-in-out"
        style={{
          transform: `translateX(${expandedFile === "SourcererAI" ? 10 : 73}%) translateY(-50%)`,
          zIndex: expandedFile === "SourcererAI" ? 100 : 51,
        }}>
        <BaseFile
          fillColor="rgba(255, 255, 255, 1)"
          strokeColor="black"
          strokeWidth={3}
          meta="SourcererAI">
          <div
            className="text-black p-8 pl-[300px] mt-10"
            style={{ fontFamily: "'Josefin Slab', serif" }}>
            <h1 className="text-4xl mb-4">
              SourcererAI | Product Design & UX Researcher Intern
            </h1>
            <p className="text-lg mb-4">
              Agentic Supply Chain and Procurement | backed by A16z
            </p>
            <div className="space-y-4">
              <div>
                <ul>
                  <li></li>
                </ul>
              </div>
            </div>
          </div>
        </BaseFile>
      </div>

      {/* Halcyon File - front */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[100vw] h-[95vh] transition-all duration-500 ease-in-out"
        style={{
          transform: `translateX(${expandedFile === "Halcyon" ? 10 : 78}%) translateY(-50%)`,
          zIndex: expandedFile === "Halcyon" ? 100 : 52,
        }}>
        <BaseFile
          fillColor="rgba(255, 255, 255, 1)"
          strokeColor="black"
          strokeWidth={3}
          meta="Halcyon">
          <div
            className="text-black p-8 pl-[300px] mt-10"
            style={{ fontFamily: "'Josefin Slab', serif" }}>
            <h1 className="text-4xl mb-4">Halcyon</h1>
            <p className="text-lg mb-4">
              Your Halcyon project information here
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Overview</h3>
                <p>Project overview and goals</p>
              </div>
            </div>
          </div>
        </BaseFile>
      </div>
    </div>
  );
};

export default ProjectsPage;
