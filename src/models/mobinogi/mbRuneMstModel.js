import { DataTypes } from 'sequelize';
import BaseModel from '../baseModel';

import mobinogiService from '../../services/mobinogi/mobinogiService';

class MbRuneMstModel extends BaseModel {
  async onCreate(){
    super.onCreate();
    const id = await mobinogiService.generateId(MbRuneMstModel);
    this.setDataValue('runeId', id);
    return this;
  }
}
MbRuneMstModel.init({
  runeId: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
    field: 'rune_id',
    comment: '룬 ID',
  },
  runeNm: {
    type: DataTypes.STRING(50),
    primaryKey: false,
    allowNull: false,
    field: 'rune_nm',
    comment: '룬 명',
  },
  runeRarity: {
    type: DataTypes.STRING(50),
    primaryKey: false,
    allowNull: false,
    field: 'rune_rarity',
    comment: '룬 등급',
  },
  runeDesc: {
    type: DataTypes.STRING(50),
    primaryKey: false,
    allowNull: false,
    field: 'rune_desc',
    comment: '룬 설명',
  },
  runeSlot: {
    type: DataTypes.STRING(50),
    primaryKey: false,
    allowNull: false,
    field: 'rune_slot',
    comment: '룬 슬롯',
  },
  classId: {
    type: DataTypes.STRING(50),
    primaryKey: false,
    allowNull: false,
    field: 'class_id',
    comment: '직업 ID',
  },
  classNm: {
    type: DataTypes.STRING(50),
    primaryKey: false,
    allowNull: false,
    field: 'class_nm',
    comment: '직업 명',
  },
  note: {
    type: DataTypes.STRING(500),
    primaryKey: false,
    allowNull: false,
    field: 'note',
    comment: '요약',
  },
}, {
  modelName: 'MbRuneMst',
  tableName: 'dms_mb_rune_mst',
  comment: '마비노기 모바일 룬 마스터',
});
MbRuneMstModel.removeAttribute('id');

export default MbRuneMstModel;
