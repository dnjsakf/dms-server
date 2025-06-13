import sequelize from 'sequelize';
import JobModel from '../../models/batch/jobModel';

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
    const list = await JobModel.findAll({
      attributes: [
        'jobId',
        'jobName',
        'jobParams',
        'jobDesc',
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
      ],
    });
    return list;
  } catch ( error ) {
    throw error;
  }
}

export const getDataDetail = async ( params ) => {
  try {
    const detail = await JobModel.findByPk(params.jobId, {
      attributes: [
        'jobId',
        'jobName',
        'jobParams',
        'jobDesc',
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
    const created = await JobModel.create(params);
    return created;
  } catch ( error ) {
    throw error;
  }
}

export const updateData = async ( params ) => {
  try {
    params.onUpdate();
    const updateFields = [
      'jobName',
      'jobParams',
      'jobDesc',
      'pauseYn',
      'useYn'
    ];
    const updateData = {}
    if( params ){
      for(const [key, value] of Object.entries(params)){
        if( updateFields.includes(key) ){
          updateData[key] = value;
        }
      }
    }
    const updated = await JobModel.update(
      updateData,
      {
        where: {
          jobId: {
            [sequelize.Op.eq]: params.jobId,
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
    const deleted = await JobModel.destroy({
      where: {
        jobId: {
          [sequelize.Op.eq]: params.jobId,
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
    const deleted = await JobModel.destroy({
      where: {
        jobId: {
          [sequelize.Op.in]: params?.map(({ jobId })=>( jobId )),
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
