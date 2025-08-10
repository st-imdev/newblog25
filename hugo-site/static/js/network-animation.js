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

  // Nodes data - representing AI agents
  const nodes = [
    { id: 1, x: width * 0.2, y: height * 0.5, knowledge: 0 },
    { id: 2, x: width * 0.4, y: height * 0.3, knowledge: 0 },
    { id: 3, x: width * 0.6, y: height * 0.7, knowledge: 0 },
    { id: 4, x: width * 0.8, y: height * 0.4, knowledge: 0 },
    { id: 5, x: width * 0.5, y: height * 0.5, knowledge: 0 }
  ];

  // Links data - connections between nodes
  const links = [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 0 },
    { source: 1, target: 4 },
    { source: 2, target: 4 }
  ];

  // Create links
  const link = svg.selectAll('.link')
    .data(links)
    .enter().append('line')
    .attr('class', 'link')
    .attr('x1', d => nodes[d.source].x)
    .attr('y1', d => nodes[d.source].y)
    .attr('x2', d => nodes[d.target].x)
    .attr('y2', d => nodes[d.target].y)
    .style('stroke', 'hsl(var(--border))')
    .style('stroke-width', 1)
    .style('opacity', 0.3);

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
    .style('stroke', 'hsl(var(--foreground))')
    .style('stroke-width', 1.5)
    .style('opacity', 0.8);

  // Add inner circles for knowledge state
  const innerCircles = node.append('circle')
    .attr('class', 'knowledge')
    .attr('r', 0)
    .style('fill', 'hsl(var(--accent))')
    .style('opacity', 0.8);

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
    const particle = svg.append('circle')
      .attr('r', 3)
      .attr('cx', source.x)
      .attr('cy', source.y)
      .style('fill', 'hsl(var(--accent))')
      .style('opacity', 0.6);

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
