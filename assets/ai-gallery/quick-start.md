# AI Gallery Quick Start

Your gallery is now live with 5 example images! You should see:

## What's Working Now:
- 5 random placeholder images in the gallery grid
- Click any image to open the lightbox
- Example Midjourney prompts display below each image
- Click overlay, × button, or press Escape to close
- Remaining 10 spots are faded placeholders

## To Replace with Your Own Images:

### Option 1: Use Local Images
1. Save your images in this directory:
   - Thumbnails: `thumb-1.jpg` through `thumb-5.jpg` (300×300px)
   - Full images: `image-1.jpg` through `image-5.jpg`

2. In `_includes/ai_gallery.html`, replace the picsum.photos URLs:
```html
<div class="ai-gallery-item" 
     data-prompt="your actual midjourney prompt here" 
     data-image="/assets/ai-gallery/image-1.jpg">
  <img src="/assets/ai-gallery/thumb-1.jpg" alt="Description" loading="lazy">
</div>
```

### Option 2: Use External URLs (Current Setup)
Just update the prompts and image URLs in `_includes/ai_gallery.html` with your actual Midjourney images hosted elsewhere.

## Adding More Images:
Replace the empty placeholder divs (lines 47-50) with more image items following the same pattern.

## Tips:
- Keep all images square (1:1 aspect ratio) for best grid display
- Optimize images for web (use JPEG, ~80% quality)
- Consider using a CDN or image hosting service for better performance