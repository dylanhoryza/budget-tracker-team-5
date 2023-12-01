const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');
const express = require('express');




//create user
router.post('/', async (req, res) => {
    try {
        //user register data
        const { name, email, password } = req.body;

        //verify this email is not already in use
        const existingUser = await User.findOne({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email in use"})
        }

        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user

        const newUser = await User.create({
            name, 
            email,
            password: hashedPassowrd,
        });
        //respond with new user
        res.status(201).json(newUser);
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Internal error'});
    }
})



//login for API
router.post('/login', async (req, res) => {
    try {
        //finding user by email
        const user = await User.findOne({
            where: { email: req.body.email }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or Password' });
        }
        const validPass = user.checkPassword(req.body.password);


        //password not valid, return error
        if (!validPass) {
            return res.status(400).json({ message: 'Invalid email or Password' });
        }
        //successful login
        res.json({ message: 'Login successful' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Invalid Server' });
    }
});

//logout API
router.post('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).json({ message: 'Internal server error' });
            } else {
                //clear cookies
                res.clearCookie(//need to put our cookie name if specific?? 
                )
                res.json({ message: 'Logout successful' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "internal server error" });
    }
}
);







router.get('/all', async(req, res) => {
    try {
      const userData = await User.findAll()
      res.json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  })



module.exports = router;