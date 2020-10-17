const Router = require('koa-router')
const router = new Router({ prefix: '/users' }) // koa-router 路由前缀
const {
  userList,
  userInfo,
  addUser,
  editUser,
  removeUser,
  login,
} = require('../controllers/user')

// 路由中传递多中间件（授权中间件）
// const auth = require('../auth')

// 用户列表
router.get('/', async (ctx, next) => {
  await userList(ctx)
})

// 用户基本信息
router.post('/info', async (ctx, next) => {
  await userInfo(ctx)
})
// 新增
router.post('/add', async (ctx, next) => {
  await addUser(ctx)
})
// 编辑
router.post('/edit', async (ctx, next) => {
  await editUser(ctx)
})
// 删除
router.post('/remove', async (ctx, next) => {
  await removeUser(ctx)
})
// 登录
router.post('/login', async (ctx, next) => {
  await login(ctx)
})

module.exports = router
