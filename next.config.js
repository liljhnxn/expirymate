/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      "@react-native-async-storage/async-storage": false,
    };
    config.plugins.push(
      new (require("webpack").IgnorePlugin)({
        resourceRegExp: /^@x402/,
      })
    );
    return config;
  },
};

module.exports = nextConfig;
