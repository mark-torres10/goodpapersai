import type { NextConfig } from "next";

/**
 * Next.js Configuration for Goodpapers
 * 
 * Security Notes:
 * - CSP includes 'unsafe-eval' for PDF.js worker (industry standard)
 * - See SECURITY.md for detailed security trade-off analysis
 */

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js and PDF.js requirements - see SECURITY.md for trade-off analysis
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com https://*.convex.site https://*.convex.cloud",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://lh3.googleusercontent.com data: blob:",
              "connect-src 'self' https://*.convex.site wss://*.convex.site https://*.convex.cloud wss://*.convex.cloud",
              // PDF.js worker requires blob: URLs
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "frame-src 'none'",
              "font-src 'self' data:",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Specific Google profile image subdomain
      },
    ],
  },
};

export default nextConfig;
