const fs = require('fs')

module.exports = (app) => {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file == 'index.js') {
      return
    }
    const route = require(`./${file}`)
    app.use(route.routes()).use(route.allowedMethods()) // 所有接口支持 options 请求中间件
  })
}
