import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';
import commonService from '../../services/common/commonService';

class CommUserModel extends BaseModel {
  async onCreate(){
    super.onCreate();
    const id = await commonService.generateId(CommUserModel);
    this.setDataValue('userId', id);
    return this;
  }
}
CommUserModel.init({
  userId: {
    // type: DataTypes.BIGINT(22, 0),
    // autoIncrement: true,
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'user_id',
    comment: '사용자 ID'
  },
  loginId: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'login_id',
    comment: '로그인 ID'
  },
  loginPwd: {
    type: DataTypes.STRING(256),
    allowNull: false,
    field: 'login_pwd',
    comment: '로그인 비밀번호'
  },
  userName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'user_name',
    comment: '사용자명'
  },
  userEmail: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'user_email',
    comment: '사용자 이메일'
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
  modelName: 'CommUser',
  tableName: 'dms_comm_user',
  comment: '[공통] 사용자',
  seqeunce: {
    name: 'dms_comm_user_seq',
  },
});
CommUserModel.removeAttribute('id');

export default CommUserModel;
