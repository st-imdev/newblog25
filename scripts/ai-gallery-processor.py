#!/usr/bin/env python3
"""
AI Gallery Processor
Processes Midjourney images for the blog gallery:
1. Generates 300x300 thumbnails
2. Organizes files with prompts
3. Prepares for easy upload to website

Usage:
    python scripts/ai-gallery-processor.py path/to/image.jpg "your midjourney prompt here"
    python scripts/ai-gallery-processor.py --batch path/to/folder/
"""

import os
import sys
import argparse
from PIL import Image, ImageOps
import json
from datetime import datetime
import shutil

class AIGalleryProcessor:
    def __init__(self, output_dir="ai-gallery-processed"):
        self.output_dir = output_dir
        self.ensure_output_dir()
        self.gallery_data_file = os.path.join(self.output_dir, "gallery_data.json")
        self.load_gallery_data()
    
    def ensure_output_dir(self):
        """Create output directory structure"""
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(os.path.join(self.output_dir, "images"), exist_ok=True)
        os.makedirs(os.path.join(self.output_dir, "thumbnails"), exist_ok=True)
    
    def load_gallery_data(self):
        """Load existing gallery data"""
        if os.path.exists(self.gallery_data_file):
            with open(self.gallery_data_file, 'r') as f:
                self.gallery_data = json.load(f)
        else:
            self.gallery_data = {"images": [], "next_id": 1}
    
    def save_gallery_data(self):
        """Save gallery data to JSON"""
        with open(self.gallery_data_file, 'w') as f:
            json.dump(self.gallery_data, f, indent=2)
    
    def generate_thumbnail(self, image_path, output_path, size=(300, 300)):
        """Generate square thumbnail with proper cropping"""
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                
                # Create square thumbnail with smart cropping
                thumb = ImageOps.fit(img, size, Image.Resampling.LANCZOS)
                thumb.save(output_path, 'JPEG', quality=85, optimize=True)
                return True
        except Exception as e:
            print(f"Error generating thumbnail: {e}")
            return False
    
    def process_image(self, image_path, prompt):
        """Process a single image with its prompt"""
        if not os.path.exists(image_path):
            print(f"Error: Image file not found: {image_path}")
            return False
        
        # Get next ID
        image_id = self.gallery_data["next_id"]
        
        # Generate filenames
        image_filename = f"image-{image_id}.jpg"
        thumb_filename = f"thumb-{image_id}.jpg"
        
        # Output paths
        image_output = os.path.join(self.output_dir, "images", image_filename)
        thumb_output = os.path.join(self.output_dir, "thumbnails", thumb_filename)
        
        try:
            # Copy original image (convert to JPG if needed)
            with Image.open(image_path) as img:
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGB')
                img.save(image_output, 'JPEG', quality=90, optimize=True)
            
            # Generate thumbnail
            if not self.generate_thumbnail(image_path, thumb_output):
                return False
            
            # Add to gallery data
            image_data = {
                "id": image_id,
                "prompt": prompt,
                "image_file": image_filename,
                "thumb_file": thumb_filename,
                "processed_date": datetime.now().isoformat(),
                "original_file": os.path.basename(image_path)
            }
            
            self.gallery_data["images"].append(image_data)
            self.gallery_data["next_id"] += 1
            
            # Save data
            self.save_gallery_data()
            
            print(f"✅ Processed image {image_id}:")
            print(f"   Original: {os.path.basename(image_path)}")
            print(f"   Image: {image_filename}")
            print(f"   Thumbnail: {thumb_filename}")
            print(f"   Prompt: {prompt[:50]}{'...' if len(prompt) > 50 else ''}")
            
            return True
            
        except Exception as e:
            print(f"Error processing image: {e}")
            return False
    
    def batch_process(self, folder_path):
        """Process all images in a folder (prompts from filenames or interactive)"""
        if not os.path.exists(folder_path):
            print(f"Error: Folder not found: {folder_path}")
            return
        
        # Find all image files
        image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}
        image_files = []
        
        for file in os.listdir(folder_path):
            if os.path.splitext(file.lower())[1] in image_extensions:
                image_files.append(os.path.join(folder_path, file))
        
        if not image_files:
            print("No image files found in folder")
            return
        
        print(f"Found {len(image_files)} image(s) to process")
        
        for image_path in sorted(image_files):
            filename = os.path.basename(image_path)
            print(f"\n📸 Processing: {filename}")
            
            # Try to extract prompt from filename (if contains "--")
            base_name = os.path.splitext(filename)[0]
            if '--' in base_name:
                # Assume format: "description--prompt.jpg"
                parts = base_name.split('--', 1)
                suggested_prompt = parts[1].replace('_', ' ').replace('-', ' ')
                print(f"Suggested prompt from filename: {suggested_prompt}")
                
                response = input("Use this prompt? (y/n/edit): ").strip().lower()
                if response == 'y':
                    prompt = suggested_prompt
                elif response == 'edit':
                    prompt = input("Enter prompt: ").strip()
                else:
                    prompt = input("Enter prompt: ").strip()
            else:
                prompt = input("Enter prompt for this image: ").strip()
            
            if prompt:
                self.process_image(image_path, prompt)
            else:
                print("Skipping image (no prompt provided)")
    
    def generate_html_snippet(self):
        """Generate HTML snippet for the gallery"""
        if not self.gallery_data["images"]:
            print("No images to generate HTML for")
            return
        
        html_lines = []
        html_lines.append("    <!-- Replace this section in _includes/ai_gallery.html -->")
        
        for img_data in self.gallery_data["images"]:
            html_lines.append(f'    <div class="ai-gallery-item" ')
            html_lines.append(f'         data-prompt="{img_data["prompt"]}" ')
            html_lines.append(f'         data-image="/assets/ai-gallery/{img_data["image_file"]}">')
            html_lines.append(f'      <img src="/assets/ai-gallery/{img_data["thumb_file"]}" alt="AI Generation {img_data["id"]}" loading="lazy">')
            html_lines.append(f'    </div>')
            html_lines.append('')
        
        # Save to file
        html_file = os.path.join(self.output_dir, "gallery_snippet.html")
        with open(html_file, 'w') as f:
            f.write('\n'.join(html_lines))
        
        print(f"\n📝 HTML snippet saved to: {html_file}")
        print("Copy this content to replace the example images in _includes/ai_gallery.html")
    
    def show_upload_instructions(self):
        """Show instructions for uploading to website"""
        if not self.gallery_data["images"]:
            return
        
        print(f"\n📋 Upload Instructions:")
        print(f"1. Copy all files from '{self.output_dir}/images/' to 'assets/ai-gallery/' on your website")
        print(f"2. Copy all files from '{self.output_dir}/thumbnails/' to 'assets/ai-gallery/' on your website")
        print(f"3. Update _includes/ai_gallery.html with the content from '{self.output_dir}/gallery_snippet.html'")
        print(f"4. Commit and push to GitHub")
        
        print(f"\nProcessed {len(self.gallery_data['images'])} images total")

def main():
    parser = argparse.ArgumentParser(description='Process images for AI gallery')
    parser.add_argument('path', help='Path to image file or folder')
    parser.add_argument('prompt', nargs='?', help='Midjourney prompt (for single image)')
    parser.add_argument('--batch', action='store_true', help='Process all images in folder')
    parser.add_argument('--output', default='ai-gallery-processed', help='Output directory')
    parser.add_argument('--generate-html', action='store_true', help='Generate HTML snippet only')
    
    args = parser.parse_args()
    
    processor = AIGalleryProcessor(args.output)
    
    if args.generate_html:
        processor.generate_html_snippet()
        processor.show_upload_instructions()
        return
    
    if args.batch or os.path.isdir(args.path):
        processor.batch_process(args.path)
    else:
        if not args.prompt:
            print("Error: Prompt required for single image processing")
            print("Usage: python script.py image.jpg \"your prompt here\"")
            return
        processor.process_image(args.path, args.prompt)
    
    # Generate HTML snippet and show instructions
    processor.generate_html_snippet()
    processor.show_upload_instructions()

if __name__ == "__main__":
    main()