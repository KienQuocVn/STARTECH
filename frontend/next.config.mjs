/** @type {import('next').NextConfig} */
function normalizeApiBaseUrl(value) {
  const trimmed = value.replace(/\/$/, '')

  if (trimmed.endsWith('/api/v1')) return trimmed
  if (trimmed.endsWith('/api')) return `${trimmed}/v1`
  return `${trimmed}/api/v1`
}

const backendBaseUrl = normalizeApiBaseUrl(
  process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://127.0.0.1:3001',
)

const nextConfig = {
  images: {
    unoptimized: true,
    qualities: [75, 85, 90],
  },

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendBaseUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
