import { client } from '../config/redisConfig';

export const setex = async ( key, ttl, value ) => {
  return await client.SETEX(key, ttl, value);
}
export const get = async ( key, dv ) => {
  const value = await client.GET(key);
  if( value == null || value == undefined ){
    return dv;
  }
  return value;
}
export const getJSON = async ( key, dv ) => {
  const value = await client.GET(key);
  if( value == null || value == undefined ){
    return dv;
  }
  try {
    return JSON.parse(value);
  } catch ( error ) {
    console.error(`Error parsing JSON from Redis key ${key}:`, error);
    return dv;
  }
}
export const del = async ( key ) => {
  return await client.DEL(key);
}

export default {
  setex,
  get,
  getJSON,
  del,
}