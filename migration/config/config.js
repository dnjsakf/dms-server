const { loadEnv } = require('../../src/utils/envUtil.js');
const { decrypt } = require('../../src/utils/cryptoUtil.js');

loadEnv();

const dbConfig = (()=>{
  switch(process.env.DB_DIALECT){
    case "mariadb":
      return {
        host: process.env.DB_MARIA_HOST,
        port: process.env.DB_MARIA_PORT,
        username: process.env.DB_MARIA_USER,
        password: decrypt(process.env.DB_MARIA_PASSWORD),
        database: process.env.DB_MARIA_DBNAME,
        dialect: process.env.DB_DIALECT || 'mariadb',
        migrationStorageTableName: process.env.DB_MIGRATION_TABLE,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000, // 연결을 얻기 위해 기다리는 최대 시간 (밀리초)
          idle: 10000 // 연결이 유휴 상태로 유지되는 최대 시간 (밀리초)
        },
        dialectOptions: {
          connectTimeout: 10000, // 연결 타임아웃 설정 (밀리초)
          // ssl: {
          //   require: true,
          //   rejectUnauthorized: false,
          // },
        }
      };
    case "postgres":
      return {
        host: process.env.DB_POSTGRES_HOST,
        port: process.env.DB_POSTGRES_PORT,
        username: process.env.DB_POSTGRES_USER,
        password: decrypt(process.env.DB_POSTGRES_PASSWORD),
        database: process.env.DB_POSTGRES_DBNAME,
        dialect: process.env.DB_DIALECT || 'postgres',
        migrationStorageTableName: process.env.DB_MIGRATION_TABLE,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000, // 연결을 얻기 위해 기다리는 최대 시간 (밀리초)
          idle: 10000 // 연결이 유휴 상태로 유지되는 최대 시간 (밀리초)
        },
        dialectOptions: {
          connectTimeout: 10000, // 연결 타임아웃 설정 (밀리초)
        }
      };
  }
})();

module.exports = {
  test: dbConfig,
  development: dbConfig,
  production: dbConfig,
  local: dbConfig,
};
