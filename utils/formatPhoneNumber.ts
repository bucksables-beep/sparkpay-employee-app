/**
 * Formats a phone number string to a readable format
 * Supports Nigerian phone numbers: +234 801 234 5678 or 0801 234 5678
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, "");

  // If empty, return empty string
  if (!cleaned) return "";

  // Handle numbers starting with +234 (Nigerian country code)
  if (cleaned.startsWith("+234")) {
    const digits = cleaned.slice(4); // Remove +234
    if (digits.length === 0) return "+234";
    if (digits.length <= 3) return `+234 ${digits}`;
    if (digits.length <= 6)
      return `+234 ${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `+234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
      6,
      10
    )}`;
  }

  // Handle numbers starting with 234 (without +)
  if (cleaned.startsWith("234") && cleaned.length > 3) {
    const digits = cleaned.slice(3);
    if (digits.length === 0) return "234";
    if (digits.length <= 3) return `234 ${digits}`;
    if (digits.length <= 6)
      return `234 ${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `234 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
      6,
      10
    )}`;
  }

  // Handle numbers starting with 0 (local format)
  if (cleaned.startsWith("0")) {
    const digits = cleaned;
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  }

  // Handle numbers starting with + (other country codes)
  if (cleaned.startsWith("+")) {
    return cleaned; // Return as-is for other country codes
  }

  // Handle other numbers (no country code)
  if (cleaned.length <= 4) return cleaned;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
    7,
    11
  )}`;
};

/**
 * Normalizes a phone number by removing formatting (spaces, dashes, etc.)
 * Keeps only digits and the + sign
 */
export const normalizePhoneNumber = (value: string): string => {
  return value.replace(/[^\d+]/g, "");
};
