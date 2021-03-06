const jwt = require('koa-jwt')
const { secret } = require('../config')
const Router = require('koa-router')
const router = new Router({ prefix: '/api/users' }) // koa-router 路由前缀
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
  followTopic,
  unFollowTopic,
  checkTopicExist,
  getFollowTopicsList,
  getLikeAnswerList,
  likeAnswer,
  hateAnswer,
} = require('../controllers/user')
const { checkAnswerExist } = require('../controllers/answer')

// 路由中传递多中间件（认证 及 授权中间件）
// const auth = require('../auth') // 自己实现的 jwt
const auth = jwt({ secret })

// 用户列表
router.post('/', async (ctx, next) => {
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
router.post('/followList', auth, async (ctx, next) => {
  await getFollowList(ctx)
})
// 粉丝列表
router.post('/fansList', auth, async (ctx, next) => {
  await getFansList(ctx)
})
// 关注别人
router.post('/follow', auth, checkUserExist, async (ctx, next) => {
  await follow(ctx)
})
// 取消关注别人
router.post('/unFollow', auth, checkUserExist, async (ctx, next) => {
  await unFollow(ctx)
})
// 关注话题
router.post('/followTopic', auth, checkTopicExist, async (ctx, next) => {
  await followTopic(ctx)
})
// 取消关注话题
router.post('/unFollowTopic', auth, checkTopicExist, async (ctx, next) => {
  await unFollowTopic(ctx)
})
// 获取用户当前关注的话题列表
router.post('/getFollowTopicsList', auth, async (ctx, next) => {
  await getFollowTopicsList(ctx)
})
// 登录用户喜欢赞同的答案列表
router.post('/getLikeAnswerList', auth, async (ctx, next) => {
  await getLikeAnswerList(ctx)
})
// 喜欢答案/取消
router.post('/likeAnswer', auth, checkAnswerExist, async (ctx, next) => {
  await likeAnswer(ctx, next)
})
// 踩答案/取消
router.post('/hateAnswer', auth, checkAnswerExist, async (ctx, next) => {
  await hateAnswer(ctx, next)
})
module.exports = router
