const express = require('express')
const router = express.Router()
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/adminController')
const passport = require('../../config/passport')

router.get('/users/:id', authenticatedAdmin,adminController.getUser)
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/signIn', adminController.signInPage)
router.post('/signIn', passport.authenticate('local', { failureRedirect: '/admin/signIn', failureFlash: true }), adminController.signIn)
//都不相符時重導向到...
router.get('/', (req, res) => res.redirect('/admin/users'))

module.exports = router