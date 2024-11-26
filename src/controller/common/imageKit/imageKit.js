import envConfig from '../../../env/env.json';

export const urlEndpoint = envConfig.IMAGEKIT_URLENDPOINT;
export const publicKey = envConfig.IMAGEKIT_PUBLICKEY;
export const authenticationEndpoint = envConfig.IMAGEKIT_AUTHENTICATIONENTPOINT;
export const authenticator = async () => {
  const response = await fetch(authenticationEndpoint);
  const data = await response.json();
  const { signature, expire, token } = data;
  return { signature, expire, token };
};
