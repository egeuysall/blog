import { withSentryConfig } from '@sentry/nextjs';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';
import withBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    reactStrictMode: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: true,
    
    turbopack: {
      rules: {
        '*.svg': ['@svgr/webpack'],
        '*.mdx': ['@mdx-js/loader'],
      },
    },
    
    serverExternalPackages: ['sharp'],
    
    images: {
      formats: ['image/avif', 'image/webp'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.example.com',
        },
        {
          protocol: 'https',
          hostname: '**.cloudfront.net',
        },
      ],
    },
    
    compiler: {
      removeConsole: !isDev ? {
        exclude: ['error', 'warn'],
      } : false,
    },
    
    experimental: {
      serverActions: {
        bodySizeLimit: '2mb',
      },
      optimizeCss: !isDev,
    },
    
    headers: async () => [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ],
    
    env: {
      APP_ENV: process.env.NODE_ENV || 'development',
      BUILD_TIME: new Date().toISOString(),
    },
    
    webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
      if (!isServer) {
        if (!config.optimization) {
          config.optimization = {};
        }
        if (!config.optimization.splitChunks) {
          config.optimization.splitChunks = { cacheGroups: {} };
        } else if (!config.optimization.splitChunks.cacheGroups) {
          config.optimization.splitChunks.cacheGroups = {};
        }
        
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        };
      }
      return config;
    },
  };
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default (phase: string) => {
  const baseConfig = nextConfig(phase);
  const analyzedConfig = withBundleAnalyzerConfig(baseConfig);
  
  return process.env.NODE_ENV === 'production' 
    ? withSentryConfig(analyzedConfig, {
        silent: true,
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
      })
    : analyzedConfig;
};