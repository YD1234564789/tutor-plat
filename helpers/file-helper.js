const fs = require('@cyclic.sh/s3fs/promises')
const imgur =  require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const imgurFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    return imgur.uploadFile(file.path)
      .then(img => {
        resolve(img?.link || null)
      })
      .catch(err => reject(err))
  })
}

const localFileHandler = file => {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null)
    const fileName = `upload/${file.originalname}`
    return fs.promises.readFile(file.path)
      .then(data => fs.promises.writeFile(fileName, data))
      .then(() => resolve(`/${fileName}`))
      .catch(err => reject(err))
  })
}
// 原版
// const localFileHandler = file => {
//   return new Promise((resolve, reject) => {
//     if (!file) return resolve(null)
//     const fileName = `upload/${file.originalname}`
//     return fs.promises.readFile(file.path)
//       .then(data => fs.promises.writeFile(fileName, data))
//       .then(() => resolve(`/${fileName}`))
//       .catch(err => reject(err))
//   })
// }
// 照片不存在就跳出，否則從temp複製到upload下並重命名


module.exports = {
  localFileHandler,
  imgurFileHandler
}