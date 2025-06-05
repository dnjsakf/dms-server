import AuthService from "../services/common/authService";

const whitelist = [
  '/auth'
]

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const userIp = req.headers['x-forwarded-for'] || req.ip;
  const userAgent = req.headers['user-agent'];
  const userPlatform = req.headers['platform'];

  // IP 주소와 User-Agent 추출 미들웨어
  req.userIp = userIp;
  req.userAgent = userAgent;
  req.userPlatform = userPlatform;
  req.accessToken = token;
  req.user = {
    userId: 'ANONYMOUS',
    platform: userPlatform,
  }

  console.log("cookies", req.cookies);

  // /api/auth 경로로 들어오는 요청은 인증을 생략
  if (req.path?.startsWith('/auth')) {
    return next();
  }

  if( !token ){
    // /api/mb 경로로 들어오는 요청은 인증을 생략
    if (req.path?.startsWith('/mb')) {
      return next();
    }
    // /api/init 경로로 들어오는 요청은 인증을 생략
    if (req.path?.startsWith('/init')) {
      return next();
    }
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
      platform: req.userPlatform,
    });
    if( verify ){
      req.user = data;
      req.loggedIn = true
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
