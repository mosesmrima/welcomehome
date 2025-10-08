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

// Contract addresses for NEW MODULAR ARCHITECTURE deployed on Hedera Testnet
export const CONTRACT_ADDRESSES = {
  // Core Infrastructure Contracts
  PAYMENT_TOKEN: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS || '0x17F78C6f9F22356838d4A5fF1E1f9413B575D207',
  KYC_REGISTRY: process.env.NEXT_PUBLIC_KYC_REGISTRY_ADDRESS || '0x7570dF6b166fF2A173DcFC699ca48F0F8bCBc701',
  OWNERSHIP_REGISTRY: process.env.NEXT_PUBLIC_OWNERSHIP_REGISTRY_ADDRESS || '0x25eFAcD45224F995933aAc701dDE3D7Fb25012D8',
  PROPERTY_FACTORY: process.env.NEXT_PUBLIC_PROPERTY_FACTORY_ADDRESS || '0x53FeF62106b142022951309A55a3552d1426BBd1',
  PROPERTY_GOVERNANCE: process.env.NEXT_PUBLIC_PROPERTY_GOVERNANCE_ADDRESS || '0x0dd79160Ea9358a2F7440f369C5977CE168018b5',

  // Demo/Testing Contracts (for initial implementation and testing)
  DEMO_PROPERTY_TOKEN: process.env.NEXT_PUBLIC_DEMO_PROPERTY_TOKEN_ADDRESS || '0x6a883E83BF436872a455Db1A55e00477D7517174',
  DEMO_TOKEN_HANDLER: process.env.NEXT_PUBLIC_DEMO_TOKEN_HANDLER_ADDRESS || '0xA0f36ed1D2723aC7674035B4cEe489851176D827',

  // Legacy Aliases (for backward compatibility during migration)
  PROPERTY_TOKEN: process.env.NEXT_PUBLIC_DEMO_PROPERTY_TOKEN_ADDRESS || '0x6a883E83BF436872a455Db1A55e00477D7517174',
  PROPERTY_MANAGER: process.env.NEXT_PUBLIC_DEMO_TOKEN_HANDLER_ADDRESS || '0xA0f36ed1D2723aC7674035B4cEe489851176D827',
  GOVERNANCE: process.env.NEXT_PUBLIC_PROPERTY_GOVERNANCE_ADDRESS || '0x0dd79160Ea9358a2F7440f369C5977CE168018b5',
} as const

// Determine which Hedera network to use based on environment
const hederaNetwork = process.env.NEXT_PUBLIC_HEDERA_NETWORK === 'mainnet' ? hederaMainnet : hederaTestnet

// Create connectors dynamically to avoid SSR issues with indexedDB
const getConnectors = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return []
  }

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

  return connectors
}

// Create wagmi config
export const config = createConfig({
  chains: [hederaNetwork],
  connectors: getConnectors(),
  transports: {
    [hederaTestnet.id]: http(process.env.NEXT_PUBLIC_HEDERA_TESTNET_RPC_URL),
    [hederaMainnet.id]: http(process.env.NEXT_PUBLIC_HEDERA_MAINNET_RPC_URL),
  },
  ssr: true,
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