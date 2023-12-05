const router = require("express").Router();
const { Budget } = require("../../models");
const withAuth = require("../../utils/auth");

// Create new budget, need to add withAuth
router.post("/", withAuth, async (req, res) => {
  try {
    const newBudget = await Budget.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newBudget);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update budget by ID
router.put("/:budgetId", async (req, res) => {
  try {
    const budgetData = await Budget.update(req.body, {
      where: { id: req.params.budgetId },
    });
    res.json({ budgetData, message: "budget updated" });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// just for testing
router.get("/allbudgets", async (req, res) => {
  try {
    const budgetData = await Budget.findAll();
    res.json(budgetData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// delete route needs withAuth
router.delete('/:budgetId', async (req, res) => {
  try {
    const budgetData = await Budget.destroy({
      where: {
        id: req.params.budgetId,
        user_id: req.session.user_id,
      },
    });

    if (!budgetData) {
      res.status(404).json({ message: 'No budget found with this id!' });
      return;
    }

    res.status(200).json(budgetData);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
