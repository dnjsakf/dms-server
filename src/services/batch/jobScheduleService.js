import sequelize from 'sequelize';
import JobScheduleModel from '../../models/batch/jobScheduleModel';

export const getDataList = async ( params ) => {
  try {
    const conditions = {}
    switch(true){
      case params?.hasOwnProperty('jobName'):
        conditions.jobName = {
          [sequelize.Op.like]: `%${params.jobName}%`,
        }
        break;
    }
    const list = await JobScheduleModel.findAll({
      attributes: [
        'jobId',
        'schId',
        'taskId',
        'schType',
        'schedule',
        'schStartDttm',
        'schEndDttm',
        'schRegDttm',
        'taskNextDttm',
        'schLastCompDttm',
        'schLastDttm',
        'pauseYn',
        'useYn',
        'regUserId',
        'regDttm',
        'updUserId',
        'updDttm',
      ],
      where: conditions,
      order: [
        ['jobId', 'DESC'],
        ['schId', 'DESC'],
      ],
    });
    return list;
  } catch ( error ) {
    throw error;
  }
}

export const getDataDetail = async ( params ) => {
  try {
    const detail = await JobScheduleModel.findByPk(params.jobId, {
      attributes: [
        'jobId',
        'schId',
        'taskId',
        'schType',
        'schedule',
        'schStartDttm',
        'schEndDttm',
        'schRegDttm',
        'taskNextDttm',
        'schLastCompDttm',
        'schLastDttm',
        'pauseYn',
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
    params.onCreate();
    const created = await JobScheduleModel.create(params);
    return created;
  } catch ( error ) {
    throw error;
  }
}

export const updateData = async ( params ) => {
  try {
    params.onUpdate();
    const updateFields = [
      'taskId',
      'schType',
      'schedule',
      'schStartDttm',
      'schEndDttm',
      'schRegDttm',
      'taskNextDttm',
      'schLastCompDttm',
      'schLastDttm',
      'pauseYn',
      'useYn',
    ];
    const updateData = {}
    if( params ){
      for(const [key, value] of Object.entries(params)){
        if( updateFields.includes(key) ){
          updateData[key] = value;
        }
      }
    }
    const updated = await JobScheduleModel.update(
      updateData,
      {
        where: {
          jobId: {
            [sequelize.Op.eq]: params.jobId,
          },
          schId: {
            [sequelize.Op.eq]: params.schId,
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
    const deleted = await JobScheduleModel.destroy({
      where: {
        jobId: {
          [sequelize.Op.eq]: params.jobId,
        },
        schId: {
          [sequelize.Op.eq]: params.schId,
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
    const deleted = await JobScheduleModel.destroy({
      where: {
        jobId: {
          [sequelize.Op.in]: params?.map(({ jobId })=>( jobId )),
        },
        schId: {
          [sequelize.Op.in]: params?.map(({ schId })=>( schId )),
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
  createData,
  updateData,
  deleteData,
  deleteAllData,
}