/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: [
    {
      source: "/api/:path*",
      destination: "https://bitcode-task.onrender.com/api/:path*",
    },
  ],
};

export default nextConfig;
