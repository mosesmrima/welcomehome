// NEW MODULAR SMART CONTRACT ABIs - Generated for Hedera Deployment

// SecureWelcomeHomeProperty ABI (Enhanced ERC20 with security features)
export const SECURE_PROPERTY_TOKEN_ABI = [
  // ERC20 Standard Functions
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Enhanced Security Functions
  {
    "inputs": [],
    "name": "maxTokens",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintedTokens",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "propertyInitialized",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_revaProperty", "type": "address"},
      {"internalType": "string", "name": "_transactionID", "type": "string"}
    ],
    "name": "connectProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// PropertyTokenHandler ABI (Token sales, marketplace, staking, revenue)
export const PROPERTY_TOKEN_HANDLER_ABI = [
  // Token Sale Functions
  {
    "inputs": [],
    "name": "getTokenSaleInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "pricePerToken", "type": "uint256"},
          {"internalType": "uint256", "name": "minPurchase", "type": "uint256"},
          {"internalType": "uint256", "name": "maxPurchase", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "uint256", "name": "totalSold", "type": "uint256"},
          {"internalType": "uint256", "name": "maxSupply", "type": "uint256"},
          {"internalType": "uint256", "name": "saleEndTime", "type": "uint256"},
          {"internalType": "uint256", "name": "propertyId", "type": "uint256"}
        ],
        "internalType": "struct PropertyTokenHandler.TokenSale",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenAmount", "type": "uint256"}],
    "name": "purchaseTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Staking Functions
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "stakeTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "unstakeTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getStakeInfo",
    "outputs": [
      {"internalType": "uint256", "name": "stakedAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "rewards", "type": "uint256"},
      {"internalType": "uint256", "name": "lastUpdated", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRewards",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Revenue Distribution Functions
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getClaimableRevenue",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRevenue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Marketplace Functions
  {
    "inputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "uint256", "name": "pricePerToken", "type": "uint256"}
    ],
    "name": "createListing",
    "outputs": [{"internalType": "uint256", "name": "listingId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "listingId", "type": "uint256"}],
    "name": "purchaseFromListing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// MockKYCRegistry ABI (KYC and accreditation management)
export const KYC_REGISTRY_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "isKYCApproved",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "isAccreditedInvestor",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getKYCStatus",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserKYCInfo",
    "outputs": [
      {"internalType": "uint8", "name": "status", "type": "uint8"},
      {"internalType": "uint8", "name": "investorType", "type": "uint8"},
      {"internalType": "bool", "name": "isAccredited", "type": "bool"},
      {"internalType": "uint256", "name": "approvedAt", "type": "uint256"},
      {"internalType": "uint256", "name": "expiresAt", "type": "uint256"},
      {"internalType": "bool", "name": "isExpired", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "documentHash", "type": "string"},
      {"internalType": "uint8", "name": "investorType", "type": "uint8"}
    ],
    "name": "submitKYC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "approveKYC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "bool", "name": "status", "type": "bool"}
    ],
    "name": "setAccreditedInvestor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "canUserPurchaseTokens",
    "outputs": [
      {"internalType": "bool", "name": "canPurchase", "type": "bool"},
      {"internalType": "string", "name": "reason", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// OwnershipRegistry ABI (Cross-property ownership tracking)
export const OWNERSHIP_REGISTRY_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserPortfolio",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256[]", "name": "propertyIds", "type": "uint256[]"},
          {"internalType": "uint256", "name": "totalProperties", "type": "uint256"},
          {"internalType": "uint256", "name": "totalTokens", "type": "uint256"},
          {"internalType": "uint256", "name": "totalValue", "type": "uint256"},
          {"internalType": "uint256", "name": "lastUpdated", "type": "uint256"}
        ],
        "internalType": "struct OwnershipRegistry.UserPortfolio",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserProperties",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "propertyId", "type": "uint256"}],
    "name": "getPropertyHolders",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGlobalStats",
    "outputs": [
      {"internalType": "uint256", "name": "totalProperties", "type": "uint256"},
      {"internalType": "uint256", "name": "totalUsers", "type": "uint256"},
      {"internalType": "uint256", "name": "totalTokens", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "propertyId", "type": "uint256"}
    ],
    "name": "getUserOwnership",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "tokenContract", "type": "address"},
          {"internalType": "uint256", "name": "propertyId", "type": "uint256"},
          {"internalType": "uint256", "name": "balance", "type": "uint256"},
          {"internalType": "uint256", "name": "lastUpdated", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "internalType": "struct OwnershipRegistry.OwnershipRecord",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// MinimalPropertyFactory ABI (Property registration and management)
export const MINIMAL_PROPERTY_FACTORY_ABI = [
  {
    "inputs": [],
    "name": "propertyCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "propertyId", "type": "uint256"}],
    "name": "getProperty",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "tokenContract", "type": "address"},
          {"internalType": "address", "name": "handlerContract", "type": "address"},
          {"internalType": "string", "name": "name", "type": "string"},
          {"internalType": "string", "name": "symbol", "type": "string"},
          {"internalType": "string", "name": "ipfsHash", "type": "string"},
          {"internalType": "uint256", "name": "totalValue", "type": "uint256"},
          {"internalType": "uint256", "name": "maxTokens", "type": "uint256"},
          {"internalType": "address", "name": "creator", "type": "address"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "uint8", "name": "propertyType", "type": "uint8"},
          {"internalType": "string", "name": "location", "type": "string"}
        ],
        "internalType": "struct MinimalPropertyFactory.PropertyInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "creator", "type": "address"}],
    "name": "getCreatorProperties",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "tokenContract", "type": "address"},
      {"internalType": "address", "name": "handlerContract", "type": "address"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "symbol", "type": "string"},
      {"internalType": "string", "name": "ipfsHash", "type": "string"},
      {"internalType": "uint256", "name": "totalValue", "type": "uint256"},
      {"internalType": "uint256", "name": "maxTokens", "type": "uint256"},
      {"internalType": "uint8", "name": "propertyType", "type": "uint8"},
      {"internalType": "string", "name": "location", "type": "string"}
    ],
    "name": "registerProperty",
    "outputs": [{"internalType": "uint256", "name": "propertyId", "type": "uint256"}],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

// MockPaymentToken ABI (HBAR token for payments)
export const PAYMENT_TOKEN_ABI = [
  // Standard ERC20 functions
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "spender", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// Legacy exports for backward compatibility during migration
export const PROPERTY_TOKEN_ABI = SECURE_PROPERTY_TOKEN_ABI
export const PROPERTY_MANAGER_ABI = PROPERTY_TOKEN_HANDLER_ABI
export const PROPERTY_FACTORY_ABI = MINIMAL_PROPERTY_FACTORY_ABI