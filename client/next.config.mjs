/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Allows Images to be loaded from the following domains
        domains: ['gateway.pinata.cloud'],
    },
    reactStrictMode: false,

};

export default nextConfig;
