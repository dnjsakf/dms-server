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
 * @param {*} data 
 * @returns 
 */
const generateUniqueKey = (data) => {
  const hashed = crypto.createHash('sha256').update(`${data.ip}-${data.agent}`).digest('hex');
  const redisKey = `${JWT_STORE_PREFIX}:${data.userId}:${hashed}`
  return redisKey;
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
export const generateAccessToken = ( data ) => {
  const ttl = getAccessTokenTTL();
  return jwt.sign(data, JWT_ACCESS_SECRET_KEY, { expiresIn: ttl ||'30m' });
}

/**
 * refreshToken 생성
 * @param {*} data 
 * @returns 
 */
export const generateRefreshToken = ( data ) => {
  const ttl = getRefreshTokenTTL();
  const refreshToken = jwt.sign(data, JWT_REFRESH_SECRET_KEY, { expiresIn: ttl || '7d' });
  setStoreToken(data, refreshToken);
  return refreshToken;
}

/**
 * accessToken 유효성 검사
 * @param {*} param0 
 * @returns 
 */
export const verifyAccessToken = async ({ accessToken, ip, agent }) => {
  return new Promise((resolve, reject) => {
    if( !accessToken ){
      return reject('Token is required');
    }
    jwt.verify(accessToken, JWT_ACCESS_SECRET_KEY, async (err, data) => {
      if( err ){
        console.error(err);
        return reject('Invalid or expired token');
      }
      if( data.ip !== ip || data.agent !== agent ){
        return reject('Invalid agent.');
      }
      return resolve(data);
    });
  });
}

/**
 * refreshToken 유효성 검사 및 accessToken 재발급
 * @param {*} param0 
 * @returns 
 */
export const verifyRefreshToken = async ({ refreshToken, ip, agent }) => {
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
      try {
        if( data.ip !== ip || data.agent !== agent ){
          return reject({
            code: 403,
            message: 'Invalid agent.'
          });
        }
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

export const clearToken = async ({ accessToken, refreshToken }) => {
  const decoded = jwt.decode(accessToken);
  console.log(decoded);
  return delStoreToken(decoded);
}

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  clearToken,
}