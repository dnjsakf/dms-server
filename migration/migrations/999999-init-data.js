const fs = require('fs');
const path = require('path');

const JobModel = require('../../src/models/batch/jobModel').default;
const CommPermissionModel = require('../../src/models/common/commPermissionModel').default;
const CommRoleModel = require('../../src/models/common/commRoleModel').default;
const CommRolePermissionModel = require('../../src/models/common/commRolePermissionModel').default;
const CommUserModel = require('../../src/models/common/commUserModel').default;
const CommUserRoleModel = require('../../src/models/common/commUserRoleModel').default;
const CommMenuModel = require('../../src/models/common/commMenuModel').default;
const CommMenuRoleModel = require('../../src/models/common/commMenuRoleModel').default;
const CommGorupModel = require('../../src/models/common/commGroupModel').default;
const CommGroupRoleModel = require('../../src/models/common/commGroupRoleModel').default;

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
