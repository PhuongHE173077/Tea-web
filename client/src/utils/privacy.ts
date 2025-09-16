/**
 * Utility functions for privacy and data masking
 */

/**
 * Mask phone number for privacy
 * Format: Show first 2 digits + ***** + last 2 digits
 * Example: "0123456789" → "01*****89"
 */
export const maskPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber || phoneNumber.length < 4) {
    return phoneNumber
  }

  // Remove any non-digit characters
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  
  if (cleanPhone.length < 4) {
    return phoneNumber
  }

  const firstTwo = cleanPhone.slice(0, 2)
  const lastTwo = cleanPhone.slice(-2)
  const maskedMiddle = '*'.repeat(Math.max(5, cleanPhone.length - 4))
  
  return `${firstTwo}${maskedMiddle}${lastTwo}`
}

/**
 * Mask email address for privacy
 * Format: Show first 2 chars + *** + @ + domain
 * Example: "user@example.com" → "us***@example.com"
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) {
    return email
  }

  const [localPart, domain] = email.split('@')
  
  if (localPart.length <= 2) {
    return email
  }

  const maskedLocal = localPart.slice(0, 2) + '***'
  return `${maskedLocal}@${domain}`
}

/**
 * Mask address for privacy
 * Format: Show first part + *** + last part
 * Example: "123 Nguyen Van A Street, Ward 1, District 1" → "123 Nguyen*** District 1"
 */
export const maskAddress = (address: string): string => {
  if (!address || address.length < 20) {
    return address
  }

  const parts = address.split(',')
  if (parts.length < 2) {
    // If no comma, mask middle part
    const words = address.trim().split(' ')
    if (words.length <= 3) {
      return address
    }
    
    const firstPart = words.slice(0, 2).join(' ')
    const lastPart = words.slice(-2).join(' ')
    return `${firstPart} *** ${lastPart}`
  }

  // If has comma, show first part and last part
  const firstPart = parts[0].trim()
  const lastPart = parts[parts.length - 1].trim()
  
  return `${firstPart}, ***, ${lastPart}`
}

/**
 * Mask name for privacy
 * Format: Show first name + *** + last name
 * Example: "Nguyen Van A" → "Nguyen *** A"
 */
export const maskName = (name: string): string => {
  if (!name) {
    return name
  }

  const words = name.trim().split(' ')
  if (words.length <= 2) {
    return name
  }

  const firstName = words[0]
  const lastName = words[words.length - 1]
  
  return `${firstName} *** ${lastName}`
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj)
}
