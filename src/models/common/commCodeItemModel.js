import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';
import commonService from '../../services/common/commonService';

class CommCodeItemModel extends BaseModel {
  // async onCreate(){
  //   super.onCreate();
  //   const id = await commonService.generateId(CommCodeItemModel);
  //   this.setDataValue('codeItemId', id);
  //   return this;
  // }
}
CommCodeItemModel.init({
  codeId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'code_id',
    comment: '코드 ID'
  },
  codeItemId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'code_item_id',
    comment: '코드아이템 ID'
  },
  codeItemName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'code_item_name',
    comment: '코드아이템명',
  },
  codeItemDesc: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'code_item_desc',
    comment: '코드아이템설명',
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
  modelName: 'CommCodeItem',
  tableName: 'dms_comm_code_item',
  comment: '[공통] 코드아이템',
  seqeunce: {
    name: 'dms_comm_code_item_seq',
  },
});
CommCodeItemModel.removeAttribute('id');

export default CommCodeItemModel;
