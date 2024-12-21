const encoder = new TextEncoder();

/**
 * Generate random salt as Uint8Array
 * @returns {Uint8Array}
 */
export function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

/**
 * Hash a password using PBKDF2
 * @param {string} password
 * @param {Uint8Array} salt
 * @returns {Promise<string>} - Hex encoded hash
 */
export async function hashPassword(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    256
  );

  return bufferToHex(derivedBits);
}

/**
 * Verify a password against its hash and salt
 * @param {string} password
 * @param {string} hashedPassword
 * @param {Uint8Array} salt
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hashedPassword, salt) {
  const computedHash = await hashPassword(password, salt);
  return computedHash === hashedPassword;
}

/**
 * Convert ArrayBuffer to Hex string
 * @param {ArrayBuffer} buffer
 * @returns {string}
 */
export function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Convert Hex string back to Uint8Array
 * @param {string} hex
 * @returns {Uint8Array}
 */
export function hexToBuffer(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
