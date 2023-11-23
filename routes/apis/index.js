const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const auth = require('../pages/modules/auth')
const passport = require('../../config/passport')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/api-auth')
const upload = require('../../middleware/multer')
const userController = require('../../controllers/apis/userController')
const teacherController = require('../../controllers/apis/teacherController')
const homeController = require('../../controllers/apis/homeController')

router.use('/admin', admin)
router.use('/auth', auth)

router.post('/signup', userController.signUp)
router.post('/signIn', passport.authenticate('local', { session: false }), userController.signIn)

router.get('/users/:id/edit', authenticated, userController.getEdit)//學生編輯頁
router.get('/users/:id', authenticated, userController.getUser)
// 設定上傳單張圖片avatar對應input name
router.put('/users/:id', authenticated, upload.single('avatar'), userController.putUser)

router.get('/teachers/apply', authenticated, teacherController.getNewTeacher)
router.post('/teachers/apply', authenticated, teacherController.postTeacher)
router.get('/teachers/search', authenticated, teacherController.teacherSearch)
router.put('/teachers/:id/score', authenticated, teacherController.putScore)
router.post('/teachers/:id/reserve', authenticated, teacherController.postReserve)
router.get('/teachers/:id/myProfile', authenticated, teacherController.myProfile) //老師看自己檔案
router.get('/teachers/:id/edit', authenticated, teacherController.editPage) //老師編輯頁
router.get('/teachers/:id', authenticated, teacherController.getTeacher) // 學生看老師
router.put('/teachers/:id', authenticated, upload.single('avatar'), teacherController.putTeacher)
router.get('/teachers', authenticated, teacherController.getTeachers)
router.get('/home', authenticated, homeController.getHome)

//都不符合路由時重新導向...
router.use('/', (req, res) => res.redirect('/home'))
router.use('/', apiErrorHandler)

module.exports = router