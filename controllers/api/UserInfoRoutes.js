const router = require('express').Router();
const { UserInfo } = require('../../models');
const express = require('express');

router.post("/", async (req, res) => {
  try {
    const newUserInfo = await UserInfo.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newUserInfo);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update userInfo by ID
router.put("/:infoId", async (req, res) => {
  try {
    const newUserInfo = await UserInfo.update(req.body, {
      where: { id: req.params.infoId },
    });
    res.json({ newUserInfo, message: "budget updated" });
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;