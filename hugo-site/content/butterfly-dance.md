---
title: "Butterfly Dance"
date: 2024-01-01
draft: false
---

<div id="butterfly-animation" style="width: 100%; height: 500px; position: relative; overflow: hidden; background: linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 50%, #E0F6FF 100%); border-radius: 12px;"></div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script>
(function() {
  const container = document.getElementById('butterfly-animation');
  if (!container) return;
  
  const width = container.offsetWidth;
  const height = 500;
  
  const svg = d3.select('#butterfly-animation')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('position', 'absolute')
    .style('top', 0)
    .style('left', 0);
  
  // Create gradient for butterfly wings
  const defs = svg.append('defs');
  
  // Butterfly 1 gradient (pink/purple)
  const gradient1 = defs.append('radialGradient')
    .attr('id', 'butterfly1-gradient');
  gradient1.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#FF69B4')
    .attr('stop-opacity', 0.8);
  gradient1.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#9370DB')
    .attr('stop-opacity', 0.6);
  
  // Butterfly 2 gradient (blue/turquoise)
  const gradient2 = defs.append('radialGradient')
    .attr('id', 'butterfly2-gradient');
  gradient2.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#00CED1')
    .attr('stop-opacity', 0.8);
  gradient2.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#4169E1')
    .attr('stop-opacity', 0.6);
  
  // Butterfly class
  class Butterfly {
    constructor(id, x, y, color, gradientId) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.color = color;
      this.gradientId = gradientId;
      this.wingAngle = 0;
      this.size = 20;
      this.targetX = x;
      this.targetY = y;
      this.lastChangeTime = Date.now();
      this.isFlirting = false;
      this.flirtTarget = null;
    }
    
    drawButterfly(g) {
      // Body
      g.append('ellipse')
        .attr('class', 'body')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('rx', 2)
        .attr('ry', 8)
        .style('fill', '#333');
      
      // Left wings
      const leftWing = g.append('g')
        .attr('class', 'left-wings');
      
      // Upper left wing
      leftWing.append('path')
        .attr('class', 'wing upper-left')
        .attr('d', 'M 0,-5 Q -15,-15 -12,-25 Q -8,-28 0,-20 Z')
        .style('fill', `url(#${this.gradientId})`)
        .style('stroke', this.color)
        .style('stroke-width', 0.5);
      
      // Lower left wing
      leftWing.append('path')
        .attr('class', 'wing lower-left')
        .attr('d', 'M 0,5 Q -12,8 -15,15 Q -10,18 0,10 Z')
        .style('fill', `url(#${this.gradientId})`)
        .style('stroke', this.color)
        .style('stroke-width', 0.5);
      
      // Right wings
      const rightWing = g.append('g')
        .attr('class', 'right-wings');
      
      // Upper right wing
      rightWing.append('path')
        .attr('class', 'wing upper-right')
        .attr('d', 'M 0,-5 Q 15,-15 12,-25 Q 8,-28 0,-20 Z')
        .style('fill', `url(#${this.gradientId})`)
        .style('stroke', this.color)
        .style('stroke-width', 0.5);
      
      // Lower right wing
      rightWing.append('path')
        .attr('class', 'wing lower-right')
        .attr('d', 'M 0,5 Q 12,8 15,15 Q 10,18 0,10 Z')
        .style('fill', `url(#${this.gradientId})`)
        .style('stroke', this.color)
        .style('stroke-width', 0.5);
      
      // Antennae
      g.append('line')
        .attr('x1', -1)
        .attr('y1', -8)
        .attr('x2', -3)
        .attr('y2', -12)
        .style('stroke', '#333')
        .style('stroke-width', 0.5);
      
      g.append('line')
        .attr('x1', 1)
        .attr('y1', -8)
        .attr('x2', 3)
        .attr('y2', -12)
        .style('stroke', '#333')
        .style('stroke-width', 0.5);
    }
    
    update(other) {
      const now = Date.now();
      const timeSinceChange = now - this.lastChangeTime;
      
      // Distance to other butterfly
      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Flirting behavior when close
      if (distance < 100) {
        if (!this.isFlirting) {
          this.isFlirting = true;
          this.flirtTarget = other;
        }
        
        // Circle around each other
        const angle = Math.atan2(dy, dx);
        const perpAngle = angle + Math.PI / 2;
        this.targetX = other.x + Math.cos(perpAngle) * 50;
        this.targetY = other.y + Math.sin(perpAngle) * 50;
        
        // Occasional close approach
        if (Math.random() < 0.01) {
          this.targetX = other.x + (Math.random() - 0.5) * 30;
          this.targetY = other.y + (Math.random() - 0.5) * 30;
        }
      } else {
        this.isFlirting = false;
        
        // Random wandering with occasional attraction
        if (timeSinceChange > 2000 + Math.random() * 2000) {
          if (Math.random() < 0.3) {
            // Move towards other butterfly sometimes
            this.targetX = other.x + (Math.random() - 0.5) * 200;
            this.targetY = other.y + (Math.random() - 0.5) * 200;
          } else {
            // Random target
            this.targetX = Math.random() * width;
            this.targetY = Math.random() * height;
          }
          this.lastChangeTime = now;
        }
      }
      
      // Smooth movement towards target
      const targetDx = this.targetX - this.x;
      const targetDy = this.targetY - this.y;
      const targetDist = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
      
      if (targetDist > 1) {
        const speed = this.isFlirting ? 0.03 : 0.02;
        this.vx += (targetDx / targetDist) * speed;
        this.vy += (targetDy / targetDist) * speed;
      }
      
      // Apply some damping
      this.vx *= 0.98;
      this.vy *= 0.98;
      
      // Update position
      this.x += this.vx;
      this.y += this.vy;
      
      // Keep within bounds with soft boundaries
      const margin = 50;
      if (this.x < margin) {
        this.vx += 0.5;
        this.targetX = width / 2;
      }
      if (this.x > width - margin) {
        this.vx -= 0.5;
        this.targetX = width / 2;
      }
      if (this.y < margin) {
        this.vy += 0.5;
        this.targetY = height / 2;
      }
      if (this.y > height - margin) {
        this.vy -= 0.5;
        this.targetY = height / 2;
      }
      
      // Wing flapping
      this.wingAngle = Math.sin(now * 0.01) * 20;
    }
  }
  
  // Create butterflies
  const butterfly1 = new Butterfly(
    'butterfly1',
    width * 0.3,
    height * 0.5,
    '#FF69B4',
    'butterfly1-gradient'
  );
  
  const butterfly2 = new Butterfly(
    'butterfly2',
    width * 0.7,
    height * 0.5,
    '#00CED1',
    'butterfly2-gradient'
  );
  
  // Create butterfly groups
  const b1Group = svg.append('g')
    .attr('class', 'butterfly-1')
    .attr('transform', `translate(${butterfly1.x},${butterfly1.y})`);
  butterfly1.drawButterfly(b1Group);
  
  const b2Group = svg.append('g')
    .attr('class', 'butterfly-2')
    .attr('transform', `translate(${butterfly2.x},${butterfly2.y})`);
  butterfly2.drawButterfly(b2Group);
  
  // Add some flowers for decoration
  const flowerPositions = [
    {x: width * 0.2, y: height * 0.8},
    {x: width * 0.5, y: height * 0.85},
    {x: width * 0.8, y: height * 0.75}
  ];
  
  flowerPositions.forEach(pos => {
    const flower = svg.append('g')
      .attr('transform', `translate(${pos.x},${pos.y})`);
    
    // Petals
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72) * Math.PI / 180;
      flower.append('ellipse')
        .attr('cx', Math.cos(angle) * 8)
        .attr('cy', Math.sin(angle) * 8)
        .attr('rx', 6)
        .attr('ry', 10)
        .attr('transform', `rotate(${i * 72})`)
        .style('fill', '#FFB6C1')
        .style('opacity', 0.7);
    }
    
    // Center
    flower.append('circle')
      .attr('r', 5)
      .style('fill', '#FFD700');
  });
  
  // Animation loop
  function animate() {
    butterfly1.update(butterfly2);
    butterfly2.update(butterfly1);
    
    // Update butterfly positions and rotations
    b1Group
      .attr('transform', `translate(${butterfly1.x},${butterfly1.y}) rotate(${Math.atan2(butterfly1.vy, butterfly1.vx) * 180 / Math.PI})`);
    
    b2Group
      .attr('transform', `translate(${butterfly2.x},${butterfly2.y}) rotate(${Math.atan2(butterfly2.vy, butterfly2.vx) * 180 / Math.PI})`);
    
    // Wing flapping animation
    b1Group.selectAll('.left-wings')
      .attr('transform', `rotate(${-butterfly1.wingAngle})`);
    b1Group.selectAll('.right-wings')
      .attr('transform', `rotate(${butterfly1.wingAngle})`);
    
    b2Group.selectAll('.left-wings')
      .attr('transform', `rotate(${-butterfly2.wingAngle})`);
    b2Group.selectAll('.right-wings')
      .attr('transform', `rotate(${butterfly2.wingAngle})`);
    
    // Add hearts when flirting
    if (butterfly1.isFlirting && Math.random() < 0.02) {
      const heart = svg.append('text')
        .attr('x', (butterfly1.x + butterfly2.x) / 2)
        .attr('y', (butterfly1.y + butterfly2.y) / 2)
        .text('💕')
        .style('font-size', '20px')
        .style('opacity', 1);
      
      heart.transition()
        .duration(2000)
        .attr('y', (butterfly1.y + butterfly2.y) / 2 - 50)
        .style('opacity', 0)
        .remove();
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Handle resize
  window.addEventListener('resize', function() {
    const newWidth = container.offsetWidth;
    svg.attr('width', newWidth);
  });
})();
</script>
