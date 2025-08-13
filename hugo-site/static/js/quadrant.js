/* Minimal, robust D3 quadrant renderer
 * - Finds all elements with [data-quadrant]
 * - Reads labels from data attributes
 * - Draws responsive quadrant, redraws on resize
 */
(function(){
  if (window.__quadrantInit) return; // guard
  window.__quadrantInit = true;

  function log(){ try{ console.debug.apply(console, ['[quadrant]'].concat([].slice.call(arguments))); }catch(e){} }

  function ensureD3(callback){
    if (typeof window.d3 !== 'undefined') return callback();
    // If a script tag for d3 exists, wait for it
    var existing = document.querySelector('script[src*="d3.v7"]') || document.querySelector('script[src*="d3@7"]');
    if (existing) {
      var tries = 0; var intv = setInterval(function(){
        if (typeof window.d3 !== 'undefined') { clearInterval(intv); callback(); }
        else if (++tries > 40) { clearInterval(intv); log('D3 failed to load'); }
      }, 125);
      return;
    }
    // Otherwise, load it
    var s = document.createElement('script');
    s.src = 'https://d3js.org/d3.v7.min.js'; s.async = true;
    s.onload = callback; s.onerror = function(){ log('Failed to load D3'); };
    document.head.appendChild(s);
  }

  function drawOne(container){
    var el = container;
    var d3 = window.d3;
    // Clear
    el.innerHTML = '';
    var width = el.clientWidth || 700;
    var isMobile = width < 500;
    var margin = isMobile ? {top:30,right:20,bottom:50,left:50} : {top:40,right:40,bottom:60,left:70};
    var height = (isMobile ? Math.round(width*0.8) : 400);
    var innerW = width - margin.left - margin.right;
    var innerH = height - margin.top - margin.bottom;

    var svg = d3.select(el).append('svg').attr('width', width).attr('height', height);
    var g = svg.append('g').attr('transform','translate('+margin.left+','+margin.top+')');

    var x = d3.scaleLinear().domain([0,1]).range([0, innerW]);
    var y = d3.scaleLinear().domain([0,1]).range([innerH, 0]);

    var isDark = document.documentElement.classList.contains('dark');
    var grid = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
    var axis = '#737373';
    var text = isDark ? '#e5e5e5' : '#171717';
    var point = isDark ? '#a3a3a3' : '#666';

    // Background tints (q2, q3)
    g.append('rect').attr('x', x(0.5)).attr('y', y(1)).attr('width', x(0.5)).attr('height', y(0.5))
      .attr('fill', isDark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.05)');
    g.append('rect').attr('x', 0).attr('y', y(1)).attr('width', x(0.5)).attr('height', y(0.5))
      .attr('fill', isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)');

    // Grid lines
    g.append('line').attr('x1', x(0.5)).attr('x2', x(0.5)).attr('y1', 0).attr('y2', innerH)
      .attr('stroke', grid).attr('stroke-dasharray', '4,4');
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', y(0.5)).attr('y2', y(0.5))
      .attr('stroke', grid).attr('stroke-dasharray', '4,4');

    // Axes
    g.append('g').attr('transform','translate(0,'+innerH+')')
      .call(d3.axisBottom(x).ticks(2).tickFormat(function(d){return d===0?'Low':d===1?'High':'';}))
      .call(function(s){ s.select('.domain').remove(); s.selectAll('.tick line').attr('stroke', axis); s.selectAll('.tick text').attr('fill', axis).style('font-size','12px'); });
    g.append('g')
      .call(d3.axisLeft(y).ticks(2).tickFormat(function(d){return d===0?'Low':d===1?'High':'';}))
      .call(function(s){ s.select('.domain').remove(); s.selectAll('.tick line').attr('stroke', axis); s.selectAll('.tick text').attr('fill', axis).style('font-size','12px'); });

    // Axis titles
    svg.append('text').attr('x', margin.left + innerW/2).attr('y', height-10).attr('text-anchor','middle').attr('fill', text)
      .style('font-size','14px').style('font-weight','500').text(el.dataset.xLabel||'Certainty');
    svg.append('text').attr('transform','rotate(-90)').attr('x', -(margin.top + innerH/2)).attr('y', 15).attr('text-anchor','middle').attr('fill', text)
      .style('font-size','14px').style('font-weight','500').text(el.dataset.yLabel||'Skin in the Game');

    // Quadrant labels
    var labels = [
      {x:0.75,y:0.25,text: el.dataset.q1 || 'High certainty, low skin'},
      {x:0.75,y:0.75,text: el.dataset.q2 || 'High certainty, high skin'},
      {x:0.25,y:0.75,text: el.dataset.q3 || 'Low certainty, high skin'},
      {x:0.25,y:0.25,text: el.dataset.q4 || 'Low certainty, low skin'}
    ];
    g.selectAll('.quad-label').data(labels).enter().append('text').attr('class','quad-label')
      .attr('x', function(d){return x(d.x)}).attr('y', function(d){return y(d.y)})
      .attr('text-anchor','middle').attr('fill', text).style('font-size', isMobile?'12px':'14px').style('font-weight','500')
      .text(function(d){return d.text});

    // Points
    var pts = [
      {x:0.8,y:0.2,label:'Viral sermons'},
      {x:0.8,y:0.8,label:'Operators'},
      {x:0.2,y:0.8,label:'Practitioners'},
      {x:0.2,y:0.2,label:'Think-pieces'}
    ];
    g.selectAll('.point').data(pts).enter().append('circle').attr('class','point')
      .attr('cx',function(d){return x(d.x)}).attr('cy',function(d){return y(d.y)}).attr('r',5).attr('fill', point).attr('opacity',0.8);
    if(!isMobile){
      g.selectAll('.point-label').data(pts).enter().append('text').attr('class','point-label')
        .attr('x',function(d){return x(d.x)+8}).attr('y',function(d){return y(d.y)+3}).attr('fill', point).style('font-size','11px')
        .text(function(d){return d.label});
    }
  }

  function init(){
    var nodes = document.querySelectorAll('[data-quadrant]');
    if (!nodes.length) return;
    ensureD3(function(){
      nodes.forEach(function(n){ drawOne(n); });
      var to; window.addEventListener('resize', function(){ clearTimeout(to); to=setTimeout(function(){ nodes.forEach(function(n){ drawOne(n); }); }, 200); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();


