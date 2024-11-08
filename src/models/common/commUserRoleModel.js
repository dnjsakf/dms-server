import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';

import CommUserModel from './commUserModel';
import CommhRoleModel from './commRoleModel';

class CommUserRoleModel extends BaseModel {}
CommUserRoleModel.init({
  userId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'user_id',
    comment: '사용자 ID',
    references: {
      model: CommUserModel,
      key: 'user_id'
    }
  },
  roleId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'role_id',
    comment: 'ROLE ID',
    references: {
      model: CommhRoleModel,
      key: 'role_id'
    }
  },
}, {
  modelName: 'CommUserRole',
  tableName: 'dms_comm_user_role',
  comment: '[공통] 그룹 역할',
});
CommUserRoleModel.removeAttribute('id');

export default CommUserRoleModel;
