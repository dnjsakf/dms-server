import sequelize from 'sequelize';
import { getTransaction } from '../../config/dbConfig';
import roleService from './roleService';
import CommUserModel from '../../models/common/commUserModel';
import CommUserRoleModel from '../../models/common/commUserRoleModel';

export const getDataList = async ( params ) => {
  try {
    const list = await CommUserModel.findAll({
      attributes: [
        'userId',
        'loginId',
        'userName',
        'userEmail',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm',
      ],
      where: {
        // userName: { [sequelize.Op.like]: params.userName }
      },
      order: [ 
        ['userName', 'ASC']
      ],
    });
    return list;
  } catch ( error ){
    throw error;
  }
}

export const getDataDetail = async ( params ) => {
  try {
    const detail = await CommUserModel.findByPk(params.userId, {
      attributes: [
        'userId',
        'loginId',
        'userName',
        'userEmail',
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
    const data = await CommUserModel.findOne({
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
  const t = await getTransaction();
  try {
    const createData = (await CommUserModel.build(params).onCreate()).toJSON()
    const created = await CommUserModel.create(createData, { transaction: t });
    if( created ){
      const roles = await roleService.getDataList({
        roleNameList: [ "USER", "GUEST" ]
      });
      if( roles ){
        const createdUser = created.toJSON();
        const userRoles = CommUserRoleModel.bulkBuild(roles.map((role)=>({
          userId: createdUser.userId,
          roleId: role.getDataValue("roleId"),
        }))).map((userRole)=>{
          userRole.onCreate();
          return userRole.toJSON();
        });
        (await CommUserRoleModel.bulkCreate(userRoles, { transaction: t }));
      }
    }
    await t.commit();
    return created;
  } catch ( error ) {
    await t.rollback();
    throw error;
  }
}

export const updateData = async ( params ) => {
  try {
    const updateData = CommUserModel.build(params).onUpdate();
    const updated = await CommUserModel.update(
      updateData,
      {
        fields: [
          'userName',
          'userEmail',
          'updUserId',
          'updDttm',
        ],
        where: {
          userId: {
            [sequelize.Op.eq]: updateData.userId,
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
    const deleteData = CommUserModel.build(params).toJSON();
    const deleted = await CommUserModel.destroy({
      where: {
        userId: {
          [sequelize.Op.eq]: deleteData.userId,
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
      item.getDataValue('userId')
    ));
    const deleted = await CommUserModel.destroy({
      where: {
        userId: {
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
  getDataLogin,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

