const express = require('express')
const router = express.Router()
const { authenticatedAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/adminController')

router.get('/users', authenticatedAdmin, adminController.getUsers)
//都不相符時重導向到...
router.get('', (req, res) => res.redirect('/admin/users'))

module.exports = router