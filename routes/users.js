const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/user')


router.get('/login', (req,res) => {
    res.render('login')
})

router.get('/signup', (req,res) => {
    res.render('signup')
})

//Register user
router.post('/signup', (req,res) => {
    const { name, email, password } = req.body
    let errors = []

    //Required fields
    if (!name || !email || !password) {
        errors.push({ message: 'Please fill in all the fields'})
    }

    if (errors.length > 0) {
        res.render('signup', { errors })

    }else{
        //Find user with email
        User.findOne({ email })
        .then((user) => {

            //If emails exists
            if (user) {
                errors.push({ message: 'Email already exists'})
                res.render('signup', { errors })

            }else{
                //Create new user
                const user = new User({
                    name,
                    email,
                    password
                })
                //Hash password
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(user.password, salt, (error, hash) => {
                        if (error) {
                            throw error
                        }
                        user.password = hash

                        //Save and Redirect
                        user.save()
                        .then((user) => {
                            req.flash('success_msg', 'Registered successfully')
                            res.redirect('/users/login')
                        })
                        .catch((error) => {
                            res.send({ error })
                        })
                    })
                })
            }
        })
    }

})

//Login user
router.post('/login', (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//Logout user
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Logged out successfully')
    res.redirect('/users/login')
})

module.exports = router