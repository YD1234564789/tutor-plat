const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')


router.get('/users', adminController.getUsers)
//都不相符時重導向到...
router.use('/', (req, res) => res.redirect('/admin/users'))

module.exports =router