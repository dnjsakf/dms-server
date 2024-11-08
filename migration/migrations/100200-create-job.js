const JobModel = require('../../src/models/batch/jobModel').default;
const JobScheduleModel = require('../../src/models/batch/jobScheduleModel').default;
const JobExecutionModel = require('../../src/models/batch/jobExecutionModel').default;

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const tableModels = [
      JobModel,
      JobScheduleModel,
      JobExecutionModel,
    ];
    /*************** CREATE TABLE ***************/
    for(const model of tableModels.values()){
      const tableName = model.tableName;
      console.log('Creating table:', tableName);
      await queryInterface.createTable(tableName, model.getAttributes());
      console.log('Table created:', tableName);

      /*************** CREATE INDEX ***************/
      if( model._indexes ){
        for(const index of model._indexes.values()){
          const indexName = index.name || `${tableName}_IDX`;
          console.log('Creating index:', indexName);
          await queryInterface.addIndex(tableName, index.fields, {
            name: indexName,
            unique: true,
          });
          console.log('Index created:', indexName);
        }
      }
      /*************** CREATE INDEX ***************/
    }
    /*************** CREATE TABLE ***************/


    // PK 제약조건 생성
    /*
    await queryInterface.addConstraint(JobModel.tableName, {
      fields: ["JOB_ID"],
      type: 'primary key',
      name: `${JobModel.tableName}_PK`,
    });
    await queryInterface.sequelize.query(`
      ALTER TABLE ${JobModel.tableName} MODIFY JOB_ID BIGINT(22) NOT NULL AUTO_INCREMENT;
    `);

    await queryInterface.addConstraint(JobScheduleModel.tableName, {
      // fields: ["JOB_ID", "SCH_ID"],
      fields: ["SCH_ID"],
      type: 'primary key',
      name: `${JobScheduleModel.tableName}_PK`,
    });
    await queryInterface.sequelize.query(`
      ALTER TABLE ${JobScheduleModel.tableName} MODIFY SCH_ID BIGINT(22) NOT NULL AUTO_INCREMENT;
    `);

    await queryInterface.addConstraint(JobExecutionModel.tableName, {
      // fields: ["JOB_ID", "SCH_ID", "EXEC_ID"],
      fields: ["EXEC_ID"],
      type: 'primary key',
      name: `${JobExecutionModel.tableName}_PK`,
    });
    await queryInterface.sequelize.query(`
      ALTER TABLE ${JobExecutionModel.tableName} MODIFY EXEC_ID BIGINT(22) NOT NULL AUTO_INCREMENT;
    `);
    */

    // FK 제약조건 생성
    let sourceTableName = JobScheduleModel.tableName;
    let targetTableName = JobModel.tableName;
    let constraintName = `${sourceTableName}_${targetTableName}_fk`.toLowerCase();
    await queryInterface.addConstraint(sourceTableName, {
      fields: ["job_id"],
      type: 'foreign key',
      name: constraintName,
      references: {
        table: targetTableName,
        field: "job_id",
      },
    });

    sourceTableName = JobExecutionModel.tableName;
    targetTableName = JobScheduleModel.tableName;
    constraintName = `${sourceTableName}_${targetTableName}_fk`.toLowerCase();
    await queryInterface.addConstraint(sourceTableName, {
      fields: ["job_id","sch_id"],
      type: 'foreign key',
      name: constraintName,
      references: {
        table: targetTableName,
        fields: ["job_id","sch_id"],
      },
    });  
  },
  down: async (queryInterface, Sequelize) => {
    let removeFK = `${JobExecutionModel.tableName}_${JobScheduleModel.tableName}_fk`.toLowerCase();
    console.log('Removing constraint', removeFK);
    await queryInterface.removeConstraint(JobExecutionModel.tableName, removeFK);
    console.log('Constraint removed', removeFK);

    removeFK = `${JobScheduleModel.tableName}_${JobModel.tableName}_fk`.toLowerCase();
    console.log('Removing constraint', removeFK);
    await queryInterface.removeConstraint(JobScheduleModel.tableName, removeFK);
    console.log('Constraint removed', removeFK);

    const tableModels = [
      JobModel,
      JobScheduleModel,
      JobExecutionModel,
    ];
    /*************** DROP TABLE ***************/
    for(const model of tableModels.values()){

      /*************** DROP INDEX ***************/
      if( model._indexes ){
        for(const index of model._indexes.values()){
          const indexName = `${index.name}`.toLowerCase();
          console.log('Dropping index:', indexName);
          await queryInterface.query(`
            DROP INDEX ${indexName}
          `);
          console.log('Index dropped:', indexName);
        }
      }
      /*************** DROP INDEX ***************/

      const tableName = model.tableName;
      console.log('Dropping table:', tableName);
      await queryInterface.dropTable(tableName);
      console.log('Table dropped:', tableName);
    }
    /*************** DROP TABLE ***************/
  },
};
