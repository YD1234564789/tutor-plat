const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const auth = require('./modules/auth')
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const upload = require('../middleware/multer')
const userController = require('../controllers/userController')
const teacherController = require('../controllers/teacherController')
const homeController = require('../controllers/homeController')

router.use('/admin', admin)
router.use('/auth', auth)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signIn', userController.signInPage)
router.post('/signIn', passport.authenticate('local', { failureRedirect: '/signIn', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/:id/edit', authenticated, userController.getEdit)
router.get('/users/:id', authenticated,userController.getUser)
// 設定上傳單張圖片avatar對應input name
router.put('/users/:id', upload.single('avatar'),userController.putUser)

router.get('/teachers/apply', teacherController.getNewTeacher)
router.post('/teachers/apply', teacherController.postTeacher)
router.post('/teachers/:id/reserve', teacherController.postReserve)
router.get('/teachers/:id/myProfile', teacherController.myProfile) //老師看自己檔案
router.get('/teachers/:id/edit', teacherController.editPage)
router.get('/teachers/:id', teacherController.getTeacher) // 學生看老師
router.put('/teachers/:id', upload.single('avatar'), teacherController.putTeacher)
router.get('/home', authenticated, homeController.getHome)

//都不符合路由時重新導向...
router.use('/', (req, res) => res.redirect('/home'))
router.use('/', generalErrorHandler)

module.exports = router