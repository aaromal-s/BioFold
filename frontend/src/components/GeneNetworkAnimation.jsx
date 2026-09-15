import React, { useEffect, useRef } from 'react';

const GeneNetworkAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let nodes = [];
    let animationFrameId;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };
    window.addEventListener('resize', resize);

    class Node {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        // Make some genes "hubs" (highly connected nodes)
        this.isHub = Math.random() > 0.92;
        this.baseRadius = this.isHub ? Math.random() * 3 + 3 : Math.random() * 1.5 + 1;
        this.radius = this.baseRadius;
        this.color = this.isHub ? 'rgba(168, 85, 247, 0.8)' : 'rgba(6, 182, 212, 0.6)'; // Purple for hubs, Cyan for others
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wobble to simulate floating in biological fluid
        this.x += Math.sin(Date.now() * 0.001 + this.pulsePhase) * 0.2;
        this.y += Math.cos(Date.now() * 0.001 + this.pulsePhase) * 0.2;

        // Screen wrap
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;

        // Pulsing radius for hubs
        if (this.isHub) {
            this.radius = this.baseRadius + Math.sin(Date.now() * 0.002 + this.pulsePhase) * 1.5;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.isHub ? 15 : 5;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      }
    }

    const initNodes = () => {
      nodes = [];
      const count = Math.floor((width * height) / 10000); // node density
      for (let i = 0; i < count; i++) {
        nodes.push(new Node());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
      }

      // Draw edges mimicking gene co-expression networks
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const connectDist = nodes[i].isHub || nodes[j].isHub ? 180 : 110;

          if (dist < connectDist) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            
            const opacity = 1 - (dist / connectDist);
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            
            // Subtle colors based on hub status
            if (nodes[i].isHub || nodes[j].isHub) {
                gradient.addColorStop(0, `rgba(168, 85, 247, ${opacity * 0.6})`);
                gradient.addColorStop(1, `rgba(6, 182, 212, ${opacity * 0.6})`);
            } else {
                gradient.addColorStop(0, `rgba(6, 182, 212, ${opacity * 0.4})`);
                gradient.addColorStop(1, `rgba(6, 182, 212, ${opacity * 0.4})`);
            }

            ctx.strokeStyle = gradient;
            ctx.lineWidth = nodes[i].isHub || nodes[j].isHub ? 1 : 0.5;
            ctx.stroke();
          }
        }
        nodes[i].draw(); // Draw nodes on top of lines
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    initNodes();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
      style={{ opacity: 0.85 }}
    />
  );
};

export default GeneNetworkAnimation;
