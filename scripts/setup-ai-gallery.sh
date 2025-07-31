#!/bin/bash
# Setup script for AI Gallery Processor

echo "🎨 Setting up AI Gallery Processor..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    echo "Please install Python 3 and try again"
    exit 1
fi

# Install dependencies
echo "📦 Installing Python dependencies..."
pip3 install -r scripts/requirements.txt

# Make the processor executable
chmod +x scripts/ai-gallery-processor.py

echo "✅ Setup complete!"
echo ""
echo "Usage examples:"
echo "  # Process single image:"
echo "  python3 scripts/ai-gallery-processor.py image.jpg \"abstract neural network, cyberpunk style --ar 1:1 --v 6\""
echo ""
echo "  # Process folder of images (interactive prompts):"
echo "  python3 scripts/ai-gallery-processor.py --batch ~/Downloads/midjourney-images/"
echo ""
echo "  # Generate HTML snippet from processed images:"
echo "  python3 scripts/ai-gallery-processor.py --generate-html ."
echo ""
echo "Processed files will be saved to: ai-gallery-processed/"