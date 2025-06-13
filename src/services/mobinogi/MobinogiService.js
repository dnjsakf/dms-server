import { QueryTypes } from "sequelize";
import Sequelize from '../../config/dbConfig';

import BaseModel from "../../models/baseModel";
import MbRuneMstModel from "../../models/mobinogi/mbRuneMstModel";

/**
 * 타입별로 유니크한 키 생성
 * @param {*} type 
 */
const generateId = async ( model, length=12 ) => {
  let retval = null;
  if( model && Object.getPrototypeOf(model) === BaseModel ){
    let sequenceName = null;
    let prefix = '';
    switch(model){
      case MbRuneMstModel:
        sequenceName = `${model.tableName}_seq`;
        prefix = "RUNE";
        break;
    }
    if( sequenceName ){
      const [result] = await Sequelize.query(`SELECT NEXTVAL('${sequenceName.toLowerCase()}') AS id;`);
      const padLength = (length - prefix.length)||0;
      retval = prefix + String(result[0].id).padStart(padLength, '0');
    }
  }
  return retval;
}

export default {
  generateId,
}
