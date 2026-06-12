/**
 * Utility functions for frontend credit card validation.
 * 
 * Provides functions to validate card numbers using the Luhn algorithm,
 * detect card brands and validate their lengths, and check expiry dates.
 */

/**
 * 1. Luhn algorithm checks
 * Evaluates a credit card number to verify it passes the Luhn formula.
 *
 * @param {string} cardNumber - The card number, potentially containing spaces or dashes.
 * @returns {boolean} - True if the card passes the Luhn check, false otherwise.
 */
export function validateLuhn(cardNumber) {
  // Remove spaces, dashes, and any non-digit characters
  const sanitized = cardNumber.replace(/\D/g, '');
  if (!sanitized) return false;

  let sum = 0;
  let isSecond = false;

  // Loop through digits from right to left
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);

    // Double every second digit
    if (isSecond) {
      digit *= 2;
      // If doubling results in a number > 9, subtract 9 (equivalent to adding the two digits)
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isSecond = !isSecond;
  }

  // The card is valid if the sum is a multiple of 10
  return sum % 10 === 0;
}

/**
 * 2. Card brand detection + length check
 * Identifies the card brand based on the Bank Identification Number (BIN)
 * and verifies if the length is appropriate for that brand.
 *
 * @param {string} cardNumber - The raw card number string.
 * @returns {string} - The brand name, the brand name with " (invalid length)", or "Unknown".
 */
export function getCardBrandAndValidateLength(cardNumber) {
  const sanitized = cardNumber.replace(/\D/g, '');
  const length = sanitized.length;

  if (length === 0) return 'Unknown';

  // Define brand rules: name, regex pattern for IIN/BIN, and array of valid lengths
  const brands = [
    {
      name: 'Visa',
      // Starts with 4
      pattern: /^4/,
      validLengths: [13, 16, 19],
    },
    {
      name: 'Mastercard',
      // Starts with 51-55 or 2221-2720
      pattern: /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[0-1]\d|2720)/,
      validLengths: [16],
    },
    {
      name: 'American Express',
      // Starts with 34 or 37
      pattern: /^3[47]/,
      validLengths: [15],
    },
    {
      name: 'Discover',
      // Starts with 6011, 65, or 644-649
      pattern: /^(6011|65|64[4-9])/,
      validLengths: [16, 19],
    },
    {
      name: 'Diners Club',
      // Starts with 300-305, 36, or 38
      pattern: /^(30[0-5]|36|38)/,
      validLengths: [14],
    },
    {
      name: 'JCB',
      // Starts with 3528-3589
      pattern: /^(352[8-9]|35[3-8]\d)/,
      validLengths: [16, 19],
    },
  ];

  for (const brand of brands) {
    if (brand.pattern.test(sanitized)) {
      if (brand.validLengths.includes(length)) {
        return brand.name;
      } else {
        return `${brand.name} (invalid length)`;
      }
    }
  }

  return 'Unknown';
}

/**
 * 3. Expiry date validation
 * Validates a two-digit month and two-digit year.
 *
 * @param {string} month - Two-digit month (e.g., "01" to "12")
 * @param {string} year - Two-digit year (e.g., "26")
 * @returns {boolean} - True if the expiry date is valid and not in the past.
 */
export function validateExpiryDate(month, year) {
  // Basic format check: must be two digits
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
    return false;
  }

  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  // Month must be between 1 and 12
  if (m < 1 || m > 12) {
    return false;
  }

  // Get current date parts
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth is 0-indexed

  // Convert 2-digit year to 4-digit year. 
  // Assuming 2000s for expiry dates (20XX).
  const expiryYear = 2000 + y;

  // Date is in the past (prior year)
  if (expiryYear < currentYear) {
    return false;
  }

  // Date is in the current year, but a prior month
  if (expiryYear === currentYear && m < currentMonth) {
    return false;
  }

  // Otherwise, it's valid (current month or future)
  return true;
}
