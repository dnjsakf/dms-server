const CommPermissionModel = require('../../src/models/common/commPermissionModel').default;
const CommRoleModel = require('../../src/models/common/commRoleModel').default;
const CommRolePermissionModel = require('../../src/models/common/commRolePermissionModel').default;
const CommUserModel = require('../../src/models/common/commUserModel').default;
const CommUserRoleModel = require('../../src/models/common/commUserRoleModel').default;
const CommMenuModel = require('../../src/models/common/commMenuModel').default;
const CommMenuRoleModel = require('../../src/models/common/commMenuRoleModel').default;
const CommGorupModel = require('../../src/models/common/commGroupModel').default;
const CommGroupRoleModel = require('../../src/models/common/commGroupRoleModel').default;
const CommCodeModel = require('../../src/models/common/commCodeModel').default;
const CommCodeItemModel = require('../../src/models/common/commCodeItemModel').default;


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableModels = [
      CommPermissionModel,
      CommRoleModel,
      CommRolePermissionModel,
      CommUserModel,
      CommUserRoleModel,
      CommMenuModel,
      CommMenuRoleModel,
      CommGorupModel,
      CommGroupRoleModel,
      CommCodeModel,
      CommCodeItemModel
    ];
    /*************** CREATE TABLE ***************/
    for(const model of tableModels.values()){
      const tableName = model.tableName;
      console.log('Creating table:', tableName);
      await queryInterface.createTable(tableName, model.getAttributes());
      console.log('Table created:', tableName);

      /*************** CREATE SEQUENCE ***************/
      if( model.options.seqeunce ){
        const sequenceName = `${model.options.seqeunce.name}`.toLowerCase();
        console.log('Creating sequence:', sequenceName);
        await queryInterface.sequelize.query(`
          CREATE SEQUENCE ${sequenceName}
          START WITH 1
          INCREMENT BY 1
          NO MINVALUE
          NO MAXVALUE
          CACHE 1;
        `);
        console.log('Sequence created:', sequenceName);
      }
      /*************** CREATE SEQUENCE ***************/
    }
    /*************** CREATE TABLE ***************/
  },
  down: async (queryInterface, Sequelize) => {
    const tableModels = [
      CommRolePermissionModel,
      CommGroupRoleModel,
      CommMenuRoleModel,
      CommUserRoleModel,
      CommPermissionModel,
      CommRoleModel,
      CommUserModel,
      CommMenuModel,
      CommGorupModel,
      CommCodeModel,
      CommCodeItemModel,
    ];
    /*************** DROP TABLE ***************/
    for(const model of tableModels.values()){
      const tableName = model.tableName;
      console.log('Dropping table:', tableName);
      await queryInterface.dropTable(tableName);
      console.log('Table dropped:', tableName);

      /*************** DROP SEQUENCE ***************/
      if( model.options.seqeunce ){
        const sequenceName = `${model.options.seqeunce.name}`.toLowerCase();
        console.log('Dropping sequence:', sequenceName);
        await queryInterface.sequelize.query(`
          DROP SEQUENCE ${sequenceName}
        `);
        console.log('Sequence dropped:', sequenceName);
      }
      /*************** DROP SEQUENCE ***************/
    }
    /*************** DROP TABLE ***************/
  },
};
