const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/userController')
const teacherController = require('../controllers/teacherController')
const homeController = require('../controllers/homeController')
const adminController = require('../controllers/adminController')

router.use('/admin', admin)
router.get('/signup', userController.signupPage)
router.post('/signup', userController.signup)
router.get('/signin', userController.signinPage)
router.get('/home', homeController.getHome)

//都不符合路由時重新導向...
router.use('/', (req, res) => res.redirect('/home'))

module.exports = router