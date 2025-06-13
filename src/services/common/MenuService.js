import sequelize from 'sequelize';
import { getTransaction } from '../../config/dbConfig';
import CommMenuModel from '../../models/common/commMenuModel';
import CommMenuRoleModel from '../../models/common/commMenuRoleModel';
import CommonService from './commonService';

/**
 * 메뉴 목록 요청 API
 * @param {*} params 
 * @returns 
 */
export const getDataList = async ( params ) => {
  try {
    const list = await CommMenuModel.findAll({
      attributes: [
        'menuId',
        'menuType',
        'menuName',
        'menuLevel',
        'menuPath',
        'menuIcon',
        'upperMenuId',
        'upperMenuName',
        'useYn',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm',
      ],
      where: {
        // menuName: { [sequelize.Op.like]: params.menuName }
      },
      order: [ 
        ['menuName', 'ASC']
      ],
    });
    return list;
  } catch ( error ){
    throw error;
  }
}

/**
 * 메뉴 상세 요청 API
 * @param {*} params 
 * @returns 
 */
export const getDataDetail = async ( params ) => {
  try {
    const detail = await CommMenuModel.findByPk(params.menuId, {
      attributes: [
        'menuId',
        'menuType',
        'menuName',
        'menuLevel',
        'menuPath',
        'menuIcon',
        'upperMenuId',
        'upperMenuName',
        'useYn',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm',
      ],
    });
    return detail;
  } catch ( error ) {
    throw error;
  }
}

/**
 * 메뉴 권한 목록 요청 API
 * @param {*} params 
 * @returns 
 */
export const getDataRole = async ( params ) => {
  try {
    const list = await CommMenuRoleModel.findAll({
      attributes: [
        'menuId',
        'roleId',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm',
      ],
      where: {
        menuId: { [sequelize.Op.like]: params.menuId }
      },
      order: [ 
        ['roleId', 'ASC']
      ],
    });
    return list;
  } catch ( error ){
    throw error;
  }
}

/**
 * 등록 요청 API
 * - 데이터 등록 및 메뉴 권한 삭제/추가
 * @param {*} params 
 * @returns 
 */
export const createData = async ( params ) => {
  const t = await getTransaction();
  try {
    const createData = (await CommMenuModel.build(params).onCreate()).toJSON();
    const created = await CommMenuModel.create(createData, { transaction: t });
    if( created && params?.roles ){
      const createdData = created.toJSON();
      const roles = params?.roles?.map((role) => (
        CommMenuRoleModel.build({
          ...createdData,
          roleId: role.roleId,
        }).toJSON()
      ));
      await CommMenuRoleModel.destroy({
        where: {
          menuId: {
            [sequelize.Op.eq]: createdData.menuId,
          }
        },
        transaction: t
      });
      await CommMenuRoleModel.bulkCreate(roles, { transaction: t });
    }
    await t.commit();
    return created;
  } catch ( error ) {
    await t.rollback();
    throw error;
  }
}

/**
 * 수정 요청 API
 * - 데이터 수정 및 메뉴 권한 삭제/추가
 * @param {*} params 
 * @returns 
 */
export const updateData = async ( params ) => {
  const t = await getTransaction();
  try {
    const updateData = CommMenuModel.build(params).onUpdate().toJSON();
    const [updated] = await CommMenuModel.update(
      updateData,
      {
        fields: [
          "menuName",
          "menuPath",
          "menuLevel",
          "menuType",
          "menuIcon",
          "upperMenuId",
          "upperMenuName",
          "updUserId",
          "upDttm",
        ],
        where: {
          menuId: {
            [sequelize.Op.eq]: updateData.menuId,
          }
        },
        transaction: t,
      }
    );
    // 메뉴 권한 저장
    if( params?.roles ){
      await CommMenuRoleModel.destroy({
        where: {
          menuId: {
            [sequelize.Op.eq]: updateData.menuId,
          }
        },
        transaction: t
      });
      const roles = CommMenuRoleModel.bulkBuild(params.roles).map((role)=>({
        ...role.onCreate().toJSON(),
        menuId: updateData.menuId,
      }));
      await CommMenuRoleModel.bulkCreate(roles, { transaction: t });
    }
    await t.commit();
    return updated;
  } catch ( error ) {
    await t.rollback();
    throw error;
  }
}

/**
 * 삭제 요청 API
 * - 권한 먼저 삭제
 * @param {*} params 
 * @returns 
 */
export const deleteData = async ( params ) => {
  const t = await getTransaction();
  try {
    const deleteData = CommMenuModel.build(params).toJSON();
    const deletedRole = await CommMenuRoleModel.destroy({
      where: {
        menuId: {
          [sequelize.Op.eq]: deleteData.menuId,
        }
      },
      transaction: t,
    });
    const deleted = await CommMenuModel.destroy({
      where: {
        menuId: {
          [sequelize.Op.eq]: deleteData.menuId,
        }
      },
      transaction: t,
    });
    await t.commit();
    return deleted;
  } catch ( error ) {
    await t.rollback();
    throw error;
  }
}

/**
 * 전체 삭제 요청 API
 * - 권한 먼저 삭제
 * @param {*} params 
 * @returns 
 */
export const deleteAllData = async ( params ) => {
  const t = await getTransaction();
  try {
    const deleteData = CommMenuModel.bulkBuild(params).map((item)=>(
      item.getDataValue('menuId')
    ));
    const deletedRole = await CommMenuRoleModel.destroy({
      where: {
        menuId: {
          [sequelize.Op.in]: deleteData,
        }
      },
      transaction: t,
    });
    const deleted = await CommMenuModel.destroy({
      where: {
        menuId: {
          [sequelize.Op.in]: deleteData,
        }
      },
      transaction: t,
    });
    await t.commit();
    return deleted;
  } catch ( error ) {
    await t.rollback();
    throw error;
  }
}

export default {
  getDataList,
  getDataDetail,
  getDataRole,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

