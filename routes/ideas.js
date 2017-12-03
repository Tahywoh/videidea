const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../helpers/auth');

//load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea index page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({
            user: req.user.id
        })
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas
            });
        });
});

//Add idea form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//Edit Idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', 'Fire you!\nYou\'re not authorized to edit other\'s idea');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea
                });
            }


        });
});

//process form
router.post('/', ensureAuthenticated, (req, res) => {
    // console.log(req.body);



    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'Please add a title!'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some details!'
        });
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser).save().then(idea => {
            req.flash('success_msg', 'Video idea successfully added!');
            res.redirect('/ideas');
        });
    }
});

//Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea successfully updated!');
                    res.redirect('/ideas');
                })
        })
});

//Delete idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'Video idea removed!');
            res.redirect('/ideas');
        })
});


module.exports = router;