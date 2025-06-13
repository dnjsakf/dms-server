import sequelize from 'sequelize';
import CommUserRoleModel from '../../models/common/commUserRoleModel';

export const getDataList = async ( params ) => {
  try {
    const list = await CommUserRoleModel.findAll({
      attributes: [
        'userId',
        'roleId',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm',
      ],
      where: {
        // userName: { [sequelize.Op.like]: params.userName }
      },
      order: [ 
        ['userId', 'ASC'],
        ['roleId', 'ASC']
      ],
    });
    return list;
  } catch ( error ){
    throw error;
  }
}

export const getDataDetail = async ( params ) => {
  try {
    const detail = await CommUserRoleModel.findByPk({
      userId: params.userId,
      roleId: params.roleId,
    }, {
      attributes: [
        'userId',
        'roleId',
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

export const getDataLogin = async ( params ) => {
  try {
    const data = await CommUserRoleModel.findOne({
      where: {
        loginId: {
          [sequelize.Op.eq]: params?.loginId,
        }
      }
    });
    return data;
  } catch ( error ) {
    throw error;
  }
}

export const createData = async ( params ) => {
  try {
    const createData = (await CommUserRoleModel.build(params).onCreate()).toJSON()
    const created = await CommUserRoleModel.create(createData);
    return created;
  } catch ( error ) {
    throw error;
  }
}

export const updateData = async ( params ) => {
  try {
    const updateData = CommUserRoleModel.build(params).onUpdate();
    const updated = await CommUserRoleModel.update(
      updateData,
      {
        fields: [
          'updUserId',
          'updDttm',
        ],
        where: {
          userId: {
            [sequelize.Op.eq]: updateData.userId,
          },
          roleId: {
            [sequelize.Op.eq]: updateData.roleId,
          },
        }
      }
    );
    return updated;
  } catch ( error ) {
    throw error;
  }
}

export const deleteData = async ( params ) => {
  try {
    const deleteData = CommUserRoleModel.build(params).toJSON();
    const deleted = await CommUserRoleModel.destroy({
      where: {
        userId: {
          [sequelize.Op.eq]: deleteData.userId,
        },
        roleId: {
          [sequelize.Op.eq]: deleteData.roleId,
        },
      }
    });
    return deleted;
  } catch ( error ) {
    throw error;
  }
}

export const deleteAllData = async ( params ) => {
  try {
    const deleteData = CommUserRoleModel.bulkBuild(params).map((item)=>(
      item.getDataValue('userId')
    ));
    const deleted = await CommUserRoleModel.destroy({
      where: {
        userId: {
          [sequelize.Op.in]: deleteData,
        },
      }
    });
    return deleted;
  } catch ( error ) {
    throw error;
  }
}

export default {
  getDataList,
  getDataDetail,
  getDataLogin,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

