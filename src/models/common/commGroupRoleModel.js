import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';

import CommGroupModel from './commGroupModel';
import CommRoleModel from './commRoleModel';

class CommGroupRoleModel extends BaseModel {}
CommGroupRoleModel.init({
  groupId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'group_id',
    comment: '그룹 ID',
    references: {
      model: CommGroupModel,
      key: 'group_id'
    }
  },
  roleId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'role_id',
    comment: 'ROLE ID',
    references: {
      model: CommRoleModel,
      key: 'role_id'
    }
  },
}, {
  modelName: 'CommGroupRole',
  tableName: 'dms_comm_group_role',
  comment: '[공통] 그룹 역할',
});
CommGroupRoleModel.removeAttribute('id');

export default CommGroupRoleModel;
