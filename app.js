const express = require("express")
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', exphbs.engine({ extname: '.hbs', defaultLayout: "main" }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app //測試環境用到

// 登入頁>model> seeder>passport>google>首頁>user個人>user編輯>申請老師>老師個人>老師個人編輯>學生看老師>預約功能>評分功能>後台頁面>後台主頁