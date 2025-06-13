import sequelize from 'sequelize';
import { getTransaction } from '../../config/dbConfig';
import CommCodeItemModel from '../../models/common/commCodeItemModel';

/**
 * 목록 요청 API
 * @param {*} params 
 * @returns 
 */
export const getDataList = async ( params ) => {
  try {
    const conditions = {};
    if ( params.codeId ) {
      conditions.codeId = { [sequelize.Op.eq]: params.codeId };
    }
    if ( params.codeItemName ) {
      conditions.codeItemName = { [sequelize.Op.like]: `%${params.codeItemName}%` };
    }
    if ( params.codeItemDesc ) {
      conditions.codeItemDesc = { [sequelize.Op.like]: `%${params.codeItemDesc}%` };
    }
    if ( params.realValue ) {
      conditions.realValue = { [sequelize.Op.like]: `%${params.realValue}%` };
    }
    const list = await CommCodeItemModel.findAll({
      attributes: [
        "codeId",
        "codeItemId",
        "codeItemName",
        "codeItemDesc",
        "realValue",
        "sortOrder",
        "useYn",
        "regUserId",
        "regDttm",
        "updUserId",
        "updDttm",
      ],
      where: conditions,
      order: [ 
        ['sortOrder', 'ASC']
      ],
    });
    return list;
  } catch ( error ){
    throw error;
  }
}

/**
 * 목록 Page 요청 API
 * @param {*} params 
 * @returns 
 */
export const getDataPage = async ( params ) => {
  try {
    const page = (params.page||1);
    const rowsPerPage = (params.rowsPerPage||10);
    const limit = rowsPerPage; // 페이지당 레코드 수
    const offset = (page - 1) * rowsPerPage; // 시작 위치

    const conditions = {};
    if ( params.codeId ) {
      conditions.codeId = { [sequelize.Op.eq]: params.codeId };
    }
    if ( params.codeItemName ) {
      conditions.codeItemName = { [sequelize.Op.like]: `%${params.codeItemName}%` };
    }
    if ( params.codeItemDesc ) {
      conditions.codeItemDesc = { [sequelize.Op.like]: `%${params.codeItemDesc}%` };
    }
    if ( params.realValue ) {
      conditions.realValue = { [sequelize.Op.like]: `%${params.realValue}%` };
    }

    const { count, rows } = await CommCodeItemModel.findAndCountAll({
      attributes: [
        "codeId",
        "codeItemId",
        "codeItemName",
        "codeItemDesc",
        "realValue",
        "sortOrder",
        "useYn",
        "regUserId",
        "regDttm",
        "updUserId",
        "updDttm",
      ],
      where: conditions,
      order: [ 
        ['sortOrder', 'ASC']
      ],
      limit,
      offset,
    });

    // 행 번호 추가
    const dataWithRowNumbers = rows.map((row, index) => ({
      ...row.toJSON(),
      rn: offset + index + 1
    }));

    return {
      totalItems: count,
      totalPages: Math.ceil(count / rowsPerPage),
      currentPage: page,
      data: dataWithRowNumbers
  };
  } catch ( error ){
    throw error;
  }
}

/**
 * 상세 요청 API
 * @param {*} params 
 * @returns 
 */
export const getDataDetail = async ( params ) => {
  try {
    const detail = await CommCodeItemModel.findByPk({
      codeId: params.codeId,
      codeItemId: params.codeItemId,
    }, {
      attributes: [
        "codeId",
        "codeItemId",
        "codeItemName",
        "codeItemDesc",
        "realValue",
        "sortOrder",
        "useYn",
        "regUserId",
        "regDttm",
        "updUserId",
        "updDttm",
      ],
    });
    return detail;
  } catch ( error ) {
    throw error;
  }
}

/**
 * 등록 요청 API
 * @param {*} params 
 * @returns 
 */
export const createData = async ( params ) => {
  const t = await getTransaction();
  try {
    const createData = (await CommCodeItemModel.build(params).onCreate()).toJSON();
    const created = await CommCodeItemModel.create(createData, { transaction: t });
    await t.commit();
    return created;
  } catch ( error ) {
    await t.rollback();
    throw error;
  }
}

/**
 * 수정 요청 API
 * @param {*} params 
 * @returns 
 */
export const updateData = async ( params ) => {
  const t = await getTransaction();
  try {
    const updateData = CommCodeItemModel.build(params).onUpdate().toJSON();
    const [updated] = await CommCodeItemModel.update(
      updateData,
      {
        fields: [
          "codeItemName",
          "codeItemDesc",
          "realValue",
          "sortOrder",
          "useYn",
          "updUserId",
          "updDttm",
        ],
        where: {
          [sequelize.Op.or]: [
            {
              codeId: updateData.codeId,
              codeItemId: updateData.codeItemId,
            }
          ],
        },
        transaction: t,
      }
    );
    await t.commit();
    return updated;
  } catch ( error ) {
    await t.rollback();
    throw error;
  }
}

/**
 * 삭제 요청 API
 * @param {*} params 
 * @returns 
 */
export const deleteData = async ( params ) => {
  const t = await getTransaction();
  try {
    const deleteData = CommCodeItemModel.build(params).toJSON();
    const deleted = await CommCodeItemModel.destroy({
      where: {
        [sequelize.Op.and]: [
          {
            codeId: deleteData.codeId,
            codeItemId: deleteData.codeItemId,
          }
        ],
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
 * @param {*} params 
 * @returns 
 */
export const deleteAllData = async ( params ) => {
  const t = await getTransaction();
  try {
    const deleteData = CommCodeItemModel.bulkBuild(params).map((item)=>({
      codeId: item.getDataValue('codeId'),
      codeItemId: item.getDataValue('codeItemId')
    }));
    const deleted = await CommCodeItemModel.destroy({
      where: {
        [sequelize.Op.or]: deleteData,
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
  getDataPage,
  getDataDetail,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

