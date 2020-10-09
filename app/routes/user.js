const Router = require('koa-router')
const router = new Router({ prefix: '/users' }) // koa-router 路由前缀
const { userList } = require('../controllers/user')
// 路由中传递多中间件（授权中间件）
const auth = async (ctx, next) => {
  if (ctx.url !== 'users') {
    await ctx.throw(401)
  }
}

// 用户
router.get('/', async (ctx, next) => {
  userList(ctx)
})

module.exports = router
