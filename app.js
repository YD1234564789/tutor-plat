if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require("express")
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const passport = require('./config/passport')
const routes = require('./routes')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', exphbs.engine({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// 對upload路由 啟用upload資料夾
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
// 要在session後啟用
app.use(passport.session())

app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app //測試環境用到

// 登入頁>model>passport>local auth>google auth>首頁>user個人>user編輯>seeder>申請老師>老師個人>老師個人編輯>學生看老師>預約功能>評分功能>後台頁面>後台主頁