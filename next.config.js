/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

module.exports = nextConfig;
module.exports = {
  async rewrites() {
    return [
      {
        source: "/coin/:id",
        destination: "/coin/:id"
        // The :path parameter is used here so will not be automatically passed in the query
      }
    ];
  }
};
