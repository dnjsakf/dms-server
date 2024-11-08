import { Sequelize, DataTypes } from 'sequelize';
import BaseModel from '../baseModel';

class JobSchedule extends BaseModel {}
JobSchedule.init({
  jobId: {
    type: DataTypes.BIGINT,
    // primaryKey: true,
    field: 'job_id',
    comment: 'JOB ID',
  },
  schId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    field: 'sch_id',
    comment: 'SCH ID',
  },
  taskId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'task_id',
    comment: 'TASK ID',
  },
  schType: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'sch_type',
    comment: '스케줄 유형: crontab, datetime',
  },
  schedule: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: 'schedule',
    comment: '스케줄, crontab:crontab, datetime:지정시간',
  },
  schStartDttm: {
    type: DataTypes.STRING(14),
    allowNull: true,
    field: 'sch_start_dttm',
    comment: '스케줄 시작 시간',
  },
  schEndDttm: {
    type: DataTypes.STRING(14),
    allowNull: true,
    field: 'sch_end_dttm',
    comment: '스케줄 종료 시간',
  },
  schRegDttm: {
    type: DataTypes.STRING(14),
    allowNull: true,
    field: 'sch_reg_dttm',
    comment: '스케줄 등록 시간',
  },
  taskNextDttm: {
    type: DataTypes.STRING(14),
    allowNull: true,
    field: 'sch_next_dttm',
    comment: 'TASK 다음 실행 시간',
  },
  schLastCompDttm: {
    type: DataTypes.STRING(14),
    allowNull: true,
    field: 'sch_next_dttm',
    comment: '스케줄 완료 시간',
  },
  schLastDttm: {
    type: DataTypes.STRING(14),
    allowNull: true,
    field: 'sch_next_dttm',
    comment: '스케줄 마지막 실행 시간',
  },
  pauseYn: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'N',
    field: 'pause_yn',
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
  tableName: 'dms_job_schedule',
  comment: 'JOB 스케줄',
  indexes: [
    {
      name: 'dms_job_schedule_idx01',
      unique: true,
      fields: ['job_id', 'sch_id']
    },
  ],
});
JobSchedule.removeAttribute('id');

export default JobSchedule;

