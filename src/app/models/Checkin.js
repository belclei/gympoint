import { Model, Sequelize } from 'sequelize';

class Checkin extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );
    this.removeAttribute('id');
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default Checkin;
