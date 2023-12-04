const router = require("express").Router();
const { Budget, User, Category, UserInfo } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  res.render("homepage");
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signup");
});

// Get route for dashboard page, renders all data
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Budget }],
    });
    const budgetData = await Budget.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    const categoryData = await Category.findAll();
    const categories = categoryData.map((category) =>
      category.get({ plain: true })
    );
    const userInfoData = await UserInfo.findAll({
      include: [{ model: User }],
    });
    const userInfo = userInfoData.map((info) => info.get({ plain: true }));
    const budgets = budgetData.map((budget) => budget.get({ plain: true }));
    const user = userData.get({ plain: true });
    console.log(user);
    res.render("dashboard", {
      ...user,
      budgets,
      categories,
      userInfo,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/logout", (req, res) => {
  res.redirect("/");
});

module.exports = router;
