import AuthService from "../services/common/authService";

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const userIp = req.headers['x-forwarded-for'] || req.ip;
  const userAgent = req.headers['user-agent'];

  // IP 주소와 User-Agent 추출 미들웨어
  req.userIp = userIp;
  req.userAgent = userAgent;
  req.accessToken = token;

  // /api/auth 경로로 들어오는 요청은 인증을 생략
  if (req.path?.startsWith('/auth')) {
    return next();
  }

  if( !token ){
    return res.status(401).json({
      code: 401,
      data: null,
      message: 'Authorization token is missing.',
    });
  }

  try {
    const {
      verify,
      data,
      message
    } = await AuthService.verifyToken({
      accessToken: token,
      ip: req.userIp,
      agent: req.userAgent,
    });

    if( verify ){
      req.user = data;
      return next();
    } else {
      return res.status(401).json({
        code: 401,
        data: null,
        message: message,
      });
    }
  } catch ( error ) {
    res.status(401).json({ 
      code: 401,
      data: null,
      message: 'Authorization token is not valid.'
    });
  }
}

export default authMiddleware;
