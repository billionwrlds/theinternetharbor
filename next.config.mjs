import nextEnv from "@next/env"

const { loadEnvConfig } = nextEnv

// Ensure `.env.local` is loaded for `next.config.mjs` evaluation (helps client-side inlining of NEXT_PUBLIC_*).
loadEnvConfig(process.cwd())

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
