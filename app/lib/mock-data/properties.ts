import { parseEther, Address } from 'viem'

// Property types enum values (matches contract)
// RESIDENTIAL = 0, COMMERCIAL = 1, INDUSTRIAL = 2, MIXED_USE = 3, LAND = 4

export interface PropertyInfo {
  id: number
  tokenContract: Address
  handlerContract: Address
  name: string
  symbol: string
  ipfsHash: string
  totalValue: bigint
  maxTokens: bigint
  creator: Address
  createdAt: bigint
  isActive: boolean
  propertyType: number
  location: string
  description?: string
  societalImpact?: string
}

// Mock property data for demonstration
export const MOCK_PROPERTIES: PropertyInfo[] = [
  {
    id: 0,
    tokenContract: '0x1234567890123456789012345678901234567890' as Address,
    handlerContract: '0x2345678901234567890123456789012345678901' as Address,
    name: 'Luxury Villa Estate',
    symbol: 'LVILLA',
    ipfsHash: 'QmExample1',
    totalValue: parseEther('850000'),
    maxTokens: parseEther('10000'),
    creator: '0x3456789012345678901234567890123456789012' as Address,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 30),
    isActive: true,
    propertyType: 0, // RESIDENTIAL
    location: 'Beverly Hills, California, USA',
    description: 'A stunning 6-bedroom luxury villa featuring modern architecture, infinity pool, and panoramic city views. Perfect for families seeking an upscale lifestyle in one of the most prestigious neighborhoods.',
    societalImpact: 'Creates opportunities for the African diaspora to build generational wealth through property ownership in premium markets. Enables community members to invest in high-value real estate previously inaccessible, fostering economic empowerment and creating pathways for family legacy building.'
  },
  {
    id: 1,
    tokenContract: '0x2345678901234567890123456789012345678902' as Address,
    handlerContract: '0x3456789012345678901234567890123456789013' as Address,
    name: 'Modern Downtown Apartment',
    symbol: 'MDAPT',
    ipfsHash: 'QmExample2',
    totalValue: parseEther('450000'),
    maxTokens: parseEther('5000'),
    creator: '0x4567890123456789012345678901234567890123' as Address,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 25),
    isActive: true,
    propertyType: 0, // RESIDENTIAL
    location: 'Manhattan, New York, USA',
    description: 'Contemporary 2-bedroom apartment in the heart of Manhattan with floor-to-ceiling windows, premium finishes, and access to world-class amenities including gym, rooftop lounge, and concierge services.',
    societalImpact: 'Provides diaspora communities with a foothold in major urban centers, enabling participation in metropolitan real estate markets. Strengthens connections to cultural and economic hubs while building equity for future generations and supporting wealth accumulation.'
  },
  {
    id: 2,
    tokenContract: '0x3456789012345678901234567890123456789014' as Address,
    handlerContract: '0x4567890123456789012345678901234567890124' as Address,
    name: 'Oceanview Beach House',
    symbol: 'OCEAN',
    ipfsHash: 'QmExample3',
    totalValue: parseEther('1200000'),
    maxTokens: parseEther('15000'),
    creator: '0x5678901234567890123456789012345678901234' as Address,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 20),
    isActive: true,
    propertyType: 0, // RESIDENTIAL
    location: 'Malibu, California, USA',
    description: 'Breathtaking 4-bedroom beachfront property with direct ocean access, expansive outdoor decks, and stunning sunset views. Ideal for luxury vacation rentals or personal retreat.',
    societalImpact: 'Opens doors to coastal living and vacation property ownership, traditionally out of reach for many. Creates rental income opportunities while establishing legacy assets that can be passed down, strengthening family wealth and creating spaces for cultural gatherings and reunions.'
  },
  {
    id: 3,
    tokenContract: '0x4567890123456789012345678901234567890125' as Address,
    handlerContract: '0x5678901234567890123456789012345678901235' as Address,
    name: 'Commercial Plaza',
    symbol: 'CPLAZA',
    ipfsHash: 'QmExample4',
    totalValue: parseEther('2500000'),
    maxTokens: parseEther('25000'),
    creator: '0x6789012345678901234567890123456789012345' as Address,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 15),
    isActive: true,
    propertyType: 1, // COMMERCIAL
    location: 'Downtown Los Angeles, California, USA',
    description: 'Prime commercial real estate featuring 25,000 sq ft of retail and office space with high foot traffic and established tenants. Generates consistent rental income with strong appreciation potential.',
    societalImpact: 'Empowers community members to own commercial real estate and participate in business districts. Enables collective ownership of income-generating assets, creating sustainable revenue streams that support community initiatives, entrepreneurship, and economic self-determination.'
  },
  {
    id: 4,
    tokenContract: '0x5678901234567890123456789012345678901236' as Address,
    handlerContract: '0x6789012345678901234567890123456789012346' as Address,
    name: 'Mountain Retreat Cabin',
    symbol: 'MOUNT',
    ipfsHash: 'QmExample5',
    totalValue: parseEther('380000'),
    maxTokens: parseEther('4000'),
    creator: '0x7890123456789012345678901234567890123456' as Address,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 12),
    isActive: true,
    propertyType: 0, // RESIDENTIAL
    location: 'Aspen, Colorado, USA',
    description: 'Cozy 3-bedroom mountain cabin nestled in the Rockies, featuring rustic charm with modern upgrades, wood-burning fireplace, and proximity to world-class skiing and hiking trails.',
    societalImpact: 'Democratizes access to vacation and seasonal properties in premium locations. Enables families to create meaningful memories and traditions in mountain retreats, fostering wellness, cultural bonding, and diversifying community investment portfolios beyond urban areas.'
  },
  {
    id: 5,
    tokenContract: '0x6789012345678901234567890123456789012347' as Address,
    handlerContract: '0x7890123456789012345678901234567890123457' as Address,
    name: 'Urban Loft Complex',
    symbol: 'ULOFT',
    ipfsHash: 'QmExample6',
    totalValue: parseEther('680000'),
    maxTokens: parseEther('8000'),
    creator: '0x8901234567890123456789012345678901234567' as Address,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 10),
    isActive: true,
    propertyType: 3, // MIXED_USE
    location: 'Seattle, Washington, USA',
    description: 'Versatile mixed-use property featuring residential lofts above ground-floor retail spaces. Located in a vibrant neighborhood with strong rental demand from both residential and commercial tenants.',
    societalImpact: 'Bridges residential and commercial investment opportunities, offering diverse revenue streams. Supports community entrepreneurship by providing retail spaces while creating housing, fostering local business development and economic resilience in growing urban areas.'
  },
  {
    id: 6,
    tokenContract: '0x7890123456789012345678901234567890123458' as Address,
    handlerContract: '0x8901234567890123456789012345678901234568' as Address,
    name: 'Suburban Family Home',
    symbol: 'SFAM',
    ipfsHash: 'QmExample7',
    totalValue: parseEther('520000'),
    maxTokens: parseEther('6000'),
    creator: '0x9012345678901234567890123456789012345678' as Address,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400 * 8),
    isActive: true,
    propertyType: 0, // RESIDENTIAL
    location: 'Austin, Texas, USA',
    description: 'Spacious 4-bedroom family home in a thriving suburban community with excellent schools, parks, and growing tech industry presence. Features modern kitchen, large backyard, and home office space.',
    societalImpact: 'Makes suburban homeownership achievable for diaspora families seeking quality education and safe communities. Builds wealth through stable appreciation while providing foundations for family growth, educational excellence, and long-term community integration and prosperity.'
  }
]
