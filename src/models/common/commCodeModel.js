import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';
import commonService from '../../services/common/commonService';

class CommCodeModel extends BaseModel {
  // async onCreate(){
  //   super.onCreate();
  //   const id = await commonService.generateId(CommCodeModel);
  //   this.setDataValue('codeId', id);
  //   return this;
  // }
}
CommCodeModel.init({
  codeId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'code_id',
    comment: '코드 ID'
  },
  codeName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'code_name',
    comment: '코드명',
  },
  codeDesc: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'code_desc',
    comment: '코드설명',
  },
  realValue: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'real_value',
    comment: '실제값',
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
  modelName: 'CommCode',
  tableName: 'dms_comm_code',
  comment: '[공통] 코드',
  seqeunce: {
    name: 'dms_comm_code_seq',
  },
});
CommCodeModel.removeAttribute('id');

export default CommCodeModel;
