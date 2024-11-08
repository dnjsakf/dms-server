import dotenv from 'dotenv';

const loadEnv = () => {
  // 환경변수 파일 로드
  if( process.env.NODE_ENV === 'development' ){
    dotenv.config({ path: '.env.development' });
  } else if( process.env.NODE_ENV === 'local' ){
    dotenv.config({ path: '.env.local' });
  } else {
    dotenv.config({ path: '.env.production'});
  }
  dotenv.config({ path: '.env'});
}

export {
  loadEnv
}
