// Property Token Contract ABI
export const PROPERTY_TOKEN_ABI = [
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

  // Custom Property Token Functions
  {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
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
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "burnFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxTokens",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_maxTokens", "type": "uint256"}],
    "name": "setMaxTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRemainingTokens",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_propertyAddress", "type": "address"}, {"internalType": "string", "name": "_transactionId", "type": "string"}],
    "name": "connectToProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "getMintCooldownRemaining",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Pausable Functions
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Access Control Functions
  {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "account", "type": "address"}],
    "name": "hasRole",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "account", "type": "address"}],
    "name": "grantRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "role", "type": "bytes32"}, {"internalType": "address", "name": "account", "type": "address"}],
    "name": "revokeRole",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },

  // Governance Functions (ERC20Votes)
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "getVotes",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "delegatee", "type": "address"}],
    "name": "delegate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "delegates",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "propertyAddress", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "transactionId", "type": "string"}
    ],
    "name": "PropertyConnected",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "newMaxTokens", "type": "uint256"}
    ],
    "name": "MaxTokensUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "to", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "TokensMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "EmergencyPause",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "EmergencyUnpause",
    "type": "event"
  }
] as const

// Property Manager Contract ABI (simplified)
export const PROPERTY_MANAGER_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "propertyToken", "type": "address"}],
    "name": "addProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "propertyToken", "type": "address"}],
    "name": "removeProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllProperties",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Property Token Handler ABI
export const PROPERTY_TOKEN_HANDLER_ABI = [
  // Token Sale Functions
  {
    "inputs": [{"internalType": "uint256", "name": "_pricePerToken", "type": "uint256"}, {"internalType": "uint256", "name": "_minPurchase", "type": "uint256"}, {"internalType": "uint256", "name": "_maxPurchase", "type": "uint256"}, {"internalType": "uint256", "name": "_maxSupply", "type": "uint256"}],
    "name": "configureSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenAmount", "type": "uint256"}],
    "name": "purchaseTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentSale",
    "outputs": [{"internalType": "uint256", "name": "pricePerToken", "type": "uint256"}, {"internalType": "uint256", "name": "minPurchase", "type": "uint256"}, {"internalType": "uint256", "name": "maxPurchase", "type": "uint256"}, {"internalType": "bool", "name": "isActive", "type": "bool"}, {"internalType": "uint256", "name": "totalSold", "type": "uint256"}, {"internalType": "uint256", "name": "maxSupply", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Marketplace Functions
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "uint256", "name": "pricePerToken", "type": "uint256"}],
    "name": "listTokensForSale",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "listingId", "type": "uint256"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "purchaseFromMarketplace",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "listingId", "type": "uint256"}],
    "name": "cancelListing",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "marketplaceListings",
    "outputs": [{"internalType": "address", "name": "seller", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}, {"internalType": "uint256", "name": "pricePerToken", "type": "uint256"}, {"internalType": "uint256", "name": "listingTime", "type": "uint256"}, {"internalType": "bool", "name": "isActive", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextListingId",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
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
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "stakingInfo",
    "outputs": [{"internalType": "uint256", "name": "stakedAmount", "type": "uint256"}, {"internalType": "uint256", "name": "stakeTime", "type": "uint256"}, {"internalType": "uint256", "name": "lastRewardClaim", "type": "uint256"}, {"internalType": "uint256", "name": "totalRewards", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "staker", "type": "address"}],
    "name": "calculateStakingRewards",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Revenue Distribution Functions
  {
    "inputs": [{"internalType": "uint256", "name": "revenueAmount", "type": "uint256"}],
    "name": "distributeRevenue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimRevenue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "holder", "type": "address"}],
    "name": "getClaimableRevenue",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "propertyRevenue",
    "outputs": [{"internalType": "uint256", "name": "totalRevenue", "type": "uint256"}, {"internalType": "uint256", "name": "distributedRevenue", "type": "uint256"}, {"internalType": "uint256", "name": "revenuePerToken", "type": "uint256"}, {"internalType": "uint256", "name": "lastDistribution", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Access Control Functions
  {
    "inputs": [{"internalType": "address", "name": "investor", "type": "address"}, {"internalType": "bool", "name": "status", "type": "bool"}],
    "name": "setAccreditedInvestor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "accreditedInvestors",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Contract Info
  {
    "inputs": [],
    "name": "propertyToken",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paymentToken",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Events
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "buyer", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "totalCost", "type": "uint256"}],
    "name": "TokensPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "uint256", "name": "listingId", "type": "uint256"}, {"indexed": true, "internalType": "address", "name": "seller", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "pricePerToken", "type": "uint256"}],
    "name": "TokensListed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "staker", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "TokensStaked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "uint256", "name": "totalRevenue", "type": "uint256"}, {"indexed": false, "internalType": "uint256", "name": "revenuePerToken", "type": "uint256"}],
    "name": "RevenueDistributed",
    "type": "event"
  }
] as const

// Minimal Property Factory ABI
export const MINIMAL_PROPERTY_FACTORY_ABI = [
  {
    "type": "function",
    "name": "registerProperty",
    "inputs": [
      {"name": "tokenContract", "type": "address", "internalType": "address"},
      {"name": "handlerContract", "type": "address", "internalType": "address"},
      {"name": "name", "type": "string", "internalType": "string"},
      {"name": "symbol", "type": "string", "internalType": "string"},
      {"name": "ipfsHash", "type": "string", "internalType": "string"},
      {"name": "totalValue", "type": "uint256", "internalType": "uint256"},
      {"name": "maxTokens", "type": "uint256", "internalType": "uint256"},
      {"name": "propertyType", "type": "uint8", "internalType": "enum MinimalPropertyFactory.PropertyType"},
      {"name": "location", "type": "string", "internalType": "string"}
    ],
    "outputs": [{"name": "propertyId", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getProperty",
    "inputs": [{"name": "propertyId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [{
      "name": "", "type": "tuple", "internalType": "struct MinimalPropertyFactory.PropertyInfo",
      "components": [
        {"name": "tokenContract", "type": "address", "internalType": "address"},
        {"name": "handlerContract", "type": "address", "internalType": "address"},
        {"name": "name", "type": "string", "internalType": "string"},
        {"name": "symbol", "type": "string", "internalType": "string"},
        {"name": "ipfsHash", "type": "string", "internalType": "string"},
        {"name": "totalValue", "type": "uint256", "internalType": "uint256"},
        {"name": "maxTokens", "type": "uint256", "internalType": "uint256"},
        {"name": "creator", "type": "address", "internalType": "address"},
        {"name": "createdAt", "type": "uint256", "internalType": "uint256"},
        {"name": "isActive", "type": "bool", "internalType": "bool"},
        {"name": "propertyType", "type": "uint8", "internalType": "enum MinimalPropertyFactory.PropertyType"},
        {"name": "location", "type": "string", "internalType": "string"}
      ]
    }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "propertyCount",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyProperty",
    "inputs": [{"name": "propertyId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "isPropertyVerified",
    "inputs": [{"name": "tokenContract", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCreatorProperties",
    "inputs": [{"name": "creator", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "propertyCreationFee",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  }
] as const

// Governance Contract ABI (simplified)
export const GOVERNANCE_ABI = [
  {
    "inputs": [{"internalType": "address[]", "name": "targets", "type": "address[]"}, {"internalType": "uint256[]", "name": "values", "type": "uint256[]"}, {"internalType": "bytes[]", "name": "calldatas", "type": "bytes[]"}, {"internalType": "string", "name": "description", "type": "string"}],
    "name": "propose",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}, {"internalType": "uint8", "name": "support", "type": "uint8"}],
    "name": "castVote",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "proposalId", "type": "uint256"}],
    "name": "state",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const