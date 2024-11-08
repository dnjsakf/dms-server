import { DataTypes, Model, literal } from 'sequelize';
import sequelize from '../config/dbConfig';
import dayjs from 'dayjs';

class BaseModel extends Model {
  static init(attributes, options){
    super.init({
      ...attributes,
      regUserId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'reg_user_id',
        comment: '등록자 ID',
      },
      regDttm: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: literal('CURRENT_TIMESTAMP'),
        field: 'reg_dttm',
        comment: '등록일시',
        get(){
          return dayjs(this.getDataValue('regDttm')).format('YYYY-MM-DD HH:mm:ss');
        }
      },
      updUserId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'upd_user_id',
        comment: '수정자 ID',
      },
      updDttm: {
        type: DataTypes.DATE,
        allowNull: false,
        // defaultValue: literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        // defaultValue: literal('CURRENT_TIMESTAMP'),
        field: 'upd_dttm',
        comment: '수정일시',
        get(){
          return dayjs(this.getDataValue('updDttm')).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    }, {
      ...options,
      sequelize: sequelize,
      noPrimaryKey: true, // 기본 키 자동 추가 방지 
      timestamps: false, // 생성/수정 일자 자동 추가 방지
    });
  }

  onCreate(){
    const now = dayjs().toDate();
    this.setDataValue('regUserId', 'SYSTEM');
    this.setDataValue('regDttm', now);
    this.setDataValue('updUserId', 'SYSTEM');
    this.setDataValue('updDttm', now);
    return this;
  }

  onUpdate(){
    const now = dayjs().toDate();
    this.setDataValue('updUserId', 'SYSTEM');
    this.setDataValue('updDttm', now);
    return this;
  }
}

export default BaseModel;
