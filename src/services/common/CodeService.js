import sequelize from 'sequelize';
import { getTransaction } from '../../config/dbConfig';
import CommCodeModel from '../../models/common/commCodeModel';
import CommCodeItemModel from '../../models/common/commCodeItemModel';

/**
 * 목록 요청 API
 * @param {*} params 
 * @returns 
 */
export const getDataList = async ( params ) => {
  try {
    const conditions = {};
    if ( params.codeName ) {
      conditions.codeName = { [sequelize.Op.like]: `%${params.codeName}%` };
    }
    if ( params.codeDesc ) {
      conditions.codeDesc = { [sequelize.Op.like]: `%${params.codeDesc}%` };
    }
    if ( params.realValue ) {
      conditions.realValue = { [sequelize.Op.like]: `%${params.realValue}%` };
    }
    const list = await CommCodeModel.findAll({
      attributes: [
        "codeId",
        "codeName",
        "codeDesc",
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
    if ( params.codeName ) {
      conditions.codeName = { [sequelize.Op.like]: `%${params.codeName}%` };
    }
    if ( params.codeDesc ) {
      conditions.codeDesc = { [sequelize.Op.like]: `%${params.codeDesc}%` };
    }
    if ( params.realValue ) {
      conditions.realValue = { [sequelize.Op.like]: `%${params.realValue}%` };
    }

    const { count, rows } = await CommCodeModel.findAndCountAll({
      attributes: [
        "codeId",
        "codeName",
        "codeDesc",
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
    const detail = await CommCodeModel.findByPk(params.codeId, {
      attributes: [
        "codeId",
        "codeName",
        "codeDesc",
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
    const createData = (await CommCodeModel.build(params).onCreate()).toJSON();
    const created = await CommCodeModel.create(createData, { transaction: t });
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
    const updateData = CommCodeModel.build(params).onUpdate().toJSON();
    const [updated] = await CommCodeModel.update(
      updateData,
      {
        fields: [
          "codeName",
          "codeDesc",
          "realValue",
          "sortOrder",
          "useYn",
          "updUserId",
          "updDttm",
        ],
        where: {
          codeId: {
            [sequelize.Op.eq]: updateData.codeId,
          }
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
    const deleteData = CommCodeModel.build(params).toJSON();
    const deleteRelated = await CommCodeItemModel.destroy({
      where: {
        codeId: {
          [sequelize.Op.eq]: deleteData.codeId,
        }
      },
      transaction: t,
    });
    const deleted = await CommCodeModel.destroy({
      where: {
        codeId: {
          [sequelize.Op.eq]: deleteData.codeId,
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
 * @param {*} params 
 * @returns 
 */
export const deleteAllData = async ( params ) => {
  const t = await getTransaction();
  try {
    const deleteData = CommCodeModel.bulkBuild(params).map((item)=>(
      item.getDataValue('codeId')
    ));
    const deleteRelated = await CommCodeItemModel.destroy({
      where: {
        codeId: {
          [sequelize.Op.in]: deleteData,
        }
      },
      transaction: t,
    });
    const deleted = await CommCodeModel.destroy({
      where: {
        codeId: {
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
  getDataPage,
  getDataDetail,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

