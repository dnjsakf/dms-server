import crypto from 'crypto';
import jwtUtil, { TOKEN_TYPE } from '../../utils/jwtUtil';
import { equalsEncrypt, decrypt } from '../../utils/cryptoUtil';
import redisUtil from '../../utils/redisUtil';
import UserService from './userService';

/**
 * 로그인 ID 중복 검사
 * @param {*} param0 
 * @returns 
 */
export const checkDuplicate = async ( loginId ) => {
  try {
    const found = await UserService.getDataLogin({ loginId });
    return {
      code: 200,
      data: {
        duplicated: !!found
      },
      message: "Dupplicate",
    }
  } catch ( error ){
    return {
      code: 401,
      data: null,
      message: error.message,
    }
  }
}

/**
 * 사용자 인증 처리
 * - 로그인 ID와 비밀번호를 사용하여 사용자를 인증
 * - 로그인 성공 시, 사용자 세션 정보를 저장
 * - 로그인 실패 시, 오류 메시지를 반환
 * @param {*} param0 
 * @returns 
 */
export const authenticate = async (loginId, loginPwd, { ip, agent, platform }) => {
  try {
    // 1.로그인 아이디로 사용자 탐색
    const found = await UserService.getDataLogin({ loginId });
    if( found ){
      const user = found.toJSON();
      const decryptedPwd = decrypt(loginPwd);
      // 2. 패스워드 비교
      if( equalsEncrypt(decryptedPwd, user.loginPwd) ) {
        const sessionData = {
          ...user,
          ip,
          agent,
          platform
        }

        // 3. 사용자 세션 정보 저장
        await saveUserSession(sessionData.userId, sessionData);

        // 4. 정상 응답
        return {
          code: 200,
          data: sessionData,
          message: "Accept Login"
        };
      } else {
        // 인증 실패 응답답
        return {
          code: 401,
          data: null,
          message: "Invalid credentials."
        };
      }
    }
    // 사용자를 찾을 수 없음
    return {
      code: 404,
      data: null,
      message: "Not found user."
    };
  } catch ( error ) {
    throw error;
  }
}

/**
 * 토큰 생성 처리
 * - AccessToken
 * - RefreshToken
 * - PayloadToken
 * @param {*} param0 
 * @returns 
 */
export const createToken = async ({ userId, platform }) => {
  try {
    // 1. 토큰에 저장할 정보
    const tokenData = {
      sub: userId,
      platform: platform,
    }

    // 2. 인증 토큰 발급
    const accessToken = jwtUtil.generateAccessToken(tokenData);
    const refreshToken = jwtUtil.generateRefreshToken(tokenData);

    // 3. 데이터 토큰 발급
    const decodedToken = jwtUtil.decode(accessToken);
    const payloadToken = jwtUtil.generatePayloadToken({
      userId: decodedToken.sub,
      exp: decodedToken.exp,
    });

    // 4. 저장소에 토큰 저장
    await saveAccessToken(userId, accessToken);
    await saveRefreshToken(userId, refreshToken);
    await savePayloadToken(userId, payloadToken);

    console.log('createdToken', {
      accessToken,
      refreshToken,
      payloadToken,
    })

    // 5. 정상 발급
    return {
      code: 200,
      data: {
        accessToken,
        refreshToken,
        payloadToken,
      },
      message: 'Token is generated',
    };
  } catch ( error ){
    console.log(error);
    // 토근 발급 오류
    return {
      code: 401,
      data: null,
      message: 'Token is ',
    };
  }
}

/**
 * Access Token 검증
 * @param {*} param0 
 * @returns 
 */
export const verifyAccessToken = async ({ accessToken }) => {
  return await verifyToken(TOKEN_TYPE.ACCESS_TOKEN, accessToken);
}

/**
 * Refresh Token 검증
 * @param {*} param0 
 * @returns 
 */
export const verifyRefreshToken = async ({ refreshToken }) => {
  return await verifyToken(TOKEN_TYPE.REFRESH_TOKEN, refreshToken);
}

/**
 * Token 검증 및 재발급
 * - 토큰 존재 여부 검증
 * - 토큰 자체 검증(만료시간, 유효성 검사 등)
 * - 토큰이 유효하면, 토큰에 저장된 정보를 기반으로 REDIS에서 탐색
 * - 저장된 토큰과 일치하지 않으면, 탈취된 토큰으로 간주
 * - 저장된 토큰과 일치하면, 정상
 * @param {*} param0 
 * @returns 
 */
export const verifyToken = async ( tokenType, checkToken ) => {
  // 1. 토큰 존재 여부 검증
  if( !checkToken ){
    return {
      code: 401,
      data: {
        verify: false,
        decoded: null,
      },
      message: 'Token is missing.',
    };
  }

  // 2. 토큰 자체 검증(만료시간, 유효성 검사 등)
  let decodedToken = null;
  try {
    decodedToken = jwtUtil.verify(tokenType, checkToken);
    if( !decodedToken ){
      return {
        code: 401,
        data: {
          verify: false,
          decoded: null,
        },
        message: 'Token is not valid.',
      };
    }
  } catch ( error ) {
    if (error.name === 'TokenExpiredError') {
      return {
        code: 401,
        data: {
          verify: false,
          decoded: null,
        },
        message: 'Token is expired'
      }
    }
    return {
      code: 401,
      data: {
        verify: false,
        decoded: null,
      },
      message: 'Token is not valid.',
    };
  }

  // 3. 토큰이 유효하면, 토큰에 저장된 정보를 기반으로 REDIS에서 탐색
  let storedToken = null;
  try {
    // 저장소에서 토큰 조회
    storedToken = await getToken(tokenType, decodedToken.sub);
    if( !storedToken ){
      return {
        code: 401,
        data: {
          verify: false,
          decoded: null,
        },
        message: 'Token is not found.',
      }
    }
    // 토큰 일치 여부 확인
    if( storedToken != checkToken ){
      return {
        code: 401,
        data: {
          verify: false,
          decoded: null,
        },
        message: 'Token is not valid usage.',
      }
    }
  } catch ( error ) {
    console.error(error);
    return {
      code: 401,
      data: {
        verify: false,
        decoded: null,
      },
      message: 'Token is not valid usage.',
    }
  }

  // 4. 검증 완료
  return {
    code: 200,
    data: {
      verify: true,
      decoded: decodedToken
    },
    message: 'Token is valid',
  };
}

/**
 * 토큰 초기화
 * @param {*} param0 
 */
export const clearSession = async ({ accessToken }) => {
  try {
    const decodedToken = await verifyAccessToken({ accessToken });
    if( decodedToken.code != 200 ){
      return decodedToken;
    }
    await delUserSession(decodedToken.sub);
    await delAccessToken(decodedToken.sub);
    await delRefreshToken(decodedToken.sub);
    await delPayloadToken(decodedToken.sub);
    return {
      code: 200,
      data: null,
      message: "Session cleared"
    }
  } catch ( error ){
    console.error(error);
    return {
      code: 500,
      data: null,
      message: error.message
    }
  }
}

// REDIS 키 생성
export const getHashedKey = (key) => (crypto.createHash('sha256').update(`${key}`).digest('hex'));
export const getUserSessionKey = (userId) => (`SESSION:USER:${getHashedKey(userId)}`.toUpperCase());
export const getAccessTokenKey = (userId) => (`SESSION:TOKEN:ACCESS:${getHashedKey(userId)}`.toUpperCase());
export const getRefreshTokenKey = (userId) => (`SESSION:TOKEN:REFRESH:${getHashedKey(userId)}`.toUpperCase());
export const getPayloadTokenKey = (userId) => (`SESSION:TOKEN:PAYLOAD:${getHashedKey(userId)}`.toUpperCase());
// REDIS 만료시간 설정(초 단위)
export const getUserSessionTTL = () => (7 * 24 * 60 * 60); // 7일
export const getAccessTokenTTL = () => (7 * 24 * 60 * 60); // 7일
export const getRefreshTokenTTL = () => (7 * 24 * 60 * 60); // 7일
export const getPayloadTokenTTL = () => (7 * 24 * 60 * 60); // 7일
// REDIS에 데이터 저장, 만료시간 설정
export const saveUserSession = (userId, value) => (redisUtil.setex(getUserSessionKey(userId), getUserSessionTTL(), JSON.stringify(value)));
export const saveAccessToken = (userId, value) => (redisUtil.setex((getAccessTokenKey(userId)), getAccessTokenTTL(), value));
export const saveRefreshToken = (userId, value) => (redisUtil.setex((getRefreshTokenKey(userId)), getRefreshTokenTTL(), value));
export const savePayloadToken = (userId, value) => (redisUtil.setex((getPayloadTokenKey(userId)), getPayloadTokenTTL(), value));
export const saveToken = (tokenType, userId, value) => {
  switch( tokenType ){
    case TOKEN_TYPE.ACCESS_TOKEN: return saveAccessToken(userId, value);
    case TOKEN_TYPE.REFRESH_TOKEN: return saveRefreshToken(userId, value);
    case TOKEN_TYPE.PAYLOAD_TOKEN: return savePayloadToken(userId, value);
    default: return null;
  }
}
// REDIS에 저장된 데이터 조회
export const getUserSession = (userId) => (redisUtil.getJSON(getUserSessionKey(userId))); // JSON
export const getAccessToken = (userId) => (redisUtil.get(getAccessTokenKey(userId))); // String
export const getRefreshToken = (userId) => (redisUtil.get(getRefreshTokenKey(userId))); // String
export const getPayloadToken = (userId) => (redisUtil.get(getPayloadTokenKey(userId))); // String
export const getToken = (tokenType, userId) => {
  switch( tokenType ){
    case TOKEN_TYPE.ACCESS_TOKEN: return getAccessToken(userId);
    case TOKEN_TYPE.REFRESH_TOKEN: return getRefreshToken(userId);
    case TOKEN_TYPE.PAYLOAD_TOKEN: return getPayloadToken(userId);
    default: return null;
  }
}
// REDIS에 저장된 데이터 삭제
export const delUserSession = (userId) => (redisUtil.del(getUserSessionKey(userId)));
export const delAccessToken = (userId) => (redisUtil.del(getAccessTokenKey(userId)));
export const delRefreshToken = (userId) => (redisUtil.del(getRefreshTokenKey(userId)));
export const delPayloadToken = (userId) => (redisUtil.del(getPayloadTokenKey(userId)));
export const delToken = (tokenType, userId) => {
  switch( tokenType ){
    case TOKEN_TYPE.ACCESS_TOKEN: return delAccessToken(userId);
    case TOKEN_TYPE.REFRESH_TOKEN: return delRefreshToken(userId);
    case TOKEN_TYPE.PAYLOAD_TOKEN: return delPayloadToken(userId);
    default: return null;
  }
}

export default {
  authenticate,
  createToken,

  checkDuplicate,
  
  verifyAccessToken,
  verifyRefreshToken,

  getUserSession,
  clearSession,
}

