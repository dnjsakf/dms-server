import { getPath } from '../../utils/pathUtil';

import AuthService from '../../services/common/AuthService';
import UserService from '../../services/common/UserService';

import CommUserModel from '../../models/common/commUserModel';

export const getLogin = async (req, res) => {
  try {
    res.sendFile(getPath('public', 'login.html'));
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export const getRegister = async (req, res) => {
  try {
    res.sendFile(getPath('public', 'register.html'));
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

/**
 * 로그인 처리
 * - 로그인 정보 유효성 검사
 * - 로그인 성공 시, 토큰 발행
 * - 토큰 발행 성공 시, 쿠키에 저장
 * @param {*} req 
 * @param {*} res 
 */
export const postLogin = async (req, res) => {
  try {
    // 1. 로그인 정보 유효성 검사
    const accepted = await AuthService.authenticate(req.body.loginId, req.body.loginPwd, req.data);
    if( accepted.code !== 200 ){
      return res.status(accepted.code).json({
        code: accepted.code,
        data: null,
        message: accepted.message,
      });
    }

    // 2. 로그인 성공 시, 토큰 발행
    const resToken = await AuthService.createToken(accepted.data);
    if( resToken.code !== 200 ){
      return res.status(resToken.code).json({
        code: resToken.code,
        data: null,
        message: resToken.message,
      });
    }

    // 3. 토큰 발행 성공 시, 쿠키에 저장
    addTokenCookies(res, resToken.data);

    // 4. 로그인 정상 처리
    res.status(200).json({
      code: 200,
      data: {
        loggedIn: true,
      },
      message: 'Success'
    });
  } catch ( error ) {
    // 로그인 실패 시, 에러 메시지 반환
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

/**
 * 로그아웃 처리
 * @param {*} req 
 * @param {*} res 
 */
export const postLogout = async (req, res) => {
  try {
    // 1. 로그아웃 시, REDIS 토큰/세션 삭제
    await AuthService.clearSession(req.data);

    clearTokenCookies(res);

    res.status(200).json({
      code: 200,
      data: null,
      message: "Success",
    });
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

/**
 * 로그인 ID 중복 검사
 * @param {*} req 
 * @param {*} res 
 */
export const postCheckDuplicate = async (req, res) => {
  try {
    // 1. 요청 데이터 유효성 검사
    const user = CommUserModel.build({
      loginId: req.body.loginId,
    }).toJSON();

    // 2. 로그인 ID 중복 검사
    const resDup = await AuthService.checkDuplicate(user.loginId);
    if( resDup.code !== 200 ){
      return res.status(resDup.code).json({
        code: resDup.code,
        data: null,
        message: resDup.message,
      });
    }

    // 3. 중복 검사 결과 반환
    res.status(200).json({
      code: 200,
      data: {
        duplicated: !!resDup.data?.duplicated,
      },
      message: "Success",
    });
  } catch ( error ){
    // 3. 오류 발생 시, 에러 메시지 반환
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

/**
 * 회원가입 처리
 * @param {*} req 
 * @param {*} res 
 */
export const postRegister = async (req, res) => {
  try {
    const newUser = await UserService.createData(req.body);
    res.status(200).json({
      code: 200,
      data: {
        user: newUser,
      },
      message: "Success",
    });
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

/**
 * 인증 토큰 유효성 검사
 * @param {*} req 
 * @param {*} res 
 */
export const postTokenVerify = async (req, res) => {
  try {
    // 1. 인증 토큰 검증
    const verified = await AuthService.verifyAccessToken(req.data);
    if( verified.code !== 200 ){
      throw new Error(verified.message);
    }
    // 2. 정상 응답
    res.status(200).json({
      code: 200,
      data: {
        verify: true,
      },
      message: 'Success',
    });
  } catch ( error ) {
    // 오류 응답
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

/**
 * 토큰 재발급 처리
 * @param {*} req 
 * @param {*} res 
 */
export const postTokenRefresh = async(req, res) => {
  try {
    // 1. 리프레시 토큰 검증
    const verified = await AuthService.verifyRefreshToken(req.data);
    if( verified.code !== 200 ){
      throw new Error(verified.message);
    }

    // 2. 로그인 성공 시, 토큰 발행
    const resToken = await AuthService.createToken(verified.data.decoded);
    if( resToken.code !== 200 ){
      throw new Error(resToken.message);
    }

    // 3. 토큰 발행 성공 시, 쿠키에 저장
    addTokenCookies(res, resToken.data);

    // 4. 정상 응답
    res.status(200).json({
      code: 200,
      data: null,
      message: "Refresh Tokens",
    });
  } catch ( error ) {
    // 오류 응답
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

const addTokenCookies = (res, data) => {
  const cookieOptions = {
    ...(
      process.env.NODE_ENV === 'production' ? {
        sameSite: "None",
        secure: true, // HTTPS에서만 전송가능
      } : {
        sameSite: "lax", // 크로스 도메인 요청 허용
        secure: false, // 개발 환경에서는 false로 설정
      }
    ),
    httpOnly: true,  // 클라이언트에서 접근 불가 (XSS 공격 방지)
    path: '/', // 쿠키가 유효한 경로, 모든 경로에서 유효하도록 설정
  }

  // 초기값 전달용 토큰
  res.cookie("payloadToken", data.payloadToken, {
    ...cookieOptions,
    maxAge: 1 * 60 * 60 * 1000, // 1시간 유지
    httpOnly: false,
  });
  // 인증 토큰
  res.cookie("accessToken", data.accessToken, {
    ...cookieOptions,
    maxAge: 1 * 60 * 60 * 1000 // 1시간 유지
  });
  // 리프레시 토큰
  res.cookie("refreshToken", data.refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7일 유지
  });
}

const clearTokenCookies = (res) => {
  const cookieOptions = {
    ...(
      process.env.NODE_ENV === 'production' ? {
        sameSite: "None",
        secure: true, // HTTPS에서만 전송가능
      } : {
        sameSite: "lax", // 크로스 도메인 요청 허용
        secure: false, // 개발 환경에서는 false로 설정
      }
    ),
    httpOnly: true,  // 클라이언트에서 접근 불가 (XSS 공격 방지)
    path: '/', // 쿠키가 유효한 경로, 모든 경로에서 유효하도록 설정
  }

  res.clearCookie('accessToken', { ...cookieOptions });
  res.clearCookie('refreshToken', { ...cookieOptions });
  res.clearCookie('payloadToken', { ...cookieOptions, httpOnly: false });
}

export default {
  getRegister,
  getLogin,
  postLogin,
  postTokenRefresh,
  postTokenVerify,
  postRegister,
  postLogout,
  postCheckDuplicate,
};
