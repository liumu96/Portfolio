/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  // experimental: {
  //   appDir: true,
  // },
  webpack5: true,
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === "production",
  },
  eslint: {
    /// Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === "production",
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return Object.assign({}, config, {
      module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
          // {
          //   test: /\.md$/,
          //   loader: 'emit-file-loader',
          //   options: {
          //     name: 'dist/[path][name].[ext]',
          //   },
          // },
          {
            test: /\.md$/,
            loader: "raw-loader",
          },
        ]),
      }),
    });
  },
};

module.exports = nextConfig;
