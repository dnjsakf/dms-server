import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';
import commonService from '../../services/common/commonService';

class CommRoleModel extends BaseModel {
  async onCreate(){
    super.onCreate();
    const id = await commonService.generateId(CommRoleModel);
    this.setDataValue('roleId', id);
    return this;
  }
}
CommRoleModel.init({
  roleId: {
    // type: DataTypes.BIGINT(22, 0),
    // autoIncrement: true,
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'role_id',
    comment: 'ROLE ID',
  },
  roleName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'role_name',
    comment: 'ROLE 명',
  },
  roleDesc: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'role_desc',
    comment: 'ROLE 설명',
  },
  roleLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'role_level',
    comment: 'ROLE LEVEL',
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'sort_order',
    comment: '정렬순서',
  },
  useYn: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'Y',
    field: 'use_yn',
    comment: '사용여부',
  },
}, {
  modelName: 'CommRole',
  tableName: 'dms_comm_role',
  comment: '[공통] 역할',
  seqeunce: {
    name: 'dms_comm_role_seq',
  },
});
CommRoleModel.removeAttribute('id');

export default CommRoleModel;

