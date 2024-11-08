import { createClient } from 'redis';
import RedisStore from 'connect-redis';

import { loadEnv } from '../utils/envUtil';
import { decrypt } from '../utils/cryptoUtil';

loadEnv();

export const client = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD && decrypt(process.env.REDIS_PASSWORD),
});

export const connectRedis = () => {
  console.log("Redis Props:", {
    url: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD && decrypt(process.env.REDIS_PASSWORD),
  });

  client.connect()
    .then(()=>{
      console.log('Redis connected');
    })
    .catch(console.error);

  const store = new RedisStore({
    client: client,
    prefix: "MYAPP:SESSION:"
  });

  return store;
}
 
export default {
  client,
  connectRedis,
}
