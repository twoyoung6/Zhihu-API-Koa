const jwt = require('koa-jwt')
const { secret } = require('../config')
const Router = require('koa-router')
const router = new Router({ prefix: '/users' }) // koa-router 路由前缀
const {
  userList,
  userInfo,
  addUser,
  editUser,
  removeUser,
  login,
  checkUserAuth,
  checkUserExist,
  getFollowList,
  follow,
  unFollow,
  getFansList,
} = require('../controllers/user')

// 路由中传递多中间件（认证 及 授权中间件）
// const auth = require('../auth') // 自己实现的 jwt
const auth = jwt({ secret })

// 用户列表
router.get('/', async (ctx, next) => {
  await userList(ctx)
})

// 用户基本信息
router.post('/info', async (ctx, next) => {
  await userInfo(ctx)
})
// 新增
router.post('/add', auth, async (ctx, next) => {
  await addUser(ctx)
})
// 编辑（checkUserAuth 授权中间件，限制用户只能操作自己的信息）
router.post('/edit', auth, checkUserAuth, async (ctx, next) => {
  await editUser(ctx)
})
// 删除
router.post('/remove', auth, checkUserAuth, async (ctx, next) => {
  await removeUser(ctx)
})
// 登录
router.post('/login', async (ctx, next) => {
  await login(ctx)
})

// 关注列表
router.post('/followList', async (ctx, next) => {
  await getFollowList(ctx)
})
// 粉丝列表
router.post('/fansList', async (ctx, next) => {
  await getFansList(ctx)
})
// 关注
router.post('/follow', auth, checkUserExist, async (ctx, next) => {
  await follow(ctx)
})
// 取消关注
router.post('/unFollow', auth, checkUserExist, async (ctx, next) => {
  await unFollow(ctx)
})

module.exports = router
