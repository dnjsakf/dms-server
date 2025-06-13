import { QueryTypes } from "sequelize";
import Sequelize from '../../config/dbConfig';

import BaseModel from "../../models/BaseModel";
import CommMenuModel from "../../models/common/CommMenuModel";
import CommUserModel from "../../models/common/CommUserModel";
import CommRoleModel from "../../models/common/CommRoleModel";
import CommPermissionModel from "../../models/common/CommPermissionModel";
import CommGroupModel from "../../models/common/CommGroupModel";
import CommCodeModel from "../../models/common/CommCodeModel";
import CommCodeItemModel from "../../models/common/CommCodeItemModel";

export const getInitData = async ( params ) => {

  const conds = {
    userId: params.userId || '-1'
  }

  let userRole = await Sequelize.query(`
    /* CommonService.getUserRole */
    select t.role_id AS "roleId"
         , t.role_level AS "roleLevel"
         , t.role_name AS "roleName"
      from dms_comm_role t
     where 1=1
       and role_id = (
           select coalesce(
                   min(t3.role_id),
                   (select max(s1.role_id) from dms_comm_role s1)
                   ) as role_id
             from dms_comm_user t1
             inner join dms_comm_user_role t2
               on t2.user_id = t1.user_id
             inner join dms_comm_role t3
               on t3.role_id = t2.role_id
             where 1=1
               and t1.user_id = COALESCE(:userId, '-1')
           )
  `, {
    type: QueryTypes.SELECT,
    replacements: {
      userId: conds.userId
    },
    plain: true, // 단일 객체로 반환
  });

  let roles = await Sequelize.query(`
    /* CommonService.getUserRoles */
    SELECT DISTINCT
           A.role_name AS "roleName"
      FROM dms_comm_role A
     WHERE 1=1
       AND A.role_level >= :roleLevel
     /*
       AND A.role_level >= (
           SELECT min(T3.role_level)
             FROM dms_comm_user T1
            INNER JOIN dms_comm_user_role T2
               ON T2.user_id = T1.user_id
            INNER JOIN dms_comm_role T3
               ON T3.role_id = T2.role_id
            WHERE 1=1
              AND T1.user_id = COALESCE(:userId, '-1')
           )
      */
  `, {
    type: QueryTypes.SELECT,
    replacements: {
      // userId: conds.userId
      roleLevel: userRole.roleLevel
    },
  });
  roles = roles.map(({ roleName })=>( roleName ))

  const menus = await Sequelize.query(`
    /* CommonService.getUserMenus */
    SELECT DISTINCT
           C.menu_id AS "menuId"
         , C.menu_type AS "menuType"
         , C.menu_name AS "menuName"
         , C.menu_level AS "menuLevel"
         , C.menu_path AS "menuPath"
         , C.menu_icon AS "menuIcon"
         , C.upper_menu_id AS "upperMenuId"
         , C.upper_menu_name AS "upperMenuName"
         , C.use_yn AS "useYn"
      FROM dms_comm_role A
     INNER JOIN dms_comm_menu_role B
        ON B.role_id = A.role_id
     INNER JOIN dms_comm_menu C
        ON C.menu_id = B.menu_id
     WHERE 1=1
       AND A.role_level >= :roleLevel
      /*
       AND A.role_level >= (
           SELECT MIN(T3.role_level)
             FROM dms_comm_user T1
            INNER JOIN dms_comm_user_role T2
               ON T2.user_id = T1.user_id
            INNER JOIN dms_comm_role T3
               ON T3.role_id = T2.role_id
            WHERE 1=1
              AND T1.user_id = COALESCE(:userId, '-1')
           )
      */
       AND C.use_yn = 'Y'
  `, {
    type: QueryTypes.SELECT,
    replacements: {
      // userId: conds.userId
      roleLevel: userRole.roleLevel
    },
  });

  return {
    menus,
    roles,
  }
}

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
      case CommMenuModel:
        sequenceName = `${model.tableName}_seq`;
        prefix = "MENU";
        break;
      case CommUserModel:
        sequenceName = `${model.tableName}_seq`;
        prefix = "USER";
        break;
      case CommRoleModel:
        sequenceName = `${model.tableName}_seq`;
        prefix = "ROLE";
        break;
      case CommPermissionModel:
        sequenceName = `${model.tableName}_seq`;
        prefix = "PERM";
        break;
      case CommGroupModel:
        sequenceName = `${model.tableName}_seq`;
        prefix = "GRUP";
        break;
      case CommCodeModel:
        sequenceName = `${model.tableName}_seq`;
        prefix = "CODE";
        break;
      case CommCodeItemModel:
        sequenceName = `${model.tableName}_seq`;
        prefix = "CDIT";
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
  getInitData,
  generateId,
}