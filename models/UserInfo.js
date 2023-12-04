const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class UserInfo extends Model {}

UserInfo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    monthly_income: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      unique: true,
    },
    savings_goal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'userInfo',
  }
);

module.exports = UserInfo;