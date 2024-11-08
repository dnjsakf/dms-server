import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';
import commonService from '../../services/common/commonService';

class CommMenuModel extends BaseModel {
  async onCreate(){
    super.onCreate();
    const id = await commonService.generateId(CommMenuModel);
    this.setDataValue('menuId', id);
    return this;
  }
}
CommMenuModel.init({
  menuId: {
    // type: DataTypes.BIGINT(22, 0),
    // autoIncrement: true,
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'menu_id',
    comment: '메뉴 ID'
  },
  menuType: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'NONE',
    field: 'menu_type',
    comment: '메뉴유형(ROOT: 최상위, LINKED: 링크연결, NONE: 없음)',
  },
  menuName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'menu_name',
    comment: '메뉴명',
  },
  menuLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'menu_level',
    comment: '메뉴 Level'
  },
  menuPath: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'menu_path',
    comment: '메뉴 경로',
  },
  menuIcon: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'menu_icon',
    comment: '메뉴 아이콘:primevue icons',
  },
  upperMenuId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'upper_menu_id',
    comment: '상위 메뉴 ID',
    // validate: {
    //   isInt: true, // 정수인지 확인
    //   notEmpty: true, // 공백이 아닌지 확인
    // },
    set(value) {
      this.setDataValue('upperMenuId', value === "" ? null : value);
    }
  },
  upperMenuName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'upper_menu_name',
    comment: '상위 메뉴명',
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
  modelName: 'CommMenu',
  tableName: 'dms_comm_menu',
  comment: '[공통] 메뉴',
  seqeunce: {
    name: 'dms_comm_menu_seq',
  },
});
CommMenuModel.removeAttribute('id');

export default CommMenuModel;
