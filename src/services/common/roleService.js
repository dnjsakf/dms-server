import sequelize from 'sequelize';
import CommRoleModel from '../../models/common/commRoleModel';
import CommMenuRoleModel from '../../models/common/commMenuRoleModel';

export const getDataList = async ( params ) => {
  try {
    const conditions = {};
    if ( params.roleId ) {
      conditions.roleId = { [sequelize.Op.eq]: `%${params.roleId}%` };
    }
    if ( params.roleName ) {
      conditions.roleName = { [sequelize.Op.like]: `%${params.roleName}%` };
    }
    if ( params.roleNameList && Array.isArray(params.roleNameList) ) {
      conditions.roleName = { [sequelize.Op.in]: params.roleNameList };
    }
    const list = await CommRoleModel.findAll({
      attributes: [
        'roleId',
        'roleName',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm',
      ],
      where: conditions,
      order: [ 
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
    const detail = await CommRoleModel.findByPk(params.roleId, {
      attributes: [
        'roleId',
        'roleName',
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
    const createData = CommRoleModel.build(params).onCreate().toJSON();
    const created = await CommRoleModel.create(createData);
    return created;
  } catch ( error ) {
    throw error;
  }
}

export const updateData = async ( params ) => {
  try {
    const updateData = CommRoleModel.build(params).onUpdate().toJSON();
    const updated = await CommRoleModel.update(
      updateData,
      {
        fields: [
          'roleName',
          'updUserId',
          'updDttm',
        ],
        where: {
          roleId: {
            [sequelize.Op.eq]: updateData.roleId,
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
    const deleteData = CommRoleModel.build(params).toJSON();
    const deleted = await CommRoleModel.destroy({
      where: {
        roleId: {
          [sequelize.Op.eq]: deleteData.roleId,
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
    const deleteData = CommRoleModel.bulkBuild(params).map((item)=>(
      item.getDataValue('roleId')
    ));
    const deleted = await CommRoleModel.destroy({
      where: {
        roleId: {
          [sequelize.Op.in]: deleteData,
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

