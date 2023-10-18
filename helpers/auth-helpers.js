const getUser = req => {
  return req.user || null
}
// 驗證
const ensureAuthenticated = req => {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated 
}