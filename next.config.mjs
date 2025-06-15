/** @type {import('next').NextConfig} */
const nextConfig = {
  async middleware() {
    return [
      {
        source: '/(about|contact|dashboard)',
        middleware: ['src/middleware/authMiddleware'],
      },
    ];
  },
  images: {
    domains: [
      'source.unsplash.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'www.esri.com',
      'www.mckinsey.com',
      'www.totalmobile.co.uk',
      'framerusercontent.com',
      'www.3ds.com',
      'gcs.yourdatasmarter.com',
      'cdn.prod.website-files.com',
      'images.pexels.com'
    ],
  },
  
};

export default nextConfig;