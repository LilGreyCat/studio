import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "192.168.1.199",
                port: "8080",
                pathname: "/uploads/**",
            },
        ],
    },
    allowedDevOrigins: [
        "192.168.1.199",
        "192.168.1.70",
        "192.168.1.39",
        "localhost",
    ],
};

export default nextConfig;
