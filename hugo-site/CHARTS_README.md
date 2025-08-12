# Chart Documentation

This Hugo site includes a custom chart shortcode that renders beautiful, minimalist charts using Chart.js.

## Quick Start

To add a chart to any post or page, use the chart shortcode:

```markdown
{{< chart type="line" id="my-chart" height="400px" >}}
```

## Available Chart Types

### 1. Growth Line Chart
Shows a smooth line with gradient fill, perfect for displaying growth or progress over time.

```markdown
{{< chart type="growth" id="growth-chart" height="350px" >}}
```

**Data:** Hardcoded growth percentages from 20% to 95% over 7 months
**Use case:** Progress tracking, learning curves, adoption rates

### 2. Multi-Line Chart
Displays multiple lines on the same chart for comparison.

```markdown
{{< chart type="multi-line" id="comparison" height="400px" >}}
```

**Data:** Generates 3 lines with simulated 24-hour data
**Use case:** Performance comparison, time-series analysis, agent monitoring

### 3. Bar Chart
Simple vertical bars for comparing discrete values.

```markdown
{{< chart type="bar" id="model-scores" height="350px" >}}
```

**Data:** Shows 5 AI models with performance scores
**Use case:** Model benchmarks, category comparisons, rankings

### 4. Doughnut Chart
Circular chart with a hollow center for showing proportions.

```markdown
{{< chart type="doughnut" id="distribution" height="350px" >}}
```

**Data:** 5 categories showing percentage distribution
**Use case:** Resource allocation, time distribution, portfolio breakdown

### 5. Radar Chart
Multi-axis chart for comparing multiple dimensions.

```markdown
{{< chart type="radar" id="capabilities" height="400px" >}}
```

**Data:** 6 dimensions with current vs target values
**Use case:** Skill assessment, capability mapping, multi-factor analysis

### 6. Scatter Plot
Points plotted on X/Y axes to show relationships.

```markdown
{{< chart type="scatter" id="discoveries" height="350px" >}}
```

**Data:** 50 random points
**Use case:** Correlation analysis, pattern discovery, outlier detection

### 7. Area Chart
Stacked area chart with gradient fills.

```markdown
{{< chart type="area" id="resources" height="350px" >}}
```

**Data:** Two metrics (CPU and Memory) over time
**Use case:** Resource monitoring, cumulative metrics, trend visualization

## Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `type` | Yes | - | Chart type (see available types above) |
| `id` | No | Auto-generated | Unique identifier for the chart |
| `height` | No | `400px` | Height of the chart container |

## Color Scheme

Charts use a minimalist black/gray color palette that adapts to light/dark mode:

- **Primary:** Black (#171717) / Light gray (#e5e5e5)
- **Secondary:** Medium gray (#525252) / Light gray (#a3a3a3) 
- **Tertiary:** Neutral gray (#737373)
- **Borders:** 10% opacity black/white
- **Backgrounds:** Gradients with low opacity

## Example Post

Create a new post with multiple charts:

```markdown
---
title: "Data Visualization Demo"
date: 2025-01-10
---

## Performance Over Time

{{< chart type="growth" id="perf-growth" height="300px" >}}

Our performance has grown steadily over the past 7 months.

## Model Comparison

{{< chart type="bar" id="models" height="350px" >}}

Different models show varying performance levels.

## Resource Distribution

{{< chart type="doughnut" id="resources" height="350px" >}}

Understanding how resources are allocated helps optimization.
```

## Customizing Charts

To modify chart data or add new chart types:

1. Edit `/hugo-site/layouts/shortcodes/chart.html`
2. Add a new conditional block: `{{ else if eq $type "your-type" }}`
3. Configure the Chart.js options and data
4. Follow the existing color scheme for consistency

### Adding Dynamic Data

Currently, charts use hardcoded or generated data. To make them dynamic:

1. Pass data through shortcode parameters
2. Or fetch from a data file in Hugo's data directory
3. Or load from an external API using JavaScript

Example with parameters:
```markdown
{{< chart type="custom" data="10,20,30,40,50" labels="Jan,Feb,Mar,Apr,May" >}}
```

## Troubleshooting

### Charts Not Loading
- Ensure Chart.js CDN is accessible
- Check browser console for JavaScript errors
- Verify unique IDs if multiple charts on same page

### Charts Stacking
- Each chart must have a unique `id` parameter
- IDs are auto-generated with nanosecond precision if not specified

### Color Issues
- Charts automatically adapt to light/dark mode
- Colors are computed on initialization
- Theme changes require page refresh

## Performance Notes

- Charts load asynchronously after page content
- Chart.js library is loaded from CDN (4.4.0)
- Each chart adds ~2-3KB to page weight
- Animation can be disabled for better performance

## Browser Support

Charts work in all modern browsers that support:
- ES6 JavaScript
- Canvas element
- CSS custom properties

## License

Chart.js is MIT licensed. Our custom shortcode implementation is part of this project.
