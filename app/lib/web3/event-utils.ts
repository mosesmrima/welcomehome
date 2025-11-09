/**
 * Event parsing utilities for smart contract events
 */

import { Address, keccak256, toHex } from 'viem'

/**
 * Calculate event topic hash from event signature
 */
export function getEventTopic(eventSignature: string): string {
  return keccak256(toHex(eventSignature))
}

/**
 * Extract address from indexed bytes32 parameter
 * Indexed addresses are left-padded with zeros to 32 bytes
 */
export function extractAddressFromTopic(topic: string): Address {
  // Remove '0x' prefix if present
  const cleanTopic = topic.startsWith('0x') ? topic.slice(2) : topic
  // Take last 40 characters (20 bytes = address)
  const address = `0x${cleanTopic.slice(-40)}` as Address
  return address
}

/**
 * Extract PropertyCreated event data from transaction logs
 */
export function extractPropertyCreatedEvent(logs: any[]): {
  propertyId: bigint
  tokenContract: Address
  creator: Address
} | null {
  if (!logs || logs.length === 0) {
    console.log('No logs found in transaction receipt')
    return null
  }

  // PropertyCreated(uint256 indexed propertyId, string name, address indexed tokenContract, address indexed creator)
  const eventSignature = 'PropertyCreated(uint256,string,address,address)'
  const eventTopic = getEventTopic(eventSignature)

  console.log('Looking for PropertyCreated event with topic:', eventTopic)

  const propertyCreatedLog = logs.find(
    (log: any) => log.topics && log.topics[0] === eventTopic
  )

  if (!propertyCreatedLog || !propertyCreatedLog.topics) {
    console.log('PropertyCreated event not found in logs')
    return null
  }

  console.log('Found PropertyCreated event:', propertyCreatedLog)

  // topics[0] = event signature hash
  // topics[1] = propertyId (indexed uint256)
  // topics[2] = tokenContract (indexed address)
  // topics[3] = creator (indexed address)

  if (propertyCreatedLog.topics.length < 4) {
    console.error('PropertyCreated event has insufficient topics:', propertyCreatedLog.topics)
    return null
  }

  try {
    const propertyId = BigInt(propertyCreatedLog.topics[1])
    const tokenContract = extractAddressFromTopic(propertyCreatedLog.topics[2])
    const creator = extractAddressFromTopic(propertyCreatedLog.topics[3])

    console.log('Extracted PropertyCreated data:', {
      propertyId: propertyId.toString(),
      tokenContract,
      creator,
    })

    return {
      propertyId,
      tokenContract,
      creator,
    }
  } catch (error) {
    console.error('Error parsing PropertyCreated event:', error)
    return null
  }
}

/**
 * Alternative method: Extract token contract from property array index
 * This can be used if event parsing fails
 */
export function extractTokenContractFromPropertyId(
  propertyFactoryContract: any,
  propertyId: bigint
): Promise<Address | null> {
  return propertyFactoryContract
    .getProperty(propertyId)
    .then((property: any) => {
      console.log('Property data from contract:', property)
      return property.tokenContract as Address
    })
    .catch((error: any) => {
      console.error('Failed to get property from contract:', error)
      return null
    })
}