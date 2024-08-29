import path from "path";
/** @type {import('next').NextConfig} */

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src", "styles")],
  },
};

export default nextConfig;
