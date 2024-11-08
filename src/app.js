import 'module-alias/register';

import path from 'path';
import express from 'express';
import session from 'express-session';
import cors from 'cors';

import { createHandler } from 'graphql-http/lib/use/express';

// Configurations
import sequelize from './config/dbConfig';
import { connectRedis } from './config/redisConfig';
import { schema, root } from './config/graphqlConfig';

// Utils
import { loadEnv } from './utils/envUtil';
import { getPath } from './utils/pathUtil';

// Middlewares
import authMiddleware from './middlewares/authMiddleware';
import sessionMiddleware from './middlewares/sessionMiddleware';

// Routes
import routes from './routes';

loadEnv();

const store = connectRedis();

const SECRET_KEY = process.env.SECRET_KEY;
const EXPRESS_HOST = process.env.EXPRESS_HOST || 'localhost';
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;

// Express 설정
const app = express();

// 정적파일 경로 
app.use(express.static(getPath('public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 
app.use(cors({
  // ALL
  // origin: 'http://localhost:4001', // 요청을 허용할 출처
}));

// Redis Session Setting
app.use(session({
  store: store,
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // HTTPS를 사용하는 경우 true로 설정
}));

// Custom Middlewares
app.use(sessionMiddleware);

// GraphQL API
app.use('/api/graphql', createHandler({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

// Routes
import commonRoutes from './routes/common/commonRoutes';
app.use('/', commonRoutes);
app.use('/api', authMiddleware, routes);

// Run Server
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync({ alter: false }); // 테이블 생성
  })
  .then(() => {
    app.listen(EXPRESS_PORT, '0.0.0.0', ()=>{
      console.log(`Express Server! http://${EXPRESS_HOST}:${EXPRESS_PORT}`);
      console.log(`Express GraphQL! http://${EXPRESS_HOST}:${EXPRESS_PORT}/graphiql`);
    });    
  })
  .catch(( error ) => {
    console.error('Unable to connect to the database:', error);
  });

