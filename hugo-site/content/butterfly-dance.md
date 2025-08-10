---
title: "Butterfly Dance"
date: 2024-01-01
draft: false
---

<div id="butterfly-animation" style="width: 100%; height: 500px; position: relative; overflow: hidden; border-radius: 12px;"></div>

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
  
  // Butterfly class
  class Butterfly {
    constructor(id, x, y, opacity) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.opacity = opacity;
      this.wingAngle = 0;
      this.size = 20;
      this.targetX = x;
      this.targetY = y;
      this.lastChangeTime = Date.now();
      this.isFlirting = false;
      this.flirtTarget = null;
    }
    
    drawButterfly(g) {
      const isDark = document.documentElement.classList.contains('dark');
      const color = isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))';
      
      // Set overall opacity
      g.style('opacity', this.opacity);
      
      // Body
      g.append('ellipse')
        .attr('class', 'body')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('rx', 1.5)
        .attr('ry', 6)
        .style('fill', color)
        .style('opacity', 0.8);
      
      // Left wings
      const leftWing = g.append('g')
        .attr('class', 'left-wings');
      
      // Upper left wing - simplified shape
      leftWing.append('path')
        .attr('class', 'wing upper-left')
        .attr('d', 'M 0,-3 Q -12,-10 -10,-18 Q -6,-20 0,-15 Z')
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 0.8)
        .style('opacity', 0.6);
      
      // Lower left wing
      leftWing.append('path')
        .attr('class', 'wing lower-left')
        .attr('d', 'M 0,3 Q -10,6 -12,12 Q -8,14 0,8 Z')
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 0.8)
        .style('opacity', 0.6);
      
      // Right wings
      const rightWing = g.append('g')
        .attr('class', 'right-wings');
      
      // Upper right wing
      rightWing.append('path')
        .attr('class', 'wing upper-right')
        .attr('d', 'M 0,-3 Q 12,-10 10,-18 Q 6,-20 0,-15 Z')
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 0.8)
        .style('opacity', 0.6);
      
      // Lower right wing
      rightWing.append('path')
        .attr('class', 'wing lower-right')
        .attr('d', 'M 0,3 Q 10,6 12,12 Q 8,14 0,8 Z')
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 0.8)
        .style('opacity', 0.6);
      
      // Antennae
      g.append('line')
        .attr('x1', -0.5)
        .attr('y1', -6)
        .attr('x2', -2)
        .attr('y2', -9)
        .style('stroke', color)
        .style('stroke-width', 0.4)
        .style('opacity', 0.6);
      
      g.append('line')
        .attr('x1', 0.5)
        .attr('y1', -6)
        .attr('x2', 2)
        .attr('y2', -9)
        .style('stroke', color)
        .style('stroke-width', 0.4)
        .style('opacity', 0.6);
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
  
  // Create butterflies with different opacities for subtle distinction
  const butterfly1 = new Butterfly(
    'butterfly1',
    width * 0.3,
    height * 0.5,
    0.7
  );
  
  const butterfly2 = new Butterfly(
    'butterfly2',
    width * 0.7,
    height * 0.5,
    0.5
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
  
  // Add minimal dots for spatial reference
  const dots = [
    {x: width * 0.2, y: height * 0.8},
    {x: width * 0.5, y: height * 0.85},
    {x: width * 0.8, y: height * 0.75}
  ];
  
  dots.forEach(pos => {
    svg.append('circle')
      .attr('cx', pos.x)
      .attr('cy', pos.y)
      .attr('r', 2)
      .style('fill', 'hsl(var(--muted-foreground))')
      .style('opacity', 0.2);
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
    
    // Add subtle connection line when flirting
    if (butterfly1.isFlirting && Math.random() < 0.02) {
      const connection = svg.append('line')
        .attr('x1', butterfly1.x)
        .attr('y1', butterfly1.y)
        .attr('x2', butterfly2.x)
        .attr('y2', butterfly2.y)
        .style('stroke', 'hsl(var(--accent))')
        .style('stroke-width', 0.5)
        .style('opacity', 0.3);
      
      connection.transition()
        .duration(1000)
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
