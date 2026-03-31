#!/bin/bash

# Quick setup for Netlify deployment

echo "🚀 MediTrust Netlify Deployment Setup"
echo "======================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend/frontend/react-dashboard || exit 1

npm install

echo "✅ Dependencies installed"
echo ""

# Create .env from example
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
VITE_SUPABASE_URL=https://db.wlrfvjrgkrszbvcwjoqi.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key-here
EOF
    echo "⚠️  Please edit .env with your Supabase public key"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit .env with your Supabase credentials:"
echo "   cd frontend/frontend/react-dashboard"
echo "   nano .env"
echo ""
echo "2. Test locally:"
echo "   npm run dev"
echo ""
echo "3. Deploy to Netlify:"
echo "   npm install -g netlify-cli"
echo "   netlify deploy --prod"
echo ""
echo "Or connect your GitHub repo at https://app.netlify.com"
echo ""
