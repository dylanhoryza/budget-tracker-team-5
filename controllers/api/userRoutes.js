const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrpyt');
const express = require('express');


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













module.exports = router;