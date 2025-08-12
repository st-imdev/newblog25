// Minimal chart animation for blog posts
function initMinimalChart() {
  const container = document.getElementById('minimal-chart');
  if (!container) return;
  
  const width = container.offsetWidth;
  const height = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Data representing growth/progress
  const data = [
    { month: 'Jan', value: 20, label: 'Foundation' },
    { month: 'Feb', value: 35, label: 'Building' },
    { month: 'Mar', value: 45, label: 'Testing' },
    { month: 'Apr', value: 60, label: 'Learning' },
    { month: 'May', value: 72, label: 'Iterating' },
    { month: 'Jun', value: 85, label: 'Growing' },
    { month: 'Jul', value: 95, label: 'Scaling' }
  ];
  
  const svg = d3.select('#minimal-chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('opacity', 0);
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Scales
  const xScale = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, innerWidth])
    .padding(0.3);
  
  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0]);
  
  // Line generator for smooth curve
  const line = d3.line()
    .x(d => xScale(d.month) + xScale.bandwidth() / 2)
    .y(d => yScale(d.value))
    .curve(d3.curveCardinal.tension(0.5));
  
  // Area generator for gradient fill
  const area = d3.area()
    .x(d => xScale(d.month) + xScale.bandwidth() / 2)
    .y0(innerHeight)
    .y1(d => yScale(d.value))
    .curve(d3.curveCardinal.tension(0.5));
  
  // Create gradient
  const gradient = svg.append('defs')
    .append('linearGradient')
    .attr('id', 'chart-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');
  
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', 'hsl(var(--accent))')
    .attr('stop-opacity', 0.3);
  
  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', 'hsl(var(--accent))')
    .attr('stop-opacity', 0);
  
  // Add area with gradient
  const areaPath = g.append('path')
    .datum(data)
    .attr('fill', 'url(#chart-gradient)')
    .attr('d', area)
    .style('opacity', 0);
  
  // Add line
  const linePath = g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', 'hsl(var(--accent))')
    .attr('stroke-width', 2)
    .attr('d', line)
    .style('opacity', 0);
  
  // Add dots
  const dots = g.selectAll('.dot')
    .data(data)
    .enter().append('g')
    .attr('class', 'dot-group')
    .attr('transform', d => `translate(${xScale(d.month) + xScale.bandwidth() / 2},${yScale(d.value)})`);
  
  dots.append('circle')
    .attr('class', 'dot')
    .attr('r', 0)
    .style('fill', 'hsl(var(--background))')
    .style('stroke', 'hsl(var(--accent))')
    .style('stroke-width', 2);
  
  // Add subtle grid lines
  g.selectAll('.grid-line')
    .data([25, 50, 75])
    .enter().append('line')
    .attr('class', 'grid-line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .style('stroke', 'hsl(var(--border))')
    .style('stroke-width', 0.5)
    .style('opacity', 0.3)
    .style('stroke-dasharray', '2,4');
  
  // X axis
  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).tickSize(0))
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .style('opacity', 0.6);
  
  // Remove axis line
  g.select('.domain').remove();
  
  // Style axis text
  g.selectAll('text')
    .style('fill', 'hsl(var(--muted-foreground))')
    .style('font-size', '12px');
  
  // Animate in
  svg.transition()
    .duration(500)
    .style('opacity', 1);
  
  // Animate area
  areaPath.transition()
    .duration(1500)
    .ease(d3.easeCubicOut)
    .style('opacity', 1);
  
  // Animate line with drawing effect
  const totalLength = linePath.node().getTotalLength();
  linePath
    .attr('stroke-dasharray', totalLength + ' ' + totalLength)
    .attr('stroke-dashoffset', totalLength)
    .transition()
    .duration(2000)
    .ease(d3.easeCubicOut)
    .attr('stroke-dashoffset', 0)
    .style('opacity', 1);
  
  // Animate dots
  dots.selectAll('.dot')
    .transition()
    .duration(2000)
    .delay((d, i) => i * 200)
    .ease(d3.easeElastic)
    .attr('r', 4);
  
  // Interactive hover effects
  dots.on('mouseenter', function(event, d) {
    const dot = d3.select(this);
    
    // Enlarge dot
    dot.select('.dot')
      .transition()
      .duration(200)
      .attr('r', 6);
    
    // Show tooltip
    const tooltip = g.append('g')
      .attr('class', 'tooltip')
      .attr('transform', `translate(${xScale(d.month) + xScale.bandwidth() / 2},${yScale(d.value)})`);
    
    const rect = tooltip.append('rect')
      .attr('x', -30)
      .attr('y', -35)
      .attr('width', 60)
      .attr('height', 25)
      .attr('rx', 4)
      .style('fill', 'hsl(var(--background))')
      .style('stroke', 'hsl(var(--border))')
      .style('stroke-width', 1);
    
    tooltip.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -20)
      .style('fill', 'hsl(var(--foreground))')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .text(d.label);
    
    tooltip.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -8)
      .style('fill', 'hsl(var(--muted-foreground))')
      .style('font-size', '10px')
      .text(`${d.value}%`);
    
    tooltip.style('opacity', 0)
      .transition()
      .duration(200)
      .style('opacity', 1);
  });
  
  dots.on('mouseleave', function(event, d) {
    const dot = d3.select(this);
    
    // Restore dot size
    dot.select('.dot')
      .transition()
      .duration(200)
      .attr('r', 4);
    
    // Remove tooltip
    g.selectAll('.tooltip')
      .transition()
      .duration(200)
      .style('opacity', 0)
      .remove();
  });
  
  // Subtle animation loop for line
  function pulse() {
    linePath
      .transition()
      .duration(3000)
      .ease(d3.easeSinInOut)
      .style('stroke-width', 2.5)
      .transition()
      .duration(3000)
      .ease(d3.easeSinInOut)
      .style('stroke-width', 2)
      .on('end', pulse);
  }
  
  setTimeout(pulse, 2000);
  
  // Handle resize
  let resizeTimer;
  let lastWidth = width;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const newWidth = container.offsetWidth;
      if (Math.abs(newWidth - lastWidth) > 10) {
        // Redraw chart
        svg.remove();
        initMinimalChart();
      }
    }, 500);
  });
}

// Initialize when ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMinimalChart);
} else {
  initMinimalChart();
}
