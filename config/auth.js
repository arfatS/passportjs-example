module.exports = {
    ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next()
        }
        req.flash('error_msg', 'Please login to continue')
        res.redirect('/users/login')
    }
}