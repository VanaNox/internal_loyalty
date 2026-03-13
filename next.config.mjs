/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  output: isDev ? undefined : 'export',
  trailingSlash: isDev ? false : true,
  images: {
    unoptimized: true
  },
  experimental: {
    typedRoutes: true
  },
  basePath: isGithubActions && repo ? `/${repo}` : '',
  assetPrefix: isGithubActions && repo ? `/${repo}/` : ''
};

export default nextConfig;
