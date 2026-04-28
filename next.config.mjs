import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@react-native-async-storage/async-storage": path.resolve(
        "./src/shims/async-storage.ts"
      ),
      "pino-pretty": path.resolve("./src/shims/pino-pretty.ts")
    };
    return config;
  }
};

export default nextConfig;
