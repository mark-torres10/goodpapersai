import type { NextConfig } from "next";

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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://impartial-wolf-773.convex.site",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' https://lh3.googleusercontent.com data:",
              "connect-src 'self' https://impartial-wolf-773.convex.site wss://impartial-wolf-773.convex.site",
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
