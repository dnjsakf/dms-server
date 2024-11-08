import jwtUtil from '../../utils/jwtUtil';
import { equalsEncrypt, decrypt } from '../../utils/cryptoUtil';

import UserService from './userService';

export const authenticate = async ( params ) => {
  try {
    const found = await UserService.getDataLogin(params);
    if( found ){
      const user = found.toJSON();
      const decryptedPwd = decrypt(params.loginPwd);
      if( equalsEncrypt(decryptedPwd, user.loginPwd) ) {
        const tokenData = {
          userId: user.userId,
          loginId: user.loginId,
          name: user.name,
          ip: params.ip,
          agent: params.agent,
        }
        const accessToken = jwtUtil.generateAccessToken(tokenData);
        const refreshToken = jwtUtil.generateRefreshToken(tokenData);        
        return {
          code: 200,
          data: {
            accessToken,
            refreshToken,
          },
          message: "Success"
        };
      } else {
        return {
          code: 401,
          data: null,
          message: "Invalid credentials."
        };
      }
    } 
    return {
      code: 404,
      data: null,
      message: "Not found user."
    };
  } catch ( error ) {
    throw error;
  }
}

export const checkDuplicate = async ( params ) => {
  try {
    const found = await UserService.getDataLogin(params);
    return !!found;
  } catch ( error ){
    throw error;
  }
}

export const generateToken = async ( params ) => {
  try {
    const data = await jwtUtil.verifyRefreshToken(params);
    return {
      verify: true,
      data: {
        accessToken: data,
      },
      message: 'Regenerated accessToken.',
    };
  } catch ( error ){
    console.log(error);
    return {
      verify: false,
      data: null,
      message: error,
    };
  }
}

export const verifyToken = async ( params ) => {
  try {
    const data = await jwtUtil.verifyAccessToken(params);
    return {
      verify: true,
      data: data,
      message: 'Token is valid',
    };
  } catch ( error ){
    return {
      verify: false,
      data: null,
      message: error,
    };
  }
}

export const clearToken = async ( params ) => {
  try {
    await jwtUtil.clearToken(params);
  } catch ( error ){
    console.error(error);
  }
}

export default {
  authenticate,
  checkDuplicate,
  generateToken,
  verifyToken,
  clearToken,
}

