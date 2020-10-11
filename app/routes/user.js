const Router = require('koa-router')
const router = new Router({ prefix: '/users' }) // koa-router 路由前缀
const { userList, userInfo } = require('../controllers/user')

// 路由中传递多中间件（授权中间件）
const auth = require('../auth')

// 用户列表
router.get('/', async (ctx, next) => {
  userList(ctx)
})

// 用户基本信息
router.post('/info', auth, async (ctx, next) => {
  userInfo(ctx)
})

module.exports = router
