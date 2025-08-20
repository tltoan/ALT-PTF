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
  const [flowers, setFlowers] = useState<any[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [flowerDisplacements, setFlowerDisplacements] = useState<{[key: string]: {x: number, y: number, rotation: number, scale: number}}>({});
  
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

  // Calculate flower displacement with improved physics
  React.useEffect(() => {
    if (!containerRef.current || chainNodes.length === 0) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newDisplacements: {[key: string]: {x: number, y: number, rotation: number, scale: number}} = {};

    flowers.forEach(flower => {
      const flowerX = (flower.x / 100) * rect.width;
      const flowerY = (flower.y / 100) * rect.height;
      
      let totalPushX = 0;
      let totalPushY = 0;
      let closestDistance = Infinity;
      let creatureVelocityX = 0;
      let creatureVelocityY = 0;

      // Check distance from creature segments with more sophisticated physics
      for (let i = 0; i < Math.min(chainNodes.length, 30); i++) {
        const node = chainNodes[i];
        const dx = flowerX - node.x;
        const dy = flowerY - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          // Track creature movement direction
          if (i < chainNodes.length - 1) {
            creatureVelocityX = node.x - chainNodes[i + 1].x;
            creatureVelocityY = node.y - chainNodes[i + 1].y;
          }
        }
        
        // Different effect zones for more realistic wading
        const innerZone = i < 5 ? 60 : 40; // Direct contact zone
        const outerZone = i < 5 ? 150 : 100; // Influence zone
        
        if (distance < outerZone && distance > 0) {
          // Multi-layered displacement calculation
          let force = 0;
          
          if (distance < innerZone) {
            // Strong push in inner zone - flowers get pushed aside
            force = Math.pow((innerZone - distance) / innerZone, 0.8) * 120;
          } else {
            // Gentle sway in outer zone
            force = Math.pow((outerZone - distance) / (outerZone - innerZone), 2) * 40;
          }
          
          // Apply force perpendicular to creature movement for parting effect
          const perpX = -dy / distance; // Perpendicular to radial
          const perpY = dx / distance;
          
          // Mix radial push with perpendicular parting
          const radialWeight = 0.7;
          const perpWeight = 0.3;
          
          totalPushX += (dx / distance) * force * radialWeight + perpX * force * perpWeight;
          totalPushY += (dy / distance) * force * radialWeight + perpY * force * perpWeight;
          
          // Add wake effect based on creature velocity
          if (i < 10 && movementSpeed > 2) {
            const wakeForce = force * 0.3;
            totalPushX += creatureVelocityX * wakeForce * 0.1;
            totalPushY += creatureVelocityY * wakeForce * 0.1;
          }
        }
      }

      // Apply spring-back force for recovery
      const currentDisplacement = flowerDisplacements[flower.id] || { x: 0, y: 0, rotation: 0, scale: 1 };
      const springForce = 0.08; // How quickly flowers spring back
      const damping = 0.85; // Smooth the motion
      
      const targetX = totalPushX;
      const targetY = totalPushY;
      
      // Smooth interpolation with spring physics
      const newX = currentDisplacement.x * damping + targetX * (1 - damping);
      const newY = currentDisplacement.y * damping + targetY * (1 - damping);
      
      // Calculate rotation based on displacement direction
      const rotation = Math.atan2(newY, newX) * (180 / Math.PI) * 0.1;
      
      // Scale flowers down slightly when very close to creature
      const scale = closestDistance < 40 ? 0.85 : 
                   closestDistance < 80 ? 0.9 + (closestDistance - 40) / 400 : 1;
      
      // Limit maximum displacement with softer boundaries
      const maxDisplacement = flower.size < 50 ? 80 : 150;
      const totalDistance = Math.sqrt(newX * newX + newY * newY);
      
      if (totalDistance > maxDisplacement) {
        const limitedX = (newX / totalDistance) * maxDisplacement;
        const limitedY = (newY / totalDistance) * maxDisplacement;
        newDisplacements[flower.id] = { 
          x: limitedX, 
          y: limitedY, 
          rotation: rotation,
          scale: scale
        };
      } else {
        newDisplacements[flower.id] = { 
          x: newX, 
          y: newY, 
          rotation: rotation,
          scale: scale
        };
      }
    });

    setFlowerDisplacements(newDisplacements);
  }, [chainNodes, flowers, movementSpeed]);

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

      // Add more variety of flower sizes
      // Tiny flowers (background layer)
      for (let i = 0; i < 40; i++) {
        flowerArray.push({
          id: `tiny-${i}`,
          x: Math.random() * 98 + 1,
          y: Math.random() * 98 + 1,
          size: 15 + Math.random() * 15, // 15-30px
          delay: Math.random() * 2,
          duration: 4 + Math.random() * 3,
          petalColor:
            petalColors[Math.floor(Math.random() * petalColors.length)],
          centerColor:
            centerColors[Math.floor(Math.random() * centerColors.length)],
          opacity: 0,
          zIndex: 0,
        });
      }

      // Small flowers
      for (let i = 0; i < 80; i++) {
        flowerArray.push({
          id: `small-${i}`,
          x: Math.random() * 95 + 2.5,
          y: Math.random() * 95 + 2.5,
          size: 25 + Math.random() * 25, // 25-50px
          delay: Math.random() * 1.5,
          duration: 3 + Math.random() * 2,
          petalColor:
            petalColors[Math.floor(Math.random() * petalColors.length)],
          centerColor:
            centerColors[Math.floor(Math.random() * centerColors.length)],
          opacity: 0,
          zIndex: 1,
        });
      }

      // Medium flowers
      for (let i = 0; i < 25; i++) {
        flowerArray.push({
          id: `medium-${i}`,
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5,
          size: 50 + Math.random() * 40, // 50-90px
          delay: Math.random() * 1,
          duration: 3.5 + Math.random() * 2,
          petalColor:
            petalColors[Math.floor(Math.random() * petalColors.length)],
          centerColor:
            centerColors[Math.floor(Math.random() * centerColors.length)],
          opacity: 0,
          zIndex: 2,
        });
      }

      // Large flowers (scattered)
      for (let i = 0; i < 8; i++) {
        flowerArray.push({
          id: `large-${i}`,
          x: Math.random() * 85 + 7.5,
          y: Math.random() * 85 + 7.5,
          size: 100 + Math.random() * 80, // 100-180px
          delay: Math.random() * 1,
          duration: 4 + Math.random() * 2,
          petalColor:
            petalColors[Math.floor(Math.random() * petalColors.length)],
          centerColor:
            centerColors[Math.floor(Math.random() * centerColors.length)],
          opacity: 0,
          zIndex: 5,
        });
      }

      // Huge flowers (focal points) - reduced
      const hugePositions = [
        { x: 15, y: 25 },
        { x: 75, y: 70 },
        { x: 85, y: 20 },
        { x: 30, y: 75 },
      ];

      hugePositions.forEach((pos, i) => {
        flowerArray.push({
          id: `huge-${i}`,
          x: pos.x + (Math.random() - 0.5) * 10, // Add some randomness
          y: pos.y + (Math.random() - 0.5) * 10,
          size: 180 + Math.random() * 120, // 180-300px, slightly smaller
          delay: Math.random() * 1,
          duration: 4 + Math.random() * 2,
          petalColor:
            petalColors[Math.floor(Math.random() * petalColors.length)],
          centerColor:
            centerColors[Math.floor(Math.random() * centerColors.length)],
          opacity: 0,
          zIndex: 10,
        });
      });

      // Set all flowers to visible immediately
      setFlowers(flowerArray.map((f) => ({ ...f, opacity: 1 })));
    };

    generateFlowers();
  }, []);

  return (
    <div
      className="min-h-screen bg-black relative overflow-hidden"
      ref={containerRef}>
      {/* Skeletal snake/lizard - rendered behind everything */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
        width="100%"
        height="100%">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Draw spine/backbone */}
        {chainNodes.length > 1 && (
          <polyline
            points={chainNodes.map(n => `${n.x},${n.y}`).join(' ')}
            fill="none"
            stroke="rgba(200, 200, 200, 0.8)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {/* Draw vertebrae and ribs */}
        {chainNodes.map((node, index) => {
          const angle = index > 0 
            ? Math.atan2(node.y - chainNodes[index - 1].y, node.x - chainNodes[index - 1].x)
            : 0;
          const perpAngle = angle + Math.PI / 2;
          const ribLength = node.size * 2.8; // Adjusted ribs for smaller body
          
          // Taper ribs - wider at front, narrower at tail
          const ribTaper = 1 - (index / chainNodes.length) * 0.5;
          
          return (
            <g key={index}>
              {/* Small vertebra dots along spine */}
              <circle
                cx={node.x}
                cy={node.y}
                r="2"
                fill="rgba(220, 220, 220, 0.5)"
              />
              
              {/* Clean curved ribs that bend downward from the spine - less frequent */}
              {index > 0 && index < chainNodes.length - 8 && index % 2 === 0 && (
                <>
                  {/* Left rib - starts perpendicular then curves down */}
                  <path
                    d={`M ${node.x} ${node.y} 
                        C ${node.x + Math.cos(perpAngle) * ribLength * 0.5} ${node.y + Math.sin(perpAngle) * ribLength * 0.5}
                          ${node.x + Math.cos(perpAngle) * ribLength * 0.8} ${node.y + Math.sin(perpAngle) * ribLength * 0.8 + 15}
                          ${node.x + Math.cos(perpAngle - 0.5) * ribLength * ribTaper} ${node.y + Math.sin(perpAngle - 0.5) * ribLength * ribTaper + 25}`}
                    stroke="rgba(200, 200, 200, 0.7)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Right rib - starts perpendicular then curves down */}
                  <path
                    d={`M ${node.x} ${node.y} 
                        C ${node.x - Math.cos(perpAngle) * ribLength * 0.5} ${node.y - Math.sin(perpAngle) * ribLength * 0.5}
                          ${node.x - Math.cos(perpAngle) * ribLength * 0.8} ${node.y - Math.sin(perpAngle) * ribLength * 0.8 + 15}
                          ${node.x - Math.cos(perpAngle + 0.5) * ribLength * ribTaper} ${node.y - Math.sin(perpAngle + 0.5) * ribLength * ribTaper + 25}`}
                    stroke="rgba(200, 200, 200, 0.7)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </>
              )}
              
              {/* Legs with claws (every 8th segment for 50-node body) */}
              {index % 8 === 0 && index > 3 && index < chainNodes.length - 10 && (() => {
                // Get direction to cursor for oriented stepping
                const directionToCursor = Math.atan2(
                  cursorPos.y - node.y,
                  cursorPos.x - node.x
                );
                
                // Create walking animation with alternating leg movements
                const legPairIndex = Math.floor(index / 4);
                const walkPhase = (walkCycle + legPairIndex * Math.PI * 0.5) % (Math.PI * 2);
                const isLeftLegForward = Math.sin(walkPhase) > 0;
                
                // Step cycle: lift -> reach forward -> plant -> push back
                const stepCycle = walkPhase % (Math.PI * 2);
                const normalizedStep = stepCycle / (Math.PI * 2);
                
                // Leg reaches forward when lifted, pulls back when planted
                const leftStepOffset = Math.cos(walkPhase) * 25; // Forward/back motion
                const rightStepOffset = Math.cos(walkPhase + Math.PI) * 25;
                
                // Lift legs in a stepping motion
                const leftLegLift = Math.max(0, Math.sin(walkPhase)) * 20;
                const rightLegLift = Math.max(0, Math.sin(walkPhase + Math.PI)) * 20;
                
                // Speed affects step size
                const stepSize = Math.min(movementSpeed * 3, 40);
                
                // Segment lengths - much longer legs
                const upperLegLength = ribLength * 1.5;
                const lowerLegLength = ribLength * 1.8;
                
                // Calculate leg positions perpendicular to spine segment
                const spineAngle = index > 0 
                  ? Math.atan2(node.y - chainNodes[index - 1].y, node.x - chainNodes[index - 1].x)
                  : angle;
                // Both legs angled slightly forward from perpendicular
                const forwardAngle = 0.4; // Angle legs forward
                const leftLegBaseAngle = spineAngle + Math.PI/2 - forwardAngle; // Left side, angled forward
                const rightLegBaseAngle = spineAngle - Math.PI/2 + forwardAngle; // Right side, angled forward
                
                // Knee bend based on step phase - sharper 90 degree bends
                const leftKneeBend = isLeftLegForward 
                  ? Math.PI/2 + Math.PI/4 * Math.sin(walkPhase) // 90+ degree bend when lifting
                  : Math.PI/3; // 60 degree bend when planted
                const rightKneeBend = !isLeftLegForward 
                  ? Math.PI/2 + Math.PI/4 * Math.sin(walkPhase + Math.PI) // 90+ degree bend
                  : Math.PI/3;
                
                // Calculate joint positions for left leg
                const leftShoulderX = node.x;
                const leftShoulderY = node.y;
                
                // Left leg reaches forward when stepping
                const leftReachAngle = leftLegBaseAngle + (isLeftLegForward ? -0.3 : 0.2); // Reach forward when stepping
                const leftElbowX = leftShoulderX + 
                  Math.cos(leftReachAngle) * upperLegLength + 
                  Math.cos(spineAngle) * leftStepOffset * 0.8; // Step along body direction
                const leftElbowY = leftShoulderY + 
                  Math.sin(leftReachAngle) * upperLegLength + 
                  Math.sin(spineAngle) * leftStepOffset * 0.8 - 
                  leftLegLift * 0.5;
                
                // Sharp downward angle for lower leg segment
                const leftFootAngle = leftReachAngle + leftKneeBend; // Add bend for sharp angle
                const leftFootX = leftElbowX + 
                  Math.cos(leftFootAngle) * lowerLegLength +
                  Math.cos(spineAngle) * leftStepOffset * 0.5;
                const leftFootY = leftElbowY + 
                  Math.sin(leftFootAngle) * lowerLegLength +
                  Math.sin(spineAngle) * leftStepOffset * 0.3 - 
                  leftLegLift;
                
                // Calculate joint positions for right leg
                const rightShoulderX = node.x;
                const rightShoulderY = node.y;
                
                // Right leg reaches forward when stepping
                const rightReachAngle = rightLegBaseAngle + (!isLeftLegForward ? 0.3 : -0.2); // Reach forward when stepping
                const rightElbowX = rightShoulderX + 
                  Math.cos(rightReachAngle) * upperLegLength + 
                  Math.cos(spineAngle) * rightStepOffset * 0.8; // Step along body direction
                const rightElbowY = rightShoulderY + 
                  Math.sin(rightReachAngle) * upperLegLength + 
                  Math.sin(spineAngle) * rightStepOffset * 0.8 - 
                  rightLegLift * 0.5;
                
                // Sharp downward angle for lower leg segment
                const rightFootAngle = rightReachAngle - rightKneeBend; // Subtract bend for correct angle on right side
                const rightFootX = rightElbowX + 
                  Math.cos(rightFootAngle) * lowerLegLength +
                  Math.cos(spineAngle) * rightStepOffset * 0.5;
                const rightFootY = rightElbowY + 
                  Math.sin(rightFootAngle) * lowerLegLength +
                  Math.sin(spineAngle) * rightStepOffset * 0.3 - 
                  rightLegLift;
                
                return (
                  <>
                    {/* Left leg with segments */}
                    <g>
                      {/* Upper leg segment (shoulder to elbow) */}
                      <line
                        x1={leftShoulderX}
                        y1={leftShoulderY}
                        x2={leftElbowX}
                        y2={leftElbowY}
                        stroke={`rgba(200, 200, 200, ${isLeftLegForward ? 0.8 : 0.5})`}
                        strokeWidth="2.5"
                        strokeLinecap="square"
                      />
                      
                      {/* Lower leg segment (elbow to foot) */}
                      <line
                        x1={leftElbowX}
                        y1={leftElbowY}
                        x2={leftFootX}
                        y2={leftFootY}
                        stroke={`rgba(200, 200, 200, ${isLeftLegForward ? 0.8 : 0.5})`}
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                      
                      {/* Elbow joint */}
                      <rect
                        x={leftElbowX - 3}
                        y={leftElbowY - 3}
                        width="6"
                        height="6"
                        fill="rgba(220, 220, 220, 0.9)"
                        transform={`rotate(45 ${leftElbowX} ${leftElbowY})`}
                      />
                      
                      {/* Bigger claw foot - facing forward */}
                      <g transform={`translate(${leftFootX}, ${leftFootY})`}>
                        {/* Foot pad/base */}
                        <circle cx="0" cy="0" r="5" fill="rgba(180, 180, 180, 0.4)" stroke="rgba(200, 200, 200, 0.6)" strokeWidth="1"/>
                        {/* Claws pointing toward head (forward) */}
                        <g transform={`rotate(${(spineAngle + Math.PI) * 180 / Math.PI})`}>
                          <line x1="0" y1="0" x2="15" y2="5" stroke={`rgba(200, 200, 200, ${leftLegLift < 5 ? 0.9 : 0.7})`} strokeWidth="2.5"/>
                          <line x1="0" y1="0" x2="15" y2="-5" stroke={`rgba(200, 200, 200, ${leftLegLift < 5 ? 0.9 : 0.7})`} strokeWidth="2.5"/>
                          <line x1="0" y1="0" x2="18" y2="0" stroke={`rgba(200, 200, 200, ${leftLegLift < 5 ? 0.9 : 0.7})`} strokeWidth="2.5"/>
                        </g>
                        {/* Joint at ankle */}
                        <circle cx="0" cy="0" r="3" fill="rgba(220, 220, 220, 0.8)"/>
                      </g>
                    </g>
                    
                    {/* Right leg with segments */}
                    <g>
                      {/* Upper leg segment (shoulder to elbow) */}
                      <line
                        x1={rightShoulderX}
                        y1={rightShoulderY}
                        x2={rightElbowX}
                        y2={rightElbowY}
                        stroke={`rgba(200, 200, 200, ${!isLeftLegForward ? 0.8 : 0.5})`}
                        strokeWidth="2.5"
                        strokeLinecap="square"
                      />
                      
                      {/* Lower leg segment (elbow to foot) */}
                      <line
                        x1={rightElbowX}
                        y1={rightElbowY}
                        x2={rightFootX}
                        y2={rightFootY}
                        stroke={`rgba(200, 200, 200, ${!isLeftLegForward ? 0.8 : 0.5})`}
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                      
                      {/* Elbow joint */}
                      <rect
                        x={rightElbowX - 3}
                        y={rightElbowY - 3}
                        width="6"
                        height="6"
                        fill="rgba(220, 220, 220, 0.9)"
                        transform={`rotate(45 ${rightElbowX} ${rightElbowY})`}
                      />
                      
                      {/* Bigger claw foot - facing forward */}
                      <g transform={`translate(${rightFootX}, ${rightFootY})`}>
                        {/* Foot pad/base */}
                        <circle cx="0" cy="0" r="5" fill="rgba(180, 180, 180, 0.4)" stroke="rgba(200, 200, 200, 0.6)" strokeWidth="1"/>
                        {/* Claws pointing toward head (forward) */}
                        <g transform={`rotate(${(spineAngle + Math.PI) * 180 / Math.PI})`}>
                          <line x1="0" y1="0" x2="15" y2="5" stroke={`rgba(200, 200, 200, ${rightLegLift < 5 ? 0.9 : 0.7})`} strokeWidth="2.5"/>
                          <line x1="0" y1="0" x2="15" y2="-5" stroke={`rgba(200, 200, 200, ${rightLegLift < 5 ? 0.9 : 0.7})`} strokeWidth="2.5"/>
                          <line x1="0" y1="0" x2="18" y2="0" stroke={`rgba(200, 200, 200, ${rightLegLift < 5 ? 0.9 : 0.7})`} strokeWidth="2.5"/>
                        </g>
                        {/* Joint at ankle */}
                        <circle cx="0" cy="0" r="3" fill="rgba(220, 220, 220, 0.8)"/>
                      </g>
                    </g>
                  </>
                );
              })()}
            </g>
          );
        })}
        
        {/* Extended neck and head */}
        {chainNodes.length > 2 && (() => {
          // Calculate neck extension from first few nodes
          const headNode = chainNodes[0];
          const neckNode1 = chainNodes[1];
          const neckNode2 = chainNodes[2];
          
          // Direction the head is facing
          const headAngle = Math.atan2(
            headNode.y - neckNode1.y,
            headNode.x - neckNode1.x
          );
          
          // Extended neck position
          const neckLength = 30;
          const neckX = headNode.x + Math.cos(headAngle) * neckLength * 0.5;
          const neckY = headNode.y + Math.sin(headAngle) * neckLength * 0.5;
          const skullX = headNode.x + Math.cos(headAngle) * neckLength;
          const skullY = headNode.y + Math.sin(headAngle) * neckLength;
          
          return (
            <>
              {/* Neck vertebrae */}
              <line
                x1={headNode.x}
                y1={headNode.y}
                x2={skullX}
                y2={skullY}
                stroke="rgba(200, 200, 200, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Curved neck spines like ribs */}
              {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
                const spineX = headNode.x + Math.cos(headAngle) * neckLength * t;
                const spineY = headNode.y + Math.sin(headAngle) * neckLength * t;
                const perpAngle = headAngle + Math.PI/2;
                const spineLength = 15 - i * 2; // Gradually smaller toward head
                
                return (
                  <g key={i}>
                    {/* Vertebra */}
                    <circle cx={spineX} cy={spineY} r="2.5" fill="rgba(220, 220, 220, 0.7)"/>
                    
                    {/* Curved spines on each side */}
                    <path
                      d={`M ${spineX} ${spineY} 
                          C ${spineX + Math.cos(perpAngle) * spineLength * 0.5} ${spineY + Math.sin(perpAngle) * spineLength * 0.5}
                            ${spineX + Math.cos(perpAngle) * spineLength * 0.8} ${spineY + Math.sin(perpAngle) * spineLength * 0.8 + 5}
                            ${spineX + Math.cos(perpAngle - 0.3) * spineLength} ${spineY + Math.sin(perpAngle - 0.3) * spineLength + 8}`}
                      stroke="rgba(200, 200, 200, 0.7)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${spineX} ${spineY} 
                          C ${spineX - Math.cos(perpAngle) * spineLength * 0.5} ${spineY - Math.sin(perpAngle) * spineLength * 0.5}
                            ${spineX - Math.cos(perpAngle) * spineLength * 0.8} ${spineY - Math.sin(perpAngle) * spineLength * 0.8 + 5}
                            ${spineX - Math.cos(perpAngle + 0.3) * spineLength} ${spineY - Math.sin(perpAngle + 0.3) * spineLength + 8}`}
                      stroke="rgba(200, 200, 200, 0.7)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
              
              {/* Skull/head */}
              <g transform={`translate(${skullX}, ${skullY})`}>
                {/* Main skull shape - larger and more detailed */}
                <g transform={`rotate(${headAngle * 180 / Math.PI})`}>
                  {/* Skull base */}
                  <ellipse
                    cx="0"
                    cy="0"
                    rx="12"
                    ry="8"
                    fill="rgba(220, 220, 220, 0.7)"
                    stroke="rgba(200, 200, 200, 0.9)"
                    strokeWidth="2"
                  />
                  
                  {/* Snout/jaw */}
                  <polygon
                    points="8,-5 25,0 8,5"
                    fill="rgba(220, 220, 220, 0.8)"
                    stroke="rgba(200, 200, 200, 0.9)"
                    strokeWidth="1.5"
                  />
                  
                  {/* Upper jaw teeth */}
                  <line x1="12" y1="-3" x2="14" y2="-6" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1"/>
                  <line x1="16" y1="-2" x2="18" y2="-5" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1"/>
                  <line x1="20" y1="-1" x2="22" y2="-4" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1"/>
                  
                  {/* Lower jaw teeth */}
                  <line x1="12" y1="3" x2="14" y2="6" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1"/>
                  <line x1="16" y1="2" x2="18" y2="5" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1"/>
                  <line x1="20" y1="1" x2="22" y2="4" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1"/>
                  
                  {/* Nostril holes instead of eyes */}
                  <circle cx="15" cy="-2" r="1.5" fill="rgba(0, 0, 0, 0.5)"/>
                  <circle cx="15" cy="2" r="1.5" fill="rgba(0, 0, 0, 0.5)"/>
                  
                  {/* Spine ridge on skull */}
                  <line x1="-10" y1="0" x2="5" y2="0" stroke="rgba(200, 200, 200, 0.6)" strokeWidth="2"/>
                </g>
              </g>
            </>
          );
        })()}
      </svg>
      
      {/* Background flowers - rendered with improved wading physics */}
      {flowers.map((flower) => {
        const displacement = flowerDisplacements[flower.id] || { x: 0, y: 0, rotation: 0, scale: 1 };
        
        return (
          <div
            key={flower.id}
            className="absolute pointer-events-none"
            style={{
              left: `${flower.x}%`,
              top: `${flower.y}%`,
              transform: `translate(${displacement.x}px, ${displacement.y}px) rotate(${displacement.rotation}deg) scale(${displacement.scale})`,
              transition: "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              opacity: flower.opacity,
              zIndex: flower.zIndex || 1,
              transformOrigin: 'center bottom', // Flowers bend from the stem
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
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  filter: displacement.scale < 0.95 ? 'brightness(0.9)' : 'none', // Darken compressed flowers
                }}>
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
    </div>
  );
};

export default ProjectsPage;
