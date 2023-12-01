const sequelize = require('../config/connection');
const { User, Budget, Category } = require('../models');

const userData = require('./userData.json');
const budgetData = require('./budgetData.json');
const categoryData = require('./categoryData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const categories = await Category.bulkCreate(categoryData, {
    returning: true,
  });

  for (const budget of budgetData) {
    await Budget.create({
      ...budget,
      user_id: users[Math.floor(Math.random() * users.length)].id,
      category_id: categories[Math.floor(Math.random() * categories.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();
