import { Magic } from 'magic-sdk';

export const magic = new Magic(process.env.MAGIC_PUB_KEY, {
  network: {
    rpcUrl: 'https://rpc-magic.magic.link/'
  }
});