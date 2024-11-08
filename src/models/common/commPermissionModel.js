import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';
import commonService from '../../services/common/commonService';

class CommPermissionModel extends BaseModel {
  async onCreate(){
    super.onCreate();
    const id = await commonService.generateId(CommPermissionModel);
    this.setDataValue('permissionId', id);
    return this;
  }
}
CommPermissionModel.init({
  permissionId: {
    // type: DataTypes.BIGINT(22, 0),
    // autoIncrement: true,
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'permission_id',
    comment: 'PERMISSION ID',
  },
  permissionName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'permission_name',
    comment: 'PERMISSION 명',
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
  modelName: 'CommPermission',
  tableName: 'dms_comm_permission',
  comment: '[공통] 권한',
  seqeunce: {
    name: 'dms_comm_permission_seq',
  },
});
CommPermissionModel.removeAttribute('id');

export default CommPermissionModel;
