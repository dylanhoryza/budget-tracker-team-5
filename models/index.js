const Budget = require('./Budget');
const User = require('./User');
const Category = require('./Category');
const UserInfo = require('./UserInfo');

User.hasMany(Budget, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Budget.belongsTo(User, {
  foreignKey: 'user_id'
});

Budget.belongsTo(Category, {
  foreignKey: 'category_id'
});

UserInfo.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});


module.exports = { User, Budget, Category, UserInfo };