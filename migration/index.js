require('@babel/register')({
  presets: ['@babel/preset-env'],
});

const path = require('path');
const { exec } = require('child_process');

const migrate = () => {
  const migrateCommand = `
    npx cross-env NODE_ENV=local babel-node ../node_modules/sequelize-cli/lib/sequelize db:migrate \
    --config ./migration/config/config.js \
    --migrations-path ./migration/migrations \
    --models-path ./src/models
  `;
  exec(migrateCommand, (error, stdout, stderr) => {
    console.debug(migrateCommand);
    if ( error ) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
};

migrate();

