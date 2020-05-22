const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()
const port = 3000

//Passport config
require('./config/passport')(passport)

//Mongoose connect
require('./db/mongoose')

//EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//Bodyparser
app.use(express.urlencoded({ extended: false }))

//Express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash())

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next()
})

//Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})