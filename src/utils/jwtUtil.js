import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { client } from '../config/redisConfig';
import { loadEnv } from './envUtil';

loadEnv();

const JWT_STORE_PREFIX = "SESSION:TOKEN";
const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

/**
 * ip랑 agent로 세션 토큰 키 생성
 * -> platform 으로 토큰 키 생성
 * @param {*} data 
 * @returns 
 */
const generateUniqueKey = (data) => {
  // const hashed = crypto.createHash('sha256').update(`${data.ip}-${data.agent}`).digest('hex');
  // const redisKey = `${JWT_STORE_PREFIX}:${data.userId}:${hashed}`
  // return redisKey;
  // const hashed = crypto.createHash('sha256').update(`${data.ip}-${data.agent}`).digest('hex');
  const redisKey = `${JWT_STORE_PREFIX}:${data.sub}:${data.platform}`;
  return redisKey.toUpperCase();
}

/**
 * accessToken 유효 시간
 * @returns 
 */
const getAccessTokenTTL = () => {
  const ttl = 5 * 60; // 5분 (초 단위)
  return ttl;
}

/**
 * refreshToken 유효 시간
 * @returns 
 */
const getRefreshTokenTTL = () => {
  const ttl = 7 * 24 * 60 * 60; // 7일 (초 단위)
  return ttl;
}

/**
 * REDIS에 Refresh Token 저장
 * @param {*} data 
 * @param {*} token 
 */
export const setStoreToken = ( data, token ) => {
  const ttl = getRefreshTokenTTL();
  client.SETEX(generateUniqueKey(data), ttl, token);
}

/**
 * REDIS에 Refresh Token 저장
 * @param {*} data 
 * @param {*} token 
 */
export const getStoreToken = ( data ) => {
  return client.GET(generateUniqueKey(data));
}

/**
 * REDIS에 저장된 토큰 삭제
 */
export const delStoreToken = ( data ) => {
  return client.DEL(generateUniqueKey(data));
}

/**
 * accessToken 생성
 * @param {*} data 
 * @returns 
 */
export const generateAccessToken = ({
  sub,
  platform
}) => {
  const tokenData = {
    sub,
    platform,
  }
  const ttl = getAccessTokenTTL();
  const accessToken = jwt.sign(tokenData, JWT_ACCESS_SECRET_KEY, { expiresIn: ttl ||'30m' });;
  setStoreToken(tokenData, accessToken);
  return accessToken;
}

/**
 * refreshToken 생성
 * @param {*} data 
 * @returns 
 */
export const generateRefreshToken = ({
  sub,
  platform
}) => {
  const tokenData = {
    sub,
    platform,
  }
  const ttl = getRefreshTokenTTL();
  const refreshToken = jwt.sign(tokenData, JWT_REFRESH_SECRET_KEY, { expiresIn: ttl || '7d' });
  setStoreToken(tokenData, refreshToken);
  return refreshToken;
}

/**
 * accessToken 유효성 검사
 * @param {*} param0 
 * @returns 
 */
export const verifyAccessToken = async ({
  accessToken,
  ip,
  agent,
  platform
}) => {
  return new Promise((resolve, reject) => {
    if( !accessToken ){
      return reject('Token is required');
    }
    jwt.verify(accessToken, JWT_ACCESS_SECRET_KEY, async (err, data) => {
      if( err ){
        console.error(err);
        return reject('Invalid or expired token');
      }
      const redisData = await getUserSession({
        ...data,
        platform
      });
      if( !redisData ){
        return reject('Invalid Token.');
      }
      if( redisData.platform != platform ){
        return reject('Invalid Platform.');
      }
      if( redisData.ip != ip ){
        return reject('Invalid IP Addres.');
      }
      if( redisData.agent != agent ){
        return reject('Invalid Agent.');
      }
      // const checkA = crypto.createHash('sha256').update(`${redisData.ip}-${redisData.agent}`).digest('hex');
      // const checkB = crypto.createHash('sha256').update(`${ip}-${agent}`).digest('hex');
      // if( checkA !== checkB ){
      //   return reject('Invalid Agent.');
      // }
      return resolve(redisData);
    });
  });
}

/**
 * refreshToken 유효성 검사 및 accessToken 재발급
 * @param {*} param0 
 * @returns 
 */
export const verifyRefreshToken = async ({
  refreshToken,
  ip,
  agent,
  platform
}) => {
  return new Promise((resolve, reject) => {
    if( !refreshToken ){
      return reject({
        code: 400,
        message: 'Refresh token is required',
      });
    }
    jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY, async (err, data) => {
      if( err ){
        console.error(err);
        return reject({
          code: 403,
          message: 'Invalid or expired refresh token.',
        });
      }
      const redisData = await getUserSession({
        ...data,
        platform
      });
      try {
        if( !redisData ){
          return reject('Invalid Token.');
        }
        if( redisData.platform != platform ){
          return reject('Invalid Platform.');
        }
        if( redisData.ip != ip ){
          return reject('Invalid IP Addres.');
        }
        if( redisData.agent != agent ){
          return reject('Invalid Agent.');
        }
        // const checkA = crypto.createHash('sha256').update(`${redisData.ip}-${redisData.agent}`).digest('hex');
        // const checkB = crypto.createHash('sha256').update(`${ip}-${agent}`).digest('hex');
        // if( checkA === checkB ){
        //   return reject({
        //     code: 403,
        //     message: 'Invalid Agent.'
        //   });
        // }
        const storeToken = await getStoreToken(data);
        if( storeToken !== refreshToken ){
          return reject({
            code: 403,
            message: 'Invalid refresh token.'
          });
        }
        delete data.exp; // 만료시간
        delete data.iat; // 시작시간

        const accessToken = generateAccessToken(data);
        return resolve(accessToken);
      } catch ( error ){
        return reject(error);
      }
    });
  });
}

export const clearToken = async ({ accessToken }) => {
  const decoded = jwt.decode(accessToken);
  return delStoreToken(decoded);
}

export const getUserSessionKey = ({ sub, platform }) => {
  const redisKey = `SESSION:USER:${sub}:${platform}`;
  return redisKey.toUpperCase();
}
export const getUserSession = async ( data ) => {
  const redisKey = getUserSessionKey(data);
  let redisData = await client.GET(redisKey);
  if( redisData?.length > 0 ) {
    try {
      return JSON.parse(redisData);
    } catch ( e ){
      console.error(e);
    }
  }
  return null;
}
export const addUserSession = async ( data ) => {
  const redisKey = getUserSessionKey(data);
  const ttl = getAccessTokenTTL();
  await client.SETEX(redisKey, ttl, JSON.stringify(data));
}
export const delUserSession = async ( data ) => {
  const redisKey = getUserSessionKey(data);
  return await client.DEL(redisKey);
}

export const logout = async ({
  accessToken,
  ip,
  agent,
  platform,
}) => {
  // 토큰 검증
  const data = await verifyAccessToken({
    accessToken,
    ip,
    agent,
    platform,
  });
  // 토큰 삭제
  await delStoreToken(data);
  // 세션 삭제
  await delUserSession(data);
}

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  clearToken,

  logout,
  addUserSession,
}