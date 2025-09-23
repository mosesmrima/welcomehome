import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Define Alkebuleum network (custom chain)
export const alkebuleum = {
  id: 31337, // Replace with actual Alkebuleum chain ID
  name: 'Alkebuleum',
  nativeCurrency: {
    decimals: 18,
    name: 'Alkebuleum',
    symbol: 'ALK',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'], // Replace with actual Alkebuleum RPC
    },
  },
  blockExplorers: {
    default: {
      name: 'Alkebuleum Explorer',
      url: 'https://explorer.alkebuleum.com', // Replace with actual explorer
    },
  },
} as const

// Contract addresses
export const CONTRACT_ADDRESSES = {
  PROPERTY_TOKEN: process.env.NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  PROPERTY_MANAGER: process.env.NEXT_PUBLIC_PROPERTY_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000',
  GOVERNANCE: process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const

// Create wagmi config
export const config = createConfig({
  chains: [alkebuleum, mainnet, polygon, arbitrum],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [alkebuleum.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
})

// Contract roles
export const CONTRACT_ROLES = {
  MINTER_ROLE: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6',
  PAUSER_ROLE: '0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a',
  PROPERTY_MANAGER_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000001',
  DEFAULT_ADMIN_ROLE: '0x0000000000000000000000000000000000000000000000000000000000000000',
} as const

// Network configuration
export const NETWORK_CONFIG = {
  [alkebuleum.id]: {
    name: 'Alkebuleum',
    currency: 'ALK',
    decimals: 18,
    blockTime: 2, // seconds
  },
} as const