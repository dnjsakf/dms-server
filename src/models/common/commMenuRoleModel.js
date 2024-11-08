import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';

import CommMenuModel from './commMenuModel';
import CommRoleModel from './commRoleModel';

class CommMenuRoleModel extends BaseModel {}
CommMenuRoleModel.init({
  menuId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'menu_id',
    comment: '메뉴 ID',
    references: {
      model: CommMenuModel,
      key: 'menu_id'
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
  modelName: 'CommMenuRole',
  tableName: 'dms_comm_menu_role',
  comment: '[공통] 그룹 역할',
});
CommMenuRoleModel.removeAttribute('id');

export default CommMenuRoleModel;
