/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: `${process.env.TOKEN_REQUEST_HOST}/ether/request`, // 代理到外部服务器
  //     },
  //   ];
  // },
}

module.exports = nextConfig
