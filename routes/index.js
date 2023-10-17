const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/userController')
const teacherController = require('../controllers/teacherController')
const homeController = require('../controllers/homeController')
const adminController = require('../controllers/adminController')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signIn', userController.signInPage)
router.post('/signIn', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/home', homeController.getHome)

//都不符合路由時重新導向...
router.use('/', (req, res) => res.redirect('/home'))
router.use('/', generalErrorHandler)

module.exports = router