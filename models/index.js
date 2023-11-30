const Budget = require('./Budget');
const User = require('./User');
const Category = require('./Category');

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



module.exports = { User, Budget, Category };