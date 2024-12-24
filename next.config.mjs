// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.themoviedb.org',
      },
    ],
  }
}

export default nextConfig
