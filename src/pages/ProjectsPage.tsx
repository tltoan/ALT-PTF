import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseFile from "../components/BaseFile";

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
    { name: "Halcyon", meta: "Halcyon" },
  ];

  // Flower component with soft, rounded petals
  // Get flower position - affected by creature body
  const getFlowerPosition = (flower: any) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const flowerX = (flower.x / 100) * rect.width;
    const flowerY = (flower.y / 100) * rect.height;

    let totalPushX = 0;
    let totalPushY = 0;

    // Check distance from creature segments
    if (chainNodes.length > 0) {
      for (let i = 0; i < Math.min(chainNodes.length, 20); i++) { // Check first 20 segments
        const node = chainNodes[i];
        const dx = node.x - flowerX;
        const dy = node.y - flowerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Stronger repulsion from creature body
        const repulsionRange = i < 5 ? 120 : 80; // Head has larger effect
        const maxRepulsion = i < 5 ? 100 : 60;
        
        if (flower.size < 100 && distance < repulsionRange && distance > 0) {
          const repulsionStrength = Math.pow((repulsionRange - distance) / repulsionRange, 1.5);
          const force = repulsionStrength * maxRepulsion;
          totalPushX -= (dx / distance) * force;
          totalPushY -= (dy / distance) * force;
        }
      }
    }

    // Limit maximum displacement
    const maxDisplacement = 150;
    const totalDistance = Math.sqrt(totalPushX * totalPushX + totalPushY * totalPushY);
    if (totalDistance > maxDisplacement) {
      totalPushX = (totalPushX / totalDistance) * maxDisplacement;
      totalPushY = (totalPushY / totalDistance) * maxDisplacement;
    }

    return { x: totalPushX, y: totalPushY };
  };

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

      {/* Pinned It File - frontmost */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[100vw] h-[95vh] transition-all duration-500 ease-in-out"
        style={{
          transform: `translateX(${expandedFile === "PinnedIt" ? 10 : 83}%) translateY(-50%)`,
          zIndex: expandedFile === "PinnedIt" ? 100 : 53,
        }}>
        <BaseFile
          fillColor="rgba(255, 255, 255, 1)"
          strokeColor="black"
          strokeWidth={3}
          meta="PinnedIt">
          <div
            className="text-black p-8 pl-[300px] mt-10"
            style={{ fontFamily: "'Josefin Slab', serif" }}>
            <h1 className="text-4xl mb-4">Pinned It</h1>
            <p className="text-lg mb-4">
              Your Pinned It project information here
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
