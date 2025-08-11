// Wait for D3 to be loaded
function initButterflies() {
  if (typeof d3 === 'undefined') {
    setTimeout(initButterflies, 100);
    return;
  }
  
  const container = document.getElementById('butterfly-animation');
  if (!container) {
    setTimeout(initButterflies, 100);
    return;
  }
  
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
      
      // Body (smaller, more proportional)
      g.append('ellipse')
        .attr('class', 'body')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('rx', 1)
        .attr('ry', 4)
        .style('fill', color)
        .style('opacity', 0.7);
      
      // Left wings
      const leftWing = g.append('g')
        .attr('class', 'left-wings');
      
      // Upper left wing - more butterfly-like shape
      leftWing.append('path')
        .attr('class', 'wing upper-left')
        .attr('d', 'M 0,-2 C -8,-8 -15,-10 -18,-8 C -20,-6 -18,-2 -15,0 C -12,1 -8,0 -5,-1 Q -2,-2 0,-2 Z')
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 0.6)
        .style('opacity', 0.5);
      
      // Lower left wing - smaller, rounded
      leftWing.append('path')
        .attr('class', 'wing lower-left')
        .attr('d', 'M 0,2 C -5,3 -8,6 -10,8 C -11,10 -10,12 -8,11 C -6,10 -3,6 -2,4 Q -1,2 0,2 Z')
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 0.6)
        .style('opacity', 0.5);
      
      // Add wing details - veins
      leftWing.append('line')
        .attr('x1', -2)
        .attr('y1', -1)
        .attr('x2', -12)
        .attr('y2', -5)
        .style('stroke', color)
        .style('stroke-width', 0.3)
        .style('opacity', 0.3);
      
      leftWing.append('line')
        .attr('x1', -2)
        .attr('y1', 1)
        .attr('x2', -8)
        .attr('y2', 6)
        .style('stroke', color)
        .style('stroke-width', 0.3)
        .style('opacity', 0.3);
      
      // Right wings (mirror of left)
      const rightWing = g.append('g')
        .attr('class', 'right-wings');
      
      // Upper right wing
      rightWing.append('path')
        .attr('class', 'wing upper-right')
        .attr('d', 'M 0,-2 C 8,-8 15,-10 18,-8 C 20,-6 18,-2 15,0 C 12,1 8,0 5,-1 Q 2,-2 0,-2 Z')
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 0.6)
        .style('opacity', 0.5);
      
      // Lower right wing
      rightWing.append('path')
        .attr('class', 'wing lower-right')
        .attr('d', 'M 0,2 C 5,3 8,6 10,8 C 11,10 10,12 8,11 C 6,10 3,6 2,4 Q 1,2 0,2 Z')
        .style('fill', 'none')
        .style('stroke', color)
        .style('stroke-width', 0.6)
        .style('opacity', 0.5);
      
      // Wing veins
      rightWing.append('line')
        .attr('x1', 2)
        .attr('y1', -1)
        .attr('x2', 12)
        .attr('y2', -5)
        .style('stroke', color)
        .style('stroke-width', 0.3)
        .style('opacity', 0.3);
      
      rightWing.append('line')
        .attr('x1', 2)
        .attr('y1', 1)
        .attr('x2', 8)
        .attr('y2', 6)
        .style('stroke', color)
        .style('stroke-width', 0.3)
        .style('opacity', 0.3);
      
      // Antennae with club tips
      g.append('path')
        .attr('d', 'M -0.5,-4 Q -1,-6 -2,-7')
        .style('stroke', color)
        .style('stroke-width', 0.3)
        .style('fill', 'none')
        .style('opacity', 0.6);
      
      g.append('circle')
        .attr('cx', -2)
        .attr('cy', -7)
        .attr('r', 0.5)
        .style('fill', color)
        .style('opacity', 0.6);
      
      g.append('path')
        .attr('d', 'M 0.5,-4 Q 1,-6 2,-7')
        .style('stroke', color)
        .style('stroke-width', 0.3)
        .style('fill', 'none')
        .style('opacity', 0.6);
      
      g.append('circle')
        .attr('cx', 2)
        .attr('cy', -7)
        .attr('r', 0.5)
        .style('fill', color)
        .style('opacity', 0.6);
    }
    
    update(other) {
      const now = Date.now();
      const timeSinceChange = now - this.lastChangeTime;
      
      // Distance to other butterfly
      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Flirting behavior when close - much more intimate
      if (distance < 150) {
        if (!this.isFlirting) {
          this.isFlirting = true;
          this.flirtTarget = other;
          this.circleAngle = Math.random() * Math.PI * 2;
        }
        
        // Tight circling around each other
        this.circleAngle += 0.05; // Faster rotation
        const circleRadius = 20 + Math.sin(now * 0.001) * 10; // Varying circle size
        const centerX = (this.x + other.x) / 2;
        const centerY = (this.y + other.y) / 2;
        
        this.targetX = centerX + Math.cos(this.circleAngle) * circleRadius;
        this.targetY = centerY + Math.sin(this.circleAngle) * circleRadius;
        
        // Very close approaches - almost touching
        if (Math.random() < 0.02) {
          this.targetX = other.x + (Math.random() - 0.5) * 10;
          this.targetY = other.y + (Math.random() - 0.5) * 10;
        }
      } else {
        this.isFlirting = false;
        
        // More frequent attraction to each other
        if (timeSinceChange > 1500 + Math.random() * 1500) {
          if (Math.random() < 0.6) { // Much higher chance to seek each other
            // Move towards other butterfly
            this.targetX = other.x + (Math.random() - 0.5) * 100;
            this.targetY = other.y + (Math.random() - 0.5) * 100;
          } else {
            // Random target but not too far
            this.targetX = this.x + (Math.random() - 0.5) * 200;
            this.targetY = this.y + (Math.random() - 0.5) * 200;
          }
          this.lastChangeTime = now;
        }
      }
      
      // Smooth movement towards target
      const targetDx = this.targetX - this.x;
      const targetDy = this.targetY - this.y;
      const targetDist = Math.sqrt(targetDx * targetDx + targetDy * targetDy);
      
      if (targetDist > 1) {
        const speed = this.isFlirting ? 0.05 : 0.03; // Faster movement
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
      
      // More active wing flapping
      this.wingAngle = Math.sin(now * 0.015) * 35;
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
    
    // Add more frequent connection lines when flirting
    if (butterfly1.isFlirting && Math.random() < 0.05) {
      const connection = svg.append('line')
        .attr('x1', butterfly1.x)
        .attr('y1', butterfly1.y)
        .attr('x2', butterfly2.x)
        .attr('y2', butterfly2.y)
        .style('stroke', 'hsl(var(--accent))')
        .style('stroke-width', 0.5)
        .style('opacity', 0.4);
      
      connection.transition()
        .duration(800)
        .style('opacity', 0)
        .remove();
    }
    
    // Add small circles when they're very close
    const dist = Math.sqrt(Math.pow(butterfly1.x - butterfly2.x, 2) + Math.pow(butterfly1.y - butterfly2.y, 2));
    if (dist < 30 && Math.random() < 0.1) {
      const spark = svg.append('circle')
        .attr('cx', (butterfly1.x + butterfly2.x) / 2)
        .attr('cy', (butterfly1.y + butterfly2.y) / 2)
        .attr('r', 2)
        .style('fill', 'hsl(var(--accent))')
        .style('opacity', 0.6);
      
      spark.transition()
        .duration(500)
        .attr('r', 8)
        .style('opacity', 0)
        .remove();
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // Handle resize - only if width actually changes
  let lastWidth = width;
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const newWidth = container.offsetWidth;
      // Only update if width actually changed (not just height from mobile scroll)
      if (Math.abs(newWidth - lastWidth) > 10) {
        lastWidth = newWidth;
        svg.attr('width', newWidth);
      }
    }, 500); // Debounce to avoid mobile scroll issues
  });
}

// Start the animation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initButterflies);
} else {
  initButterflies();
}
