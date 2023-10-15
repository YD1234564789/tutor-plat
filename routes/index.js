const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/userController')
const teacherController = require('../controllers/teacherController')
const homeController = require('../controllers/homeController')

router.use('/admin', admin)

router.get('/home', homeController.getHome)

//都不符合路由時重新導向...
router.use('/', (req, res) => res.redirect('/home'))

module.exports = router