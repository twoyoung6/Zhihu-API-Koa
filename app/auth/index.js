// 认证中间件
const jwt = require('jsonwebtoken')
const { JWT_PWD } = require('../config')

module.exports = async (ctx, next) => {
  const { authorization = '' } = ctx.request.header
  let token = authorization.replace('Bearer ', '')
  try {
    const userInfo = jwt.verify(token, JWT_PWD)
    ctx.state.userInfo = userInfo // 请求头存储登录用户基本认证信息
    console.log(`===${ctx.request.url} auth success===`)
  } catch (error) {
    ctx.throw(401, error.message) // 认证失败统一错误返回
  }
  await next()
}
