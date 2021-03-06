const express = require('express'),
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    passport = require('passport'),
    router = express.Router();

//load user model

require('../models/User');
const User = mongoose.model('users');


//user login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//user register route
router.get('/register', (req, res) => {
    res.render('users/register');
})

//Login form post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


//Register form post
router.post('/register', (req, res) => {
    // console.log(req.body);
    // res.send('register');

    let errors = [];
    if (req.body.password !== req.body.confirmPassword) {
        errors.push({ text: 'Passwords do not match!' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Passwords must be at least 4 characters!' });
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: ''
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already exist!');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can now login!');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    })
                }
            })
    }
});


//Logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out!');

    res.redirect('/users/login');
})
module.exports = router;