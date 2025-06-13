import sequelize from 'sequelize';
import CommGroupModel from '../../models/common/commGroupModel';

export const getDataList = async ( params ) => {
  try {
    const list = await CommGroupModel.findAll({
      attributes: [
        'groupId',
        'groupType',
        'groupName',
        'groupLevel',
        'groupPath',
        'groupIcon',
        'upperGroupId',
        'upperGroupName',
        'useYn',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm',
      ],
      where: {
        // groupName: { [sequelize.Op.like]: params.groupName }
      },
      order: [ 
        ['groupName', 'ASC']
      ],
    });
    return list;
  } catch ( error ){
    throw error;
  }
}

export const getDataDetail = async ( params ) => {
  try {
    const detail = await CommGroupModel.findByPk(params.groupId, {
      attributes: [
        'groupId',
        'groupType',
        'groupName',
        'groupLevel',
        'groupPath',
        'groupIcon',
        'upperGroupId',
        'upperGroupName',
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
    const createData = (await CommGroupModel.build(params).onCreate()).toJSON();
    const created = await CommGroupModel.create(createData);
    return created;
  } catch ( error ) {
    throw error;
  }
}

export const updateData = async ( params ) => {
  try {
    const updateData = CommGroupModel.build(params).onUpdate().toJSON();
    const updated = await CommGroupModel.update(
      updateData,
      {
        fields: [
          'roleName',
          'updUserId',
          'updDttm',
        ],
        where: {
          groupId: {
            [sequelize.Op.eq]: updateData.groupId,
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
    const deleteData = CommGroupModel.build(params).toJSON();
    const deleted = await CommGroupModel.destroy({
      where: {
        groupId: {
          [sequelize.Op.eq]: deleteData.groupId,
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
    const deleteData = CommGroupModel.bulkBuild(params).map((item)=>(
      item.getDataValue('groupId')
    ));
    const deleted = await CommGroupModel.destroy({
      where: {
        groupId: {
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

