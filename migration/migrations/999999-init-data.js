const fs = require('fs');
const path = require('path');

const JobModel = require('../../src/models/batch/JobModel').default;
const CommPermissionModel = require('../../src/models/common/CommPermissionModel').default;
const CommRoleModel = require('../../src/models/common/CommRoleModel').default;
const CommRolePermissionModel = require('../../src/models/common/CommRolePermissionModel').default;
const CommUserModel = require('../../src/models/common/CommUserModel').default;
const CommUserRoleModel = require('../../src/models/common/CommUserRoleModel').default;
const CommMenuModel = require('../../src/models/common/CommMenuModel').default;
const CommMenuRoleModel = require('../../src/models/common/CommMenuRoleModel').default;
const CommGorupModel = require('../../src/models/common/CommGroupModel').default;
const CommGroupRoleModel = require('../../src/models/common/CommGroupRoleModel').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const models = [
      CommPermissionModel,
      CommRoleModel,
      CommRolePermissionModel,
      CommUserModel,
      CommUserRoleModel,
      CommMenuModel,
      CommMenuRoleModel,
      CommGorupModel,
      CommGroupRoleModel,
      JobModel,
    ];

    for(const model of models.values()){
      let tableName = null;
      let filePath = null;
      let fileContent = null;
      let initData = null;

      try {
        tableName = model.tableName;
        filePath = path.join(__dirname, `./seeders/${tableName.toUpperCase()}.json`);
        fileContent = fs.readFileSync(filePath, 'utf8');
        initData = JSON.parse(fileContent);

        if( initData && initData?.length > 0 ){
          initData = initData?.map((data)=>{
            const now = new Date();
            if( model.getAttributes().hasOwnProperty('regDttm') ){
              data["reg_user_id"] = 0;
              data["reg_dttm"] = now;
            }
            if( model.getAttributes().hasOwnProperty('updDttm') ){
              data["upd_user_id"] = 0;
              data["upd_dttm"] = now;
            }
            return data;
          });
          await queryInterface.bulkInsert(tableName, initData, {});
        }
      } catch ( e ) {
        console.error(e);
      }
    }
  },
  down: async (queryInterface, Sequelize) => {
    // let tableName = null;

    // tableName = JobModel.tableName;
    // await queryInterface.bulkDelete(tableName, null, {});
  },
};
