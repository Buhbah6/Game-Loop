#!/bin/bash

# Build script for Render deployment
echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the admin panel and application
echo "🔨 Building Strapi..."
npm run build

echo "✅ Build completed successfully!"