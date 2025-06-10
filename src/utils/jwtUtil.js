import jwt from 'jsonwebtoken';
import { loadEnv } from './envUtil';

loadEnv();

const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
const JWT_PAYLOAD_SECRET_KEY = process.env.JWT_PAYLOAD_SECRET_KEY;

/**
 * 토큰 관련 상수
 */
export const TOKEN_TYPE = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  PAYLOAD_TOKEN: 'payloadToken',
  ACCESS_EXPIRED_IN: '5m',
  REFRESH_EXPIRED_IN: '7d',
  PAYLOAD_EXPIRED_IN: '5m',
}

/**
 * accessToken 생성, 인증에 필요한 최소 데이터만 저장
 * @param {*} tokenData 인즈 토큰에 포함할 데이터, EX: { sub: 'ANONYMOUS', platform: 'DESKTOP' }
 * @param {*} expiresIn default: 5분
 * @returns 
 */
export const generateAccessToken = ({ sub, platform }, expiresIn=TOKEN_TYPE.ACCESS_EXPIRED_IN) => {
  return jwt.sign({ sub, platform }, JWT_ACCESS_SECRET_KEY, { expiresIn: expiresIn || (5 * 60) });
}
/**
 * refreshToken 생성, 인증에 필요한 최소 데이터만 저장
 * @param {*} tokenData 리프레시 토큰에 포함할 데이터, EX: { sub: 'ANONYMOUS', platform: 'DESKTOP' }
 * @param {*} expiresIn default: 7일
 * @returns 
 */
export const generateRefreshToken = ({ sub, platform }, expiresIn=TOKEN_TYPE.REFRESH_EXPIRED_IN) => {
  return jwt.sign({ sub, platform }, JWT_REFRESH_SECRET_KEY, { expiresIn: expiresIn || (7 * 24 * 60 * 60) });
}
/**
 * payloadToken 생성, 로그인 후 Client에 전송 할 데이터 저장
 * - 만료시간은 AccessToken과 동일하게 설정
 * @param {*} tokenData 페이로드 토큰에 포함할 데이터, EX: { username: 'Admin', roles: ['ADMIN', 'USER'], platform: 'DESKTOP' }
 * @param {*} expiresIn default: AccessToken 값
 * @returns 
 */
export const generatePayloadToken = (tokenData, expiresIn=TOKEN_TYPE.PAYLOAD_EXPIRED_IN) => {
  const opts = { expiresIn }
  const data = { ...tokenData }
  if( typeof expiresIn == 'number' ){
    data.exp = expiresIn;
  }
  if ( data.hasOwnProperty('exp') ){
    delete opts.expiresIn;
  }
  return jwt.sign(data, JWT_PAYLOAD_SECRET_KEY, opts);
}

export const verify = ( type, token ) => {
  switch( type ){
    case TOKEN_TYPE.ACCESS_TOKEN: return jwt.verify(token, JWT_ACCESS_SECRET_KEY);
    case TOKEN_TYPE.REFRESH_TOKEN: return jwt.verify(token, JWT_REFRESH_SECRET_KEY);
    case TOKEN_TYPE.PAYLOAD_TOKEN: return jwt.verify(token, JWT_PAYLOAD_SECRET_KEY);
    default: return jwt.verify(token, JWT_ACCESS_SECRET_KEY);
  }
}

export const decode = ( token, opt ) => {
  return jwt.decode(token, opt);
}

export default {
  generatePayloadToken,
  generateAccessToken,
  generateRefreshToken,

  verify,
  decode,
}