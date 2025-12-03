import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseFile from "../components/BaseFile";
import SourcererCaseStudy from "../assets/sourcerer_casestudy.pdf";

interface ChainNode {
  x: number;
  y: number;
  size: number;
}

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  // Snake chain state
  const [chainNodes, setChainNodes] = useState<ChainNode[]>([]);
  const chainEndRef = React.useRef({ x: 0, y: 0 });
  const animationFrameRef = React.useRef<number | null>(null);
  const chainSpeed = 0.15; // Speed factor for chain movement
  const [walkCycle, setWalkCycle] = useState(0); // For leg animation
  const [movementSpeed, setMovementSpeed] = useState(0); // Track movement speed
  const lastMousePos = React.useRef({ x: 0, y: 0 });
  const targetPos = React.useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 }); // Target the creature chases
  const chaseDelay = 0.02; // How much the creature lags behind (0-1, lower = more lag)
  const [isResting, setIsResting] = useState(false); // Resting state
  const restTimer = React.useRef<NodeJS.Timeout | null>(null);
  const lastMovementTime = React.useRef(Date.now());

  const handleFileClick = (fileName: string) => {
    setExpandedFile(expandedFile === fileName ? null : fileName);
  };

  // Load Twitter embed script when Cykle is expanded
  useEffect(() => {
    if (expandedFile === "Cykle") {
      // Load Twitter widgets script
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
      
      // Reload Twitter widgets if already loaded
      if ((window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load();
      }
      
      return () => {
        // Cleanup
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [expandedFile]);

  // Snake chain movement function
  const moveTo = (x: number, y: number, nodes: ChainNode[]) => {
    if (!nodes || nodes.length === 0) return nodes;
    
    // Create a copy of nodes to avoid mutation
    const newNodes = nodes.map(n => ({ ...n }));
    
    // Update first node to follow mouse
    newNodes[0].x = x;
    newNodes[0].y = y;
    
    // Calculate distance to end point
    let dist = Math.sqrt(
      Math.pow(x - chainEndRef.current.x, 2) + 
      Math.pow(y - chainEndRef.current.y, 2)
    );
    
    let len = Math.max(0, dist * chainSpeed);
    
    // Update each node to follow the previous one
    for (let i = newNodes.length - 1; i >= 0; i--) {
      const node = newNodes[i];
      const targetX = i === 0 ? x : newNodes[i - 1].x;
      const targetY = i === 0 ? y : newNodes[i - 1].y;
      
      const ang = Math.atan2(node.y - targetY, node.x - targetX);
      node.x = targetX + len * Math.cos(ang);
      node.y = targetY + len * Math.sin(ang);
      
      if (i > 0) {
        x = node.x;
        y = node.y;
        len = node.size;
      }
    }
    
    chainEndRef.current = { x: newNodes[newNodes.length - 1].x, y: newNodes[newNodes.length - 1].y };
    return newNodes;
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
    { name: "Pinned It", meta: "PinnedIt" },
    { name: "Cykle", meta: "Cykle" },
    { name: "SourcererAI", meta: "SourcererAI" },
  ];



  // Initialize snake chain
  React.useEffect(() => {
    const nodeCount = 50; // Back to 50 nodes
    const initialNodes: ChainNode[] = [];
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    
    for (let i = 0; i < nodeCount; i++) {
      initialNodes.push({
        x: startX,
        y: startY,
        size: 12 - i * 0.2, // Original taper rate
      });
    }
    
    setChainNodes(initialNodes);
    chainEndRef.current = { x: startX, y: startY };
    targetPos.current = { x: startX, y: startY };
  }, []);

  // Animate snake chain
  React.useEffect(() => {
    if (chainNodes.length === 0) return;
    
    const animate = () => {
      // Calculate distance to cursor
      const distToCursor = Math.sqrt(
        Math.pow(cursorPos.x - targetPos.current.x, 2) + 
        Math.pow(cursorPos.y - targetPos.current.y, 2)
      );
      
      // Distance from creature head to its target
      const distToTarget = chainNodes.length > 0 ? Math.sqrt(
        Math.pow(targetPos.current.x - chainNodes[0].x, 2) + 
        Math.pow(targetPos.current.y - chainNodes[0].y, 2)
      ) : 0;
      
      const activationDistance = 200; // Much larger activation distance
      const restDistance = 50; // Distance at which creature stops and rests
      
      // Check if should rest
      if (distToCursor < restDistance && distToTarget < 30) {
        if (!isResting) {
          setIsResting(true);
          lastMovementTime.current = Date.now();
        }
      } else if (distToCursor > activationDistance) {
        // Start chasing after a delay
        if (isResting && Date.now() - lastMovementTime.current > 1200) { // Longer wait time
          setIsResting(false);
        }
      }
      
      // Movement logic with resting
      if (!isResting) {
        // Chase with variable speed based on distance
        const urgency = Math.min(distToCursor / 400, 1); // 0-1 based on distance, slower scaling
        const lerpFactor = chaseDelay * (0.3 + urgency * 0.7); // Much slower chase speed
        
        targetPos.current.x += (cursorPos.x - targetPos.current.x) * lerpFactor;
        targetPos.current.y += (cursorPos.y - targetPos.current.y) * lerpFactor;
        
        // Update chain position
        setChainNodes(prevNodes => {
          if (!prevNodes || prevNodes.length === 0) return prevNodes;
          return moveTo(targetPos.current.x, targetPos.current.y, prevNodes);
        });
      } else {
        // Idle breathing animation when resting
        setChainNodes(prevNodes => {
          if (!prevNodes || prevNodes.length === 0) return prevNodes;
          // Subtle swaying motion
          const breathe = Math.sin(Date.now() * 0.001) * 2;
          const idleNodes = [...prevNodes];
          idleNodes.forEach((node, i) => {
            if (i > 0) {
              node.x += Math.sin(Date.now() * 0.001 + i * 0.1) * 0.3;
              node.y += Math.cos(Date.now() * 0.001 + i * 0.1) * 0.2;
            }
          });
          return idleNodes;
        });
      }
      
      // Calculate movement speed for leg animation
      const dx = targetPos.current.x - lastMousePos.current.x;
      const dy = targetPos.current.y - lastMousePos.current.y;
      const speed = isResting ? 0 : Math.sqrt(dx * dx + dy * dy);
      setMovementSpeed(speed);
      
      // Update walk cycle
      if (speed > 0.5 && !isResting) {
        const cycleSpeed = speed > 5 ? 0.2 : 0.1;
        setWalkCycle(prev => (prev + cycleSpeed) % (Math.PI * 2));
      } else if (isResting) {
        // Slow idle animation
        setWalkCycle(prev => (prev + 0.02) % (Math.PI * 2));
      }
      
      lastMousePos.current = { x: targetPos.current.x, y: targetPos.current.y };
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (restTimer.current) {
        clearTimeout(restTimer.current);
      }
    };
  }, [cursorPos.x, cursorPos.y, isResting]);



  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden"
      ref={containerRef}>
      {/* Skeletal snake/lizard - DISABLED 
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        width="100%"
        height="100%">
        ... (all SVG content commented out)
      </svg>
      */}
      


      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-white hover:text-gray-400 transition-colors z-10"
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
                ? "text-white font-bold translate-x-2"
                : "text-gray-400 hover:text-white"
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

      {/* Pinned It File - front */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[100vw] h-[95vh] transition-all duration-500 ease-in-out"
        style={{
          transform: `translateX(${expandedFile === "PinnedIt" ? 10 : 78}%) translateY(-50%)`,
          zIndex: expandedFile === "PinnedIt" ? 100 : 52,
        }}>
        <BaseFile
          fillColor="rgba(255, 255, 255, 1)"
          strokeColor="black"
          strokeWidth={3}
          meta="PinnedIt">
          <div
            className="text-black p-4 md:p-6 lg:p-8 xl:p-12"
            style={{ fontFamily: "'Josefin Slab', serif" }}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-3 font-bold">
              Pinned It
            </h1>
            <p className="text-lg md:text-xl mb-4 text-gray-700">Founder & Developer | The Anti-Instagram</p>
            
            <div className="space-y-4">
              {/* Vision */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">The Vision</h3>
                <p className="text-sm md:text-base text-gray-700 mb-2">
                  Capture authentic moments through multi-sensory data. No algorithms, no ads, no data selling - just real memories with the people who matter.
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">What I Built</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Core Features</p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Dual-camera photo pins</li>
                      <li>• Weather & music capture</li>
                      <li>• Daily adventure mapping</li>
                      <li>• Voice notes & journaling</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Social Features</p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Friend codes (no algorithms)</li>
                      <li>• Private group circles</li>
                      <li>• Global discovery pins</li>
                      <li>• "Digital graffiti" concept</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">React Native</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Supabase</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">PostGIS</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Apple Maps</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">RLS Security</span>
                </div>
              </div>

              {/* Business Model */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Business Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="font-medium text-gray-800">Free Tier</p>
                    <p className="text-gray-600 text-xs md:text-sm">Unlimited pins • 5 friends • 2-month retention</p>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <p className="font-medium text-gray-800">Premium ($2.99/mo)</p>
                    <p className="text-gray-600 text-xs md:text-sm">Unlimited friends • Permanent storage</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs md:text-sm text-gray-600">
                  <span className="font-medium">Status:</span> Live on iOS App Store | Continental Pin Campaign Active
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  <span className="font-medium">Website:</span>{" "}
                  <a href="https://www.get-pins.com/" target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 underline">
                    get-pins.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </BaseFile>
      </div>

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
            className="text-black p-4 md:p-6 lg:p-8 xl:p-12"
            style={{ fontFamily: "'Josefin Slab', serif" }}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-3 font-bold">
              Cykle
            </h1>
            <p className="text-lg md:text-xl mb-4 text-gray-700">Co-founder | Technical & Product Lead</p>
            
            <div className="space-y-4">
              {/* Problem & Solution */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">The Vision</h3>
                <p className="text-sm md:text-base text-gray-700 mb-2">
                  B2B2C marketplace connecting shoppers with verified thrift stores. Solving the fragmented secondhand fashion market through AI-powered cataloging and unified inventory discovery.
                </p>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">What We Built</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
                  <div>
                    <p className="font-medium text-gray-800 mb-1">For Shoppers</p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Tinder-style discovery feed</li>
                      <li>• Secure checkout (Apple Pay/Stripe)</li>
                      <li>• In-app messaging with stores</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-1">For Stores</p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• AI-powered listing (Moondream)</li>
                      <li>• POS integration (Square/Shopify)</li>
                      <li>• Inventory management</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">React Native</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">TypeScript</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Firebase</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Stripe</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Moondream AI</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Unified.to</span>
                </div>
              </div>

              {/* Recognition */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs md:text-sm text-gray-600">
                  <span className="font-medium">Recognition:</span> F.INC Off SEASON Incubator | Launch Chapel Hill Accelerator
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  <span className="font-medium">Website:</span>{" "}
                  <a href="https://www.cykle.co/" target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 underline">
                    cykle.co
                  </a>
                </p>
              </div>

              {/* Twitter Embed */}
              <div className="pt-3">
                <div className="max-w-full overflow-hidden rounded-xl" style={{ borderRadius: '12px' }}>
                  <blockquote 
                    className="twitter-tweet" 
                    data-media-max-width="560"
                    data-theme="light"
                    style={{ borderRadius: '12px' }}
                    dangerouslySetInnerHTML={{
                      __html: `<p lang="en" dir="ltr">the summer things took off<br><br>(does this count as a launch video?)<br><br>thank you <a href="https://twitter.com/fdotinc?ref_src=twsrc%5Etfw">@fdotinc</a> for a great summer! <a href="https://t.co/TdTPqB2fME">pic.twitter.com/TdTPqB2fME</a></p>&mdash; antony tran (@antonyltran) <a href="https://twitter.com/antonyltran/status/1951108250734305461?ref_src=twsrc%5Etfw">August 1, 2025</a>`
                    }}>
                  </blockquote>
                </div>
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
            className="text-black p-4 md:p-6 lg:p-8 xl:p-12"
            style={{ fontFamily: "'Josefin Slab', serif" }}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl mb-3 font-bold">
              SourcererAI
            </h1>
            <p className="text-lg md:text-xl mb-4 text-gray-700">Product Design & UX Research Intern</p>
            <p className="text-sm md:text-base mb-4 text-gray-600">AI-Powered Global Procurement Platform | Backed by A16Z</p>
            
            <div className="space-y-4">
              {/* Core Responsibilities */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">My Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
                  <div>
                    <p className="font-medium text-gray-800 mb-1">AI Interaction Design</p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• User flows for spec uploads & AI responses</li>
                      <li>• Plain-English to procurement translation</li>
                      <li>• Trust & transparency in AI decisions</li>
                      <li>• Edge cases & error state handling</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Enterprise UX</p>
                    <ul className="text-gray-600 space-y-1">
                      <li>• Quoting & ordering experiences</li>
                      <li>• ERP system integration workflows</li>
                      <li>• Multi-quote management dashboards</li>
                      <li>• Freight, tariff & financing displays</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Methods & Process */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Design Process</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Figma Prototyping</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Usability Testing</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Design Systems</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">User Research</span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs md:text-sm">Cross-functional Collaboration</span>
                </div>
              </div>

              {/* Key Achievements */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900">Key Achievements</h3>
                <ul className="text-sm md:text-base text-gray-700 space-y-1">
                  <li>• Designed supplier vetting transparency features</li>
                  <li>• Created cost breakdown visualizations</li>
                  <li>• Built design system aligned with AI-native vision</li>
                  <li>• Led design of company website (sourcererai.com)</li>
                  <li>• Tested with operations managers & brand teams</li>
                </ul>
              </div>

              {/* Links */}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs md:text-sm text-gray-600">
                  <span className="font-medium">Website:</span>{" "}
                  <a href="https://sourcererai.com/" target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 underline">
                    sourcererai.com
                  </a>
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  <span className="font-medium">Case Study:</span>{" "}
                  <a href={SourcererCaseStudy} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-800 underline">
                    View PDF Portfolio
                  </a>
                </p>
              </div>
            </div>
          </div>
        </BaseFile>
      </div>


    </div>
  );
};

export default ProjectsPage;
