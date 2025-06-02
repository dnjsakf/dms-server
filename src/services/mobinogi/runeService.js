import sequelize from "sequelize";

import BaseModel from "../../models/baseModel";
import MbRuneMstModel from "../../models/mobinogi/mbRuneMstModel";

/**
 * 메뉴 목록 요청 API
 * @param {*} params 
 * @returns 
 */
export const getDataList = async ( params ) => {
  try {
    const conditions = {};
    if ( params.runeNm ) {
      conditions.runeNm = { [sequelize.Op.like]: `%${params.runeNm}%` };
    }
    if ( params.searchClass ) {
      conditions.classId = {
        [sequelize.Op.or]: {
          [sequelize.Op.eq]: `${params.searchClass}`,
          [sequelize.Op.eq]: `공용`
        }
      };
    }
    if ( params.searchSlot ) {
      conditions.runeSlot = {
        [sequelize.Op.in]: params.searchSlot.split(',')
      };
    }
    if ( params.searchRarity ) {
      conditions.runeRarity = {
        [sequelize.Op.in]: params.searchRarity.split(',')
      };
    }
    const list = await MbRuneMstModel.findAll({
      attributes: [
        'runeId',
        'runeNm',
        'runeRarity',
        'runeDesc',
        'runeSlot',
        'classId',
        'classNm',
        'note',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm'
      ],
      where: conditions,
      order: [ 
        ['runeNm', 'ASC'],
        ['runeRarity', 'ASC']
      ],
    });
    return list;
  } catch ( error ){
    throw error;
  }
}

export default {
  getDataList,
}
