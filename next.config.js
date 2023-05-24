/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY
    }
}
require("dotenv").config();

module.exports = nextConfig
