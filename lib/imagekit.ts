export function getImageKitConfig() {
  return {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
  };
}

export function buildImageKitUploadUrl() {
  const { urlEndpoint } = getImageKitConfig();
  if (!urlEndpoint) return '';
  return urlEndpoint.replace(/\/$/, '') + '/';
}
