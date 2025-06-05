import { getPath } from '../../utils/pathUtil';

import AuthService from '../../services/common/authService';
import UserService from '../../services/common/userService';

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

export const postLogin = async (req, res) => {
  try {
    const {
      code,
      data,
      message
    } = await AuthService.authenticate({
      loginId: req.body.loginId,
      loginPwd: req.body.loginPwd,
      ip: req.userIp,
      agent: req.userAgent,
      platform: req.headers['platform'],
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,  // 클라이언트에서 접근 불가 (XSS 공격 방지)
      // secure: true,    // HTTPS에서만 전송
      // sameSite: "Strict", // CSRF 공격 방지
      secure: false,
      sameSite: "Lax", // 크로스 도메인 요청 허용
      // maxAge: 7 * 24 * 60 * 60 * 1000 // 7일 유지
    });

    res.json({
      code,
      data: {
        accessToken: data.accessToken,
      },
      message
    });
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

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

export const postLogout = async (req, res) => {
  try {
    // 로그아웃 시, 토큰/세션 삭제
    await AuthService.logout({
      accessToken: req.accessToken,
      ip: req.userIp,
      agent: req.userAgent,
      platform: req.headers['platform'],
    });
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

export const postCheckDuplicate = async (req, res) => {
  try {
    const user = CommUserModel.build({
      loginId: req.body.loginId,
    }).toJSON();
    const duplicated = await AuthService.checkDuplicate(user);
    res.status(200).json({
      code: 200,
      data: duplicated,
      message: "Success",
    });
  } catch ( error ){
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export const postVerifyToken = async (req, res) => {
  try {
    const {
      verify,
      data,
      message,
    } = await AuthService.verifyToken({
      accessToken: req.accessToken,
      ip: req.userIp,
      agent: req.userAgent,
      platform: req.headers['platform'],
    });
    res.status(200).json({
      code: 200,
      data: {
        verify,
      },
      message: message,
    });
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export const postToken = async(req, res) => {
  try {
    const {
      verify,
      data,
      message
    } = await AuthService.generateToken({
      represhToken: req.cookies.represhToken,
      ip: req.userIp,
      agent: req.userAgent,
      platform: req.headers['platform'],
    });
    res.status(200).json({
      code: 200,
      data: data,
      message: message,
    });
  } catch ( error ) {
    res.status(500).json({
      code: 500,
      data: null,
      message: error.message
    });
  }
}

export default {
  getRegister,
  getLogin,
  postLogin,
  postToken,
  postVerifyToken,
  postRegister,
  postLogout,
};
