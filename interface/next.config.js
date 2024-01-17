/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['metadata.ens.domains',"portal.forgottenrunes.com","alchemy.mypinata.cloud","res.cloudinary.com","ipfs.io",""], 
    dangerouslyAllowSVG: true,
  },

}

module.exports = nextConfig
