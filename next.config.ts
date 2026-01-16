import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // SEO & Performance Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
      // Cache sitemap for 24 hours
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=172800'
          }
        ],
      },
      // Cache robots.txt for 24 hours
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=86400, stale-while-revalidate=172800'
          }
        ],
      }
    ];
  },

  // Redirect rules
  async redirects() {
    return [
      // Redirect old URLs if needed
      {
        source: '/notes/:id',
        destination: '/student/notes/:id',
        permanent: true, // 301 redirect (good for SEO)
      }
    ];
  },

  // Rewrite rules for SEO-friendly URLs
  async rewrites() {
    return {
      beforeFiles: [
        // Dynamic sitemap rewrite
        {
          source: '/sitemap-notes.xml',
          destination: '/api/sitemap'
        }
      ]
    };
  },

  // Image optimization
  images: {
    domains: [
      'noteshub.example.com',
      // Add any external domains for note images
    ],
    // Optimize images for performance
    formats: ['image/avif', 'image/webp'],
    // Responsive image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compress responses
  compress: true,

  // Generate ETags for caching
  generateEtags: true,

  // Optimize for production
  productionBrowserSourceMaps: false,

  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material'
    ]
  }
};

export default nextConfig;
