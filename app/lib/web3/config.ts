import { createConfig, http } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Define Hedera Testnet
export const hederaTestnet = {
  id: 296,
  name: 'Hedera Testnet',
  nativeCurrency: {
    decimals: 8,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_HEDERA_TESTNET_RPC_URL || 'https://testnet.hashio.io/api'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashScan',
      url: 'https://hashscan.io/testnet',
    },
  },
} as const

// Define Hedera Mainnet
export const hederaMainnet = {
  id: 295,
  name: 'Hedera Mainnet',
  nativeCurrency: {
    decimals: 8,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_HEDERA_MAINNET_RPC_URL || 'https://mainnet.hashio.io/api'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashScan',
      url: 'https://hashscan.io/mainnet',
    },
  },
} as const

// Contract addresses
export const CONTRACT_ADDRESSES = {
  PROPERTY_TOKEN: process.env.NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  PROPERTY_MANAGER: process.env.NEXT_PUBLIC_PROPERTY_MANAGER_ADDRESS || '0x0000000000000000000000000000000000000000',
  GOVERNANCE: process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const

// Create connectors array based on available configuration
const connectors = [
  injected(),
  metaMask(),
]

// Only add WalletConnect if project ID is available
if (process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  connectors.push(
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    })
  )
}

// Determine which Hedera network to use based on environment
const hederaNetwork = process.env.NEXT_PUBLIC_HEDERA_NETWORK === 'mainnet' ? hederaMainnet : hederaTestnet

// Create wagmi config
export const config = createConfig({
  chains: [hederaNetwork, mainnet, polygon],
  connectors,
  transports: {
    [hederaTestnet.id]: http(),
    [hederaMainnet.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
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
  [hederaTestnet.id]: {
    name: 'Hedera Testnet',
    currency: 'HBAR',
    decimals: 8,
    blockTime: 3, // seconds (Hedera consensus time)
  },
  [hederaMainnet.id]: {
    name: 'Hedera Mainnet',
    currency: 'HBAR',
    decimals: 8,
    blockTime: 3, // seconds (Hedera consensus time)
  },
} as const