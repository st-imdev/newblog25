(function() {
  // Only run on homepage
  if (!document.getElementById('network-animation')) return;

  const container = document.getElementById('network-animation');
  const width = container.offsetWidth;
  const height = 200;

  // Create SVG
  const svg = d3.select('#network-animation')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('opacity', 0);

  // Generate random node positions with good spacing
  function generateNodePositions(count) {
    const positions = [];
    const margin = 40; // Keep nodes away from edges
    const minDistance = 60; // Minimum distance between nodes
    
    for (let i = 0; i < count; i++) {
      let validPosition = false;
      let attempts = 0;
      let x, y;
      
      while (!validPosition && attempts < 100) {
        x = margin + Math.random() * (width - 2 * margin);
        y = margin + Math.random() * (height - 2 * margin);
        
        validPosition = true;
        // Check distance from other nodes
        for (let j = 0; j < positions.length; j++) {
          const dist = Math.sqrt(
            Math.pow(x - positions[j].x, 2) + 
            Math.pow(y - positions[j].y, 2)
          );
          if (dist < minDistance) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }
      
      positions.push({
        id: i + 1,
        x: x || margin + Math.random() * (width - 2 * margin),
        y: y || margin + Math.random() * (height - 2 * margin),
        knowledge: 0
      });
    }
    return positions;
  }

  // Nodes data - representing AI agents
  const nodes = generateNodePositions(5);

  // Generate random connections ensuring all nodes are connected
  function generateLinks(nodeCount) {
    const links = [];
    const connected = new Set([0]);
    const unconnected = new Set();
    
    // Initialize unconnected nodes
    for (let i = 1; i < nodeCount; i++) {
      unconnected.add(i);
    }
    
    // Connect all nodes to ensure no isolated nodes
    while (unconnected.size > 0) {
      const from = Array.from(connected)[Math.floor(Math.random() * connected.size)];
      const to = Array.from(unconnected)[Math.floor(Math.random() * unconnected.size)];
      links.push({ source: from, target: to });
      connected.add(to);
      unconnected.delete(to);
    }
    
    // Add some extra random connections for mesh effect
    const extraConnections = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < extraConnections; i++) {
      const source = Math.floor(Math.random() * nodeCount);
      const target = Math.floor(Math.random() * nodeCount);
      if (source !== target) {
        // Check if link already exists
        const exists = links.some(l => 
          (l.source === source && l.target === target) ||
          (l.source === target && l.target === source)
        );
        if (!exists) {
          links.push({ source, target });
        }
      }
    }
    
    return links;
  }

  // Links data - connections between nodes
  const links = generateLinks(nodes.length);

  // Create links
  const isDarkMode = document.documentElement.classList.contains('dark');
  const link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link')
    .attr('x1', d => nodes[d.source].x)
    .attr('y1', d => nodes[d.source].y)
    .attr('x2', d => nodes[d.target].x)
    .attr('y2', d => nodes[d.target].y)
    .style('stroke', 'hsl(var(--muted-foreground))')
    .style('stroke-width', 1)
    .style('opacity', isDarkMode ? 0.4 : 0.2);

  // Create node groups
  const node = svg.selectAll('.node')
    .data(nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x},${d.y})`);

  // Add circles for nodes
  node.append('circle')
    .attr('r', 8)
    .style('fill', 'hsl(var(--background))')
    .style('stroke', 'hsl(var(--muted-foreground))')
    .style('stroke-width', 1.5)
    .style('opacity', 0.9);

  // Add inner circles for knowledge state
  const isDarkMode = document.documentElement.classList.contains('dark');
  const innerCircles = node.append('circle')
    .attr('class', 'knowledge')
    .attr('r', 0)
    .style('fill', isDarkMode ? 'hsl(var(--accent-foreground))' : 'hsl(var(--accent))')
    .style('opacity', 1)
    .style('filter', isDarkMode ? 'brightness(2)' : 'brightness(1)');

  // Fade in animation
  svg.transition()
    .duration(1000)
    .style('opacity', 1);

  // Knowledge transfer animation
  function transferKnowledge() {
    // Select random source and target
    const sourceIdx = Math.floor(Math.random() * nodes.length);
    const targetIdx = Math.floor(Math.random() * nodes.length);
    
    if (sourceIdx === targetIdx) return;

    const source = nodes[sourceIdx];
    const target = nodes[targetIdx];

    // Create a particle for knowledge transfer
    const isDark = document.documentElement.classList.contains('dark');
    const particle = svg.append('circle')
      .attr('r', 4)
      .attr('cx', source.x)
      .attr('cy', source.y)
      .style('fill', isDark ? 'hsl(var(--accent-foreground))' : 'hsl(var(--accent))')
      .style('opacity', 1)
      .style('filter', isDark ? 'brightness(2)' : 'brightness(1)');

    // Animate particle moving from source to target
    particle.transition()
      .duration(1500)
      .ease(d3.easeCubicInOut)
      .attr('cx', target.x)
      .attr('cy', target.y)
      .on('end', function() {
        // Remove particle
        particle.remove();
        
        // Increase target's knowledge
        target.knowledge = Math.min(target.knowledge + 0.2, 1);
        
        // Update target node's inner circle
        d3.select(innerCircles.nodes()[targetIdx])
          .transition()
          .duration(300)
          .attr('r', 4 + target.knowledge * 4);
      });

    // Pulse source node
    d3.select(node.nodes()[sourceIdx]).select('circle:first-child')
      .transition()
      .duration(300)
      .attr('r', 10)
      .transition()
      .duration(300)
      .attr('r', 8);
  }

  // Start knowledge transfer animations
  setInterval(transferKnowledge, 2000);
  
  // Initial transfer
  setTimeout(transferKnowledge, 500);

  // Update colors when theme changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        const isDark = document.documentElement.classList.contains('dark');
        // Update link opacity
        svg.selectAll('.link')
          .style('opacity', isDark ? 0.4 : 0.2);
        // Update knowledge circle colors
        svg.selectAll('.knowledge')
          .style('fill', isDark ? 'hsl(var(--accent-foreground))' : 'hsl(var(--accent))')
          .style('filter', isDark ? 'brightness(2)' : 'brightness(1)');
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const newWidth = container.offsetWidth;
      svg.attr('width', newWidth);
      
      // Update node positions
      nodes.forEach((node, i) => {
        node.x = newWidth * (0.2 + i * 0.15);
      });
      
      // Update visual positions
      svg.selectAll('.node')
        .data(nodes)
        .attr('transform', d => `translate(${d.x},${d.y})`);
      
      svg.selectAll('.link')
        .attr('x1', d => nodes[d.source].x)
        .attr('y1', d => nodes[d.source].y)
        .attr('x2', d => nodes[d.target].x)
        .attr('y2', d => nodes[d.target].y);
    }, 250);
  });
})();
