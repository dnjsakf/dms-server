import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';

import CommRoleModel from './commRoleModel';
import CommPermissionModel from './commPermissionModel';

class CommRolePermissionModel extends BaseModel {}
CommRolePermissionModel.init({
  roleId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'role_id',
    comment: '역할 ID',
    references: {
      model: CommRoleModel,
      key: 'role_id'
    }
  },
  permissionId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'permission_id',
    comment: 'PERMISSION ID',
    references: {
      model: CommPermissionModel,
      key: 'permission_id'
    }
  },
}, {
  modelName: 'CommRolePermission',
  tableName: 'dms_comm_role_permission',
  comment: '[공통] 그룹 역할',
});
CommRolePermissionModel.removeAttribute('id');

export default CommRolePermissionModel;
