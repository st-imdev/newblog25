# AI Gallery Instructions

This directory contains the AI-generated images for the homepage gallery.

## Image Requirements

For each image you want to display:

1. **Thumbnail**: Save as `thumb-{number}.jpg` (e.g., `thumb-1.jpg`)
   - Recommended size: 300x300px (square aspect ratio)
   - These will be displayed in the grid

2. **Full Image**: Save as `image-{number}.jpg` (e.g., `image-1.jpg`)
   - This is the full-resolution image shown in the lightbox
   - Any size, but consider web optimization (recommended max ~2000px on longest side)

## How to Add Images

1. Save your images in this directory following the naming convention above
2. Update `_includes/ai_gallery.html` to replace the placeholder loop with your actual images
3. Add the `data-prompt` attribute with your Midjourney prompt for each image

## Example Gallery Item

Replace the loop in `_includes/ai_gallery.html` with items like this:

```html
<div class="ai-gallery-item" data-prompt="a minimalist abstract painting of code flowing through space, digital art style" data-image="/assets/ai-gallery/image-1.jpg">
  <img src="/assets/ai-gallery/thumb-1.jpg" alt="AI Generation 1" loading="lazy">
</div>
```

## Tips

- Keep file sizes optimized for web (use JPEG compression)
- Ensure all images have the same aspect ratio for consistent grid display
- The gallery displays 5 columns × 3 rows (15 images total) on desktop