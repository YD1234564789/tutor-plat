const multer = require('multer')
// const upload = multer({ dest: 'temp/' })
const upload = multer({ dest: '/tmp' })

module.exports = upload
// 設定預設資料夾為temp