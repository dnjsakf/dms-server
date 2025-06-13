import { Sequelize, DataTypes } from 'sequelize';
import BaseModel from '../baseModel';

class JobExecution extends BaseModel {}
JobExecution.init({
  schId: {
    type: DataTypes.BIGINT,
    // primaryKey: true,
    field: 'sch_id',
    comment: '스케줄 ID',
  },
  jobId: {
    type: DataTypes.BIGINT,
    // primaryKey: true,
    field: 'job_id',
    comment: 'JOB ID',
  },
  execId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    field: 'exec_id',
    comment: '실행 ID',
  },
  execStatus: {
    type: DataTypes.STRING(16),
    allowNull: false,
    defaultValue: 'init',
    field: 'exec_status',
    comment: '실행상태, init, ready, running, completed, puase, error',
  },
  execMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'exec_message',
    comment: '실행메시지',
  },
  execStartDttm: {
    type: DataTypes.STRING(14),
    allowNull: true,
    field: 'exec_start_dttm',
    comment: '실행 시작 시간',
  },
  execEndDttm: {
    type: DataTypes.STRING(14),
    allowNull: true,
    field: 'exec_end_dttm',
    comment: '실행 종료 시간',
  },
  runtime: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'runtime',
    comment: '작업시간',
  },
}, {
  modelName: 'Job',
  tableName: 'dms_job_execution',
  comment: 'JOB 실행',
  indexes: [
    {
      name: 'dms_job_execution_idx01',
      unique: true,
      fields: ['job_id', 'sch_id', 'exec_id']
    },
  ],
});
JobExecution.removeAttribute('id');

export default JobExecution;

