import { SmartContractConfig } from '../types/web3'

// Smart contract configuration for Hedera Mainnet
export const HEDERA_MAINNET_CONFIG: SmartContractConfig = {
  propertyFactory: '0x0000000000000000000000000000000000000000', // To be deployed
  marketplace: '0x0000000000000000000000000000000000000000', // To be deployed
  ownershipRegistry: '0x0000000000000000000000000000000000000000', // To be deployed
  kycRegistry: '0x0000000000000000000000000000000000000000', // To be deployed
  chainId: 295, // Hedera Mainnet chain ID
  rpcUrl: 'https://mainnet.hashio.io/api',
  blockExplorer: 'https://hashscan.io/mainnet',
}

// Testnet configuration (Hedera Testnet for development)
export const HEDERA_TESTNET_CONFIG: SmartContractConfig = {
  propertyFactory: '0x0000000000000000000000000000000000000000', // To be deployed
  marketplace: '0x0000000000000000000000000000000000000000', // To be deployed
  ownershipRegistry: '0x0000000000000000000000000000000000000000', // To be deployed
  kycRegistry: '0x0000000000000000000000000000000000000000', // To be deployed
  chainId: 296, // Hedera Testnet chain ID
  rpcUrl: 'https://testnet.hashio.io/api',
  blockExplorer: 'https://hashscan.io/testnet',
}

// Get current network configuration
export function getNetworkConfig(): SmartContractConfig {
  const isMainnet = process.env.NEXT_PUBLIC_HEDERA_NETWORK === 'mainnet'
  return isMainnet ? HEDERA_MAINNET_CONFIG : HEDERA_TESTNET_CONFIG
}

// Smart contract ABIs (to be added when contracts are deployed)
export const PROPERTY_FACTORY_ABI = [
  // PropertyFactory.sol ABI will be added here
]

export const MARKETPLACE_ABI = [
  // Marketplace.sol ABI will be added here
]

export const OWNERSHIP_REGISTRY_ABI = [
  // OwnershipRegistry.sol ABI will be added here
]

export const KYC_REGISTRY_ABI = [
  // KYC registry contract ABI will be added here
]

// ERC-20 token ABI for property tokens
export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]

// Helper functions for contract interaction
export function getContractAddress(contractName: keyof SmartContractConfig): string {
  const config = getNetworkConfig()
  return config[contractName] as string
}

export function getExplorerUrl(hash: string, type: 'tx' | 'address' = 'tx'): string {
  const config = getNetworkConfig()
  return `${config.blockExplorer}/${type}/${hash}`
}