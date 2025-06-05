import jwtUtil from '../../utils/jwtUtil';
import { client } from '../../config/redisConfig';
import { equalsEncrypt, decrypt } from '../../utils/cryptoUtil';

import UserService from './userService';

export const authenticate = async ({
  loginId,
  loginPwd,
  ip,
  agent,
  platform,
}) => {
  try {
    const found = await UserService.getDataLogin({ loginId });
    if( found ){
      const user = found.toJSON();
      const decryptedPwd = decrypt(loginPwd);
      if( equalsEncrypt(decryptedPwd, user.loginPwd) ) {
        const tokenData = {
          sub: user.userId,
          platform: platform,
        }
        const accessToken = jwtUtil.generateAccessToken(tokenData);
        const refreshToken = jwtUtil.generateRefreshToken(tokenData);

        // 사용자 세션 정보 등록
        await jwtUtil.addUserSession({
          ...user,
          ...tokenData,
          // 접속 플랫폼 검증용
          ip: ip,
          agent: agent,
        });

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

export const checkDuplicate = async ({ loginId }) => {
  try {
    const found = await UserService.getDataLogin({ loginId });
    return !!found;
  } catch ( error ){
    throw error;
  }
}

export const generateToken = async ({
  refreshToken,
  ip,
  agent,
  platform
}) => {
  try {
    const data = await jwtUtil.verifyRefreshToken({
      refreshToken,
      ip,
      agent,
      platform
    });
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

export const verifyToken = async ({
  accessToken,
  ip,
  agent,
  platform
}) => {
  try {
    const data = await jwtUtil.verifyAccessToken({
      accessToken,
      ip,
      agent,
      platform
    });
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

export const logout = async ( params ) => {
  try {
    await jwtUtil.logout(params);
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
  logout,
}

