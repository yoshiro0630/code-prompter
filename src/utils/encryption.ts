export const encryptData = (data: string): string => {
  if (!data) return '';
  try {
    return btoa(data);
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

export const decryptData = (encryptedData: string): string => {
  if (!encryptedData) return '';
  try {
    return atob(encryptedData);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

export const validateApiKey = (key: string): boolean => {
  const sanitizedKey = key.trim();
  return sanitizedKey.startsWith('sk-') && sanitizedKey.length > 20;
};