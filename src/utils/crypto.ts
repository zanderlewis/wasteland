// Fallout Shelter encryption key and IV
const ENCRYPTION_KEY = [
  2815074099, 1725469378, 4039046167, 874293617, 3063605751, 3133984764, 4097598161, 3620741625,
];

const IV_HEX = "7475383967656A693334307438397532";

/**
 * Convert the integer array key to its big-endian byte representation.
 */
function keyToBytes(keyArray: number[]): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(keyArray.length * 4));
  const view = new DataView(bytes.buffer);

  for (let i = 0; i < keyArray.length; i++) {
    view.setUint32(i * 4, keyArray[i], false);
  }

  return bytes;
}

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(new ArrayBuffer(hex.length / 2));

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(base64);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

/**
 * Decrypt a Fallout Shelter save file
 * @param base64Data - The base64 encoded encrypted save data
 * @returns The decrypted JSON string
 */
export async function decryptSaveFile(base64Data: string): Promise<string> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      keyToBytes(ENCRYPTION_KEY),
      { name: "AES-CBC" },
      false,
      ["decrypt"],
    );
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: hexToBytes(IV_HEX) },
      key,
      base64ToBytes(base64Data),
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    throw new Error(`Failed to decrypt save file: ${error}`);
  }
}

/**
 * Encrypt a Fallout Shelter save file
 * @param jsonData - The JSON object to encrypt
 * @returns The base64 encoded encrypted data
 */
export async function encryptSaveFile(jsonData: object): Promise<string> {
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      keyToBytes(ENCRYPTION_KEY),
      { name: "AES-CBC" },
      false,
      ["encrypt"],
    );
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-CBC", iv: hexToBytes(IV_HEX) },
      key,
      new TextEncoder().encode(JSON.stringify(jsonData)),
    );

    return bytesToBase64(new Uint8Array(encrypted));
  } catch (error) {
    throw new Error(`Failed to encrypt save file: ${error}`);
  }
}

/**
 * Validate if a string is valid JSON
 * @param str - String to validate
 * @returns True if valid JSON, false otherwise
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
