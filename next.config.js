/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Configure webpack to handle WASM modules
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }
    return config
  },
}

module.exports = nextConfig

