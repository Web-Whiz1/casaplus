export function getImageKitConfig() {
  return {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || process.env.NEXT_PUBLIC_IMAGEKIT_URL || '',
  };
}

export function buildImageKitUploadUrl() {
  const { urlEndpoint } = getImageKitConfig();
  if (!urlEndpoint) return '';
  return urlEndpoint.replace(/\/$/, '') + '/';
}
