import * as CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.SECRET_KEY_ENCRYPTION || 'mySecretKey12345';

if (!SECRET_KEY || SECRET_KEY.length < 16) {
  throw new Error('Encryption key must be at least 16 characters long.');
}

/**
 * Encrypts a plain text string using AES encryption.
 * @param value - The plain text to encrypt.
 * @returns The encrypted string in hex format.
 */
export const encrypt = (value: string): string => {
  if (!value) throw new Error('Value must not be null or undefined.');
  const encrypted = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
  return CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Hex); // Convert Base64 to Hex
};

/**
 * Decrypts a hex-encoded encrypted string back to plain text.
 * @param value - The encrypted hex string.
 * @returns The decrypted plain text.
 */
export const decrypt = (value: string): string => {
  if (!value) throw new Error('Value must not be null or undefined.');
  const encryptedBase64 = CryptoJS.enc.Hex.parse(value).toString(CryptoJS.enc.Base64);
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, SECRET_KEY);
  const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

  if (!decryptedText) throw new Error('Failed to decrypt. The input might be invalid.');

  return decryptedText;
};
