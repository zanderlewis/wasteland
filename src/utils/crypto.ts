import CryptoJS from 'crypto-js';

// Fallout Shelter encryption key and IV (from original code)
const ENCRYPTION_KEY = [
  2815074099, 1725469378, 4039046167, 874293617,
  3063605751, 3133984764, 4097598161, 3620741625
];

const IV_HEX = "7475383967656A693334307438397532";

/**
 * Convert the integer array key to a format usable by CryptoJS
 */
function keyToWordArray(keyArray: number[]): CryptoJS.lib.WordArray {
  const words: number[] = [];
  for (let i = 0; i < keyArray.length; i++) {
    words[i] = keyArray[i];
  }
  return CryptoJS.lib.WordArray.create(words);
}

/**
 * Decrypt a Fallout Shelter save file
 * @param base64Data - The base64 encoded encrypted save data
 * @returns The decrypted JSON string
 */
export function decryptSaveFile(base64Data: string): string {
  try {
    const key = keyToWordArray(ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Hex.parse(IV_HEX);
    
    const decrypted = CryptoJS.AES.decrypt(base64Data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error(`Failed to decrypt save file: ${error}`);
  }
}

/**
 * Encrypt a Fallout Shelter save file
 * @param jsonData - The JSON object to encrypt
 * @returns The base64 encoded encrypted data
 */
export function encryptSaveFile(jsonData: object): string {
  try {
    const key = keyToWordArray(ENCRYPTION_KEY);
    const iv = CryptoJS.enc.Hex.parse(IV_HEX);
    
    const jsonString = JSON.stringify(jsonData);
    
    const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return encrypted.toString();
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
