import { createConfig, http } from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Define Hedera Testnet
export const hederaTestnet = {
  id: 296,
  name: 'Hedera Testnet',
  nativeCurrency: {
    decimals: 18, // MetaMask requires 18 decimals for EVM compatibility
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
    decimals: 18, // MetaMask requires 18 decimals for EVM compatibility
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

// Contract addresses for deployed smart contracts on Hedera Testnet
export const CONTRACT_ADDRESSES = {
  PROPERTY_TOKEN: process.env.NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS || '0xA4469cCf38cc88bA64c9d570692872c5c2A13aF7',
  PROPERTY_MANAGER: process.env.NEXT_PUBLIC_PROPERTY_MANAGER_ADDRESS || '0x71d91F4Ad42aa2f1A118dE372247630D8C3f30cb',
  GOVERNANCE: process.env.NEXT_PUBLIC_GOVERNANCE_ADDRESS || '0x75A63900FF55F27975005FB8299e3C1b42e28dD6',
  PROPERTY_FACTORY: process.env.NEXT_PUBLIC_PROPERTY_FACTORY_ADDRESS || '0x710d1E7F345CA3D893511743A00De2cFC1eAb6De',
  PROPERTY_GOVERNANCE: process.env.NEXT_PUBLIC_PROPERTY_GOVERNANCE_ADDRESS || '0x75A63900FF55F27975005FB8299e3C1b42e28dD6',
  OWNERSHIP_REGISTRY: '0xEfD59aEdf9f5B2441e161190c6C3E1FB2F8FD21b',
  KYC_REGISTRY: '0xeec63827760aA3d4C1eEC16a9BCFC06D2F15ecad',
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
  chains: [hederaNetwork],
  connectors,
  transports: {
    [hederaTestnet.id]: http(process.env.NEXT_PUBLIC_HEDERA_TESTNET_RPC_URL),
    [hederaMainnet.id]: http(process.env.NEXT_PUBLIC_HEDERA_MAINNET_RPC_URL),
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