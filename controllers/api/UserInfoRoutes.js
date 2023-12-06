const router = require('express').Router();
const { UserInfo, User } = require('../../models');
const express = require('express');
const withAuth = require("../../utils/auth");

router.post("/", withAuth, async (req, res) => {
  try {
    const newUserInfo = await UserInfo.create({
      ...req.body,
      user_id: req.session.user_id,
      include: { model: User },
    });
    res.status(200).json(newUserInfo);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update userInfo by ID
// router.put("/updateinfo/:user_id", async (req, res) => {
//   try {
//     const newUserInfo = await UserInfo.update(req.body,{
//       where: { 
//         id: req.session.user_id,
//       },
//       include: {model: User}
//     });
//     res.json({ newUserInfo, message: "budget updated" });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

router.put("/:userInfoId", async (req, res) => {
  try {
    const newUserInfo = await UserInfo.update(req.body, {
      where: { id: req.params.userInfoId },
    });
    res.json({ newUserInfo, message: "user info updated" });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/userinfo/', async (req, res) => {
  try {
    const userInfoData = await UserInfo.findOne({
      where: {
        ...req.body,
        user_id: req.session.user_id,
      },
      include: {model: User}
    })
    res.status(200).json(userInfoData);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
})


module.exports = router;