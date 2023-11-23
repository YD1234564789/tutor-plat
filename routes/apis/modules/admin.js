const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/adminController')
const passport = require('../../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../../middleware/api-auth')


router.get('/users/:id', authenticated, authenticatedAdmin, adminController.getUser)
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.post('/signIn', passport.authenticate('local', { session: false }), adminController.signIn)
//都不相符時重導向到...
router.get('/', (req, res) => res.redirect('/admin/users'))

module.exports = router