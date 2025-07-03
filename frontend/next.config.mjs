/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://bitcode-task.onrender.com/:path*",
        // destination: "http://localhost:5100/:path*",
      },
    ];
  },
};

export default nextConfig;
