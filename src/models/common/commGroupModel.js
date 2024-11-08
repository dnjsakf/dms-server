import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';
import commonService from '../../services/common/commonService';

class CommGroupModel extends BaseModel {
  async onCreate(){
    super.onCreate();
    const id = await commonService.generateId(CommGroupModel);
    this.setDataValue('groupId', id);
    return this;
  }
}
CommGroupModel.init({
  groupId: {
    // type: DataTypes.BIGINT(22, 0),
    // autoIncrement: true,
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'group_id',
    comment: '그룹 ID'
  },
  groupType: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: 'NONE',
    field: 'group_type',
    comment: '그룹유형(ORGANIZATION: 조직, DEPT:부서, JOB: 업무, TEAM: 팀, POSITION: 직위, DUTY: 직책, NONE)',
  },
  groupName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'group_name',
    comment: '그룹명',
  },
  groupLevel: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'group_level',
    comment: '그룹 Level'
  },
  groupIcon: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'group_icon',
    comment: '그룹 아이콘:primevue icons',
  },
  upperGroupId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'upper_group_id',
    comment: '상위 그룹 ID'
  },
  upperGroupName: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'upper_group_name',
    comment: '상위 그룹명',
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
  modelName: 'CommGroup',
  tableName: 'dms_comm_group',
  comment: '[공통] 그룹',
  seqeunce: {
    name: 'dms_comm_group_seq',
  },
});
CommGroupModel.removeAttribute('id');

export default CommGroupModel;
