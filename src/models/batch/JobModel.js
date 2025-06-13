import { Sequelize, DataTypes } from 'sequelize';
import BaseModel from '../baseModel';

class Job extends BaseModel {}
Job.init({
  jobId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'job_id',
    comment: 'JOB ID',
  },
  jobName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'job_name',
    comment: 'JOB 명',
  },
  jobParams: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'job_params',
    comment: 'JOB 파라미터',
  },
  jobDesc: {
    type: DataTypes.STRING(4000),
    allowNull: true,
    field: 'job_desc',
    comment: 'JOB 설명',
  },
  pauseYn: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'N',
    field: 'puase_yn',
    comment: '일시중지 여부',
  },
  useYn: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'Y',
    field: 'use_yn',
    comment: '사용여부',
  },
}, {
  modelName: 'Job',
  tableName: 'dms_job',
  comment: 'JOB',
  indexes: [
    {
      name: 'dms_job_idx01',
      unique: true,
      fields: ['job_id']
    },
  ],
});
Job.removeAttribute('id');

export default Job;

