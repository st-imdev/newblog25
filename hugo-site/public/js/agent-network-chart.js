// Agent Network Performance Chart
function initAgentNetworkChart() {
  const container = document.getElementById('agent-network-chart');
  if (!container) return;
  
  const width = container.offsetWidth;
  const height = 400;
  const margin = { top: 40, right: 80, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Generate data for multiple agents
  const generateAgentData = (name, baseline, variance) => {
    const points = 24; // 24 hours
    return Array.from({ length: points }, (_, i) => ({
      hour: i,
      value: baseline + Math.sin(i * 0.5) * variance + Math.random() * 10,
      agent: name
    }));
  };
  
  const agents = [
    { name: 'Agent Alpha', color: 'hsl(var(--accent))', data: generateAgentData('Agent Alpha', 50, 20) },
    { name: 'Agent Beta', color: 'hsl(var(--muted-foreground))', data: generateAgentData('Agent Beta', 45, 15) },
    { name: 'Agent Gamma', color: 'hsl(var(--foreground))', data: generateAgentData('Agent Gamma', 40, 25) }
  ];
  
  const svg = d3.select('#agent-network-chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('opacity', 0);
  
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Scales
  const xScale = d3.scaleLinear()
    .domain([0, 23])
    .range([0, innerWidth]);
  
  const yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0]);
  
  // Line generator
  const line = d3.line()
    .x(d => xScale(d.hour))
    .y(d => yScale(d.value))
    .curve(d3.curveMonotoneX);
  
  // Add grid
  const yGrid = g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(yScale)
      .tickSize(-innerWidth)
      .tickFormat('')
      .ticks(5)
    );
  
  yGrid.selectAll('line')
    .style('stroke', 'hsl(var(--border))')
    .style('stroke-opacity', 0.2)
    .style('stroke-dasharray', '2,4');
  
  yGrid.select('.domain').remove();
  
  // Add axes
  const xAxis = g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale)
      .tickFormat(d => `${d}:00`)
      .ticks(12)
    );
  
  const yAxis = g.append('g')
    .call(d3.axisLeft(yScale)
      .tickFormat(d => `${d}%`)
      .ticks(5)
    );
  
  // Style axes
  [xAxis, yAxis].forEach(axis => {
    axis.select('.domain')
      .style('stroke', 'hsl(var(--border))')
      .style('stroke-opacity', 0.3);
    
    axis.selectAll('line')
      .style('stroke', 'hsl(var(--border))')
      .style('stroke-opacity', 0.3);
    
    axis.selectAll('text')
      .style('fill', 'hsl(var(--muted-foreground))')
      .style('font-size', '11px');
  });
  
  // Add axis labels
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (innerHeight / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .style('fill', 'hsl(var(--muted-foreground))')
    .style('font-size', '12px')
    .text('Performance (%)');
  
  g.append('text')
    .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom})`)
    .style('text-anchor', 'middle')
    .style('fill', 'hsl(var(--muted-foreground))')
    .style('font-size', '12px')
    .text('Time (Hours)');
  
  // Add lines for each agent
  const agentGroups = g.selectAll('.agent-group')
    .data(agents)
    .enter().append('g')
    .attr('class', 'agent-group');
  
  agentGroups.each(function(agent) {
    const group = d3.select(this);
    
    // Add line
    const path = group.append('path')
      .datum(agent.data)
      .attr('fill', 'none')
      .attr('stroke', agent.color)
      .attr('stroke-width', 2)
      .attr('d', line)
      .style('opacity', 0.8);
    
    // Animate line drawing
    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);
    
    // Add hover area
    group.append('path')
      .datum(agent.data)
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      .attr('stroke-width', 20)
      .attr('d', line)
      .style('cursor', 'pointer')
      .on('mouseenter', function() {
        // Highlight this line
        path.transition().duration(200)
          .style('stroke-width', 3)
          .style('opacity', 1);
        
        // Dim others
        g.selectAll('.agent-group').each(function(otherAgent) {
          if (otherAgent !== agent) {
            d3.select(this).select('path')
              .transition().duration(200)
              .style('opacity', 0.2);
          }
        });
        
        // Show agent name
        const lastPoint = agent.data[agent.data.length - 1];
        g.append('text')
          .attr('class', 'agent-label')
          .attr('x', xScale(lastPoint.hour) + 10)
          .attr('y', yScale(lastPoint.value))
          .attr('dy', '0.35em')
          .style('fill', agent.color)
          .style('font-size', '12px')
          .style('font-weight', '500')
          .text(agent.name)
          .style('opacity', 0)
          .transition().duration(200)
          .style('opacity', 1);
      })
      .on('mouseleave', function() {
        // Restore all lines
        g.selectAll('.agent-group path')
          .transition().duration(200)
          .style('stroke-width', 2)
          .style('opacity', 0.8);
        
        // Remove label
        g.selectAll('.agent-label')
          .transition().duration(200)
          .style('opacity', 0)
          .remove();
      });
  });
  
  // Add legend
  const legend = svg.append('g')
    .attr('transform', `translate(${width - margin.right - 100}, ${margin.top})`);
  
  agents.forEach((agent, i) => {
    const legendItem = legend.append('g')
      .attr('transform', `translate(0, ${i * 20})`)
      .style('cursor', 'pointer')
      .on('click', function() {
        const isActive = d3.select(this).classed('inactive');
        d3.select(this).classed('inactive', !isActive);
        
        // Toggle line visibility
        g.selectAll('.agent-group').each(function(d) {
          if (d.name === agent.name) {
            d3.select(this).selectAll('path')
              .transition().duration(300)
              .style('opacity', isActive ? 0.8 : 0);
          }
        });
        
        // Toggle legend item
        d3.select(this).select('line')
          .transition().duration(300)
          .style('opacity', isActive ? 1 : 0.3);
        d3.select(this).select('text')
          .transition().duration(300)
          .style('opacity', isActive ? 1 : 0.3);
      });
    
    legendItem.append('line')
      .attr('x1', 0)
      .attr('x2', 20)
      .attr('y1', 0)
      .attr('y2', 0)
      .style('stroke', agent.color)
      .style('stroke-width', 2);
    
    legendItem.append('text')
      .attr('x', 25)
      .attr('y', 0)
      .attr('dy', '0.35em')
      .style('fill', 'hsl(var(--foreground))')
      .style('font-size', '11px')
      .text(agent.name);
  });
  
  // Fade in
  svg.transition()
    .duration(500)
    .style('opacity', 1);
  
  // Add interaction hint
  const hint = g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .style('fill', 'hsl(var(--muted-foreground))')
    .style('font-size', '11px')
    .style('opacity', 0.5)
    .text('Hover over lines to highlight • Click legend to toggle');
  
  // Handle resize
  let resizeTimer;
  let lastWidth = width;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      const newWidth = container.offsetWidth;
      if (Math.abs(newWidth - lastWidth) > 10) {
        svg.remove();
        initAgentNetworkChart();
      }
    }, 500);
  });
}

// Initialize when ready
if (document.getElementById('agent-network-chart')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAgentNetworkChart);
  } else {
    initAgentNetworkChart();
  }
}
