const express = require('express')
const router = express.Router()
// const admin = require('./modules/admin')
const auth = require('../pages/modules/auth')
const passport = require('../../config/passport')
const { apiErrorHandler } = require('../../middleware/error-handler')
// const { authenticated, authenticatedTeacher } = require('../../middleware/auth')
const upload = require('../../middleware/multer')
const userController = require('../../controllers/apis/userController')
const teacherController = require('../../controllers/apis/teacherController')
const homeController = require('../../controllers/apis/homeController')

// router.use('/admin', admin)
router.use('/auth', auth)

router.post('/signup', userController.signUp)
router.post('/signIn', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/:id/edit', userController.getEdit)
router.get('/users/:id', userController.getUser)
// 設定上傳單張圖片avatar對應input name
router.put('/users/:id', upload.single('avatar'), userController.putUser)

router.get('/teachers/apply', teacherController.getNewTeacher)
router.post('/teachers/apply', teacherController.postTeacher)
router.get('/teachers/search', teacherController.teacherSearch)
router.put('/teachers/:id/score', teacherController.putScore)
router.post('/teachers/:id/reserve', teacherController.postReserve)
router.get('/teachers/:id/myProfile', teacherController.myProfile) //老師看自己檔案
router.get('/teachers/:id/edit', teacherController.editPage)
router.get('/teachers/:id', teacherController.getTeacher) // 學生看老師
router.put('/teachers/:id', upload.single('avatar'), teacherController.putTeacher)
router.get('/teachers', teacherController.getTeachers)
router.get('/home', homeController.getHome)

//都不符合路由時重新導向...
router.use('/', (req, res) => res.redirect('/home'))
router.use('/', apiErrorHandler)

module.exports = router