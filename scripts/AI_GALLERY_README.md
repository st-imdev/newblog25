# AI Gallery Processor

Local script to process your Midjourney images for the blog gallery.

## Features

- **Automatic Thumbnails**: Generates 300×300 square thumbnails with smart cropping
- **File Organization**: Numbers and organizes images for easy upload
- **Prompt Management**: Stores prompts with each image
- **HTML Generation**: Creates ready-to-use HTML snippets for your gallery
- **Batch Processing**: Handle multiple images at once

## Setup

```bash
# Run the setup script
./scripts/setup-ai-gallery.sh
```

Or manually:
```bash
pip3 install Pillow
chmod +x scripts/ai-gallery-processor.py
```

## Usage

### Single Image
```bash
python3 scripts/ai-gallery-processor.py image.jpg "abstract neural network, cyberpunk style --ar 1:1 --v 6"
```

### Batch Processing
```bash
# Process all images in a folder (prompts entered interactively)
python3 scripts/ai-gallery-processor.py --batch ~/Downloads/midjourney-images/
```

### Smart Filename Processing
If your images have prompts in the filename (e.g., `cyberpunk--neural_network_abstract_style.jpg`), the script will extract and suggest the prompt.

### Generate HTML Only
```bash
# Generate HTML snippet from already processed images
python3 scripts/ai-gallery-processor.py --generate-html .
```

## Output Structure

```
ai-gallery-processed/
├── images/           # Full-size images (image-1.jpg, image-2.jpg, ...)
├── thumbnails/       # 300x300 thumbnails (thumb-1.jpg, thumb-2.jpg, ...)
├── gallery_data.json # Metadata and prompts
└── gallery_snippet.html # Ready-to-use HTML
```

## Upload to Website

1. **Copy Images**: Upload all files from `images/` and `thumbnails/` to `assets/ai-gallery/` on your website
2. **Update HTML**: Replace the example images in `_includes/ai_gallery.html` with content from `gallery_snippet.html`
3. **Deploy**: Commit and push to GitHub

## Example Workflow

```bash
# 1. Process your latest Midjourney exports
python3 scripts/ai-gallery-processor.py --batch ~/Downloads/midjourney-batch-12-31/

# 2. Copy processed files to website
cp ai-gallery-processed/images/* assets/ai-gallery/
cp ai-gallery-processed/thumbnails/* assets/ai-gallery/

# 3. Update gallery HTML (copy content from gallery_snippet.html)
# Edit _includes/ai_gallery.html

# 4. Deploy
git add .
git commit -m "Add new AI gallery images"
git push
```

## Tips

- **Image Quality**: Original images are saved at 90% JPEG quality, thumbnails at 85%
- **Formats**: Supports JPG, PNG, WebP, BMP input (all converted to JPG)
- **Prompts**: Keep prompts descriptive but concise for better display
- **Batch Size**: Process 5-15 images at a time for optimal gallery display

## Troubleshooting

**PIL/Pillow Issues**:
```bash
pip3 install --upgrade Pillow
```

**Permission Denied**:
```bash
chmod +x scripts/ai-gallery-processor.py
```

**Large Images**: The script automatically optimizes file sizes while maintaining quality.