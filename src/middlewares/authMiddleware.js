import jwtUtil, { TOKEN_TYPE } from "../utils/jwtUtil";
import AuthService from "../services/common/authService";

const whitelist = [
  '/init'
];

const authMiddleware = async (req, res, next) => {
  // const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // 헤더에서 IP, User-Agent, Platform 정보 추출
  const userIp = req.headers['x-forwarded-for'] || req.ip;
  const userAgent = req.headers['user-agent'] || '';
  const userPlatform = req.headers['platform'] || 'unknown';
  // 쿠키에서 토큰 추출
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const payloadToken = req.cookies.payloadToken;

  // 사용자 정보 설정
  req.data = {
    user: {
      userId: "ANONYMOUS",
    },
    ip: userIp,
    agent: userAgent,
    platform: userPlatform,
    accessToken: accessToken,
    refreshToken: refreshToken,
    payloadToken: payloadToken,
  }
  req.userIp = userIp;
  req.userAgent = userAgent;
  req.userPlatform = userPlatform;
  // 토큰 정보 저장
  req.accessToken = accessToken;
  req.refreshToken = refreshToken;
  req.payloadToken = payloadToken;

  // 0. /auth를 통해 들어오는 요청은 인증이므로 패스
  if (req.path?.startsWith('/auth')) {
    return next();
  }

  // 1. 인증 토큰이 없으면, 인증 실패
  if( !accessToken ){
    // 1-1. 특정 경로로 들어오는 요청은 토큰이 없어도 통과
    for(let i = 0; i < whitelist.length; i++) {
      if (req.path?.startsWith(whitelist[i])) {
        return next();
      }
    }
    return res.status(401).json({
      code: 401,
      data: null,
      message: 'Authorization token is missing.',
    });
  }

  // 2. 인증 토큰이 있으면, 토큰 검증(만료시간, 유효성 검사 등)
  let decodedToken;
  try {
    decodedToken = jwtUtil.verify(TOKEN_TYPE.ACCESS_TOKEN, accessToken);
    if( !decodedToken ){
      throw new Error('Invalid token');
    }
  } catch ( error ) {
    console.error(error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: '토큰이 만료되었습니다. (Token Expired)'
      });
    }
    return res.status(401).json({
      code: 401,
      data: null,
      message: 'Authorization token is not valid.',
    });
  }

  // 3. 토큰이 유효하면, 사용자 세션 정보 확인
  try {
    const userId = decodedToken.sub;
    const userSession = await AuthService.getUserSession(userId);
    if( !userSession ){
      return res.status(401).json({
        code: 401,
        data: null,
        message: 'User session not found.',
      });
    }
    req.data.user = userSession;
  } catch ( error ) {
    return res.status(401).json({
      code: 401,
      data: null,
      message: 'User session not found or invalid.',
    });
  }

  return next();
}

export default authMiddleware;
