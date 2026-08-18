import type { NextConfig } from "next";

const apiURL = new URL(
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
);

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        localPatterns: [
            {
                pathname: "/**",
            },
        ],
        remotePatterns: [
            {
                protocol: apiURL.protocol === "https:" ? "https" : "http",
                hostname: apiURL.hostname,
                port: apiURL.port,
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
