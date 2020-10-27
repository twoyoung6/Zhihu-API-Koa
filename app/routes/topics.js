const jwt = require('koa-jwt')
const { secret } = require('../config')
const Router = require('koa-router')
const router = new Router({ prefix: '/topics' }) // koa-router 路由前缀
const {
  topicsList,
  topicsInfo,
  addTopics,
  editTopics,
  checkUserAuth,
} = require('../controllers/topics.js')

const auth = jwt({ secret })
// 用户列表
router.get('/', async (ctx, next) => {
  console.log(ctx)
  await topicsList(ctx)
})

// 话题详情
router.post('/detail', async (ctx, next) => {
  await topicsInfo(ctx)
})
// 新增
router.post('/add', auth, checkUserAuth, async (ctx, next) => {
  await addTopics(ctx)
})
// 修改 checkUserAuth 授权中间件，限制 admin超级管理员才能操作）
router.post('/edit', auth, checkUserAuth, async (ctx, next) => {
  await editTopics(ctx)
})
module.exports = router
