const express = require('express')
const router = express.Router()
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/adminController')

router.get('/users/:id', adminController.getUser)
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.get('/signin', adminController.signInPage)
router.post('/signin', adminController.signIn)
//都不相符時重導向到...
router.get('/', (req, res) => res.redirect('/admin/users'))

module.exports = router