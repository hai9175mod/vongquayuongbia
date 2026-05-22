/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // Quan trọng cho static export
  },
};
export default nextConfig;