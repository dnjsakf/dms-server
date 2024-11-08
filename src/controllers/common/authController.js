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
    const result = await AuthService.authenticate({
      ...req.body,
      ip: req.userIp,
      agent: req.userAgent,
    });
    res.json(result);
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
    // 로그아웃 시, 토큰 삭제
    await AuthService.clearToken({
      accessToken: req.accessToken,
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
      ...req.body,
      ip: req.userIp,
      agent: req.userAgent,
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
      ...req.body,
      ip: req.userIp,
      agent: req.userAgent,
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
