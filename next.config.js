/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        appDir: true,
    },
    webpack(config, options) {
        config.resolve.alias['@'] = path.join(__dirname, 'src')
        return config;
    },
};

module.exports = nextConfig;
