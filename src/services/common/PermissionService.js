import sequelize from 'sequelize';
import CommPermissionModel from '../../models/common/commPermissionModel';

export const getDataList = async ( params ) => {
  try {
    const list = await CommPermissionModel.findAll({
      attributes: [
        'permissionId',
        'permissionName',
        'useYn',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm',
      ],
      where: {
        // permissionName: { [sequelize.Op.like]: params.roleName }
      },
      order: [ 
        ['permissionId', 'ASC']
      ],
    });
    return list;
  } catch ( error ){
    throw error;
  }
}

export const getDataDetail = async ( params ) => {
  try {
    const detail = await CommPermissionModel.findByPk(params.permissionId, {
      attributes: [
        'permissionId',
        'permissionName',
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

export const createData = async ( params ) => {
  try {
    const createData = (await CommPermissionModel.build(params).onCreate()).toJSON();
    const created = await CommPermissionModel.create(createData);
    return created;
  } catch ( error ) {
    throw error;
  }
}

export const updateData = async ( params ) => {
  try {
    const updateData = CommPermissionModel.build(params).onUpdate().toJSON();
    const updated = await CommPermissionModel.update(
      updateData,
      {
        fields: [
          'permissionName',
          'updUserId',
          'updDttm',
        ],
        where: {
          permissionId: {
            [sequelize.Op.eq]: updateData.permissionId,
          }
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
    const deleteData = CommPermissionModel.build(params).toJSON();
    const deleted = await CommPermissionModel.destroy({
      where: {
        permissionId: {
          [sequelize.Op.eq]: deleteData.permissionId,
        }
      }
    });
    return deleted;
  } catch ( error ) {
    throw error;
  }
}

export const deleteAllData = async ( params ) => {
  try {
    const deleteData = CommPermissionModel.bulkBuild(params).map((item)=>(
      item.getDataValue('permissionId')
    ));
    const deleted = await CommPermissionModel.destroy({
      where: {
        permissionId: {
          [sequelize.Op.in]: deleteData
        }
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
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

