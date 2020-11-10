const jwt = require('koa-jwt')
const { secret } = require('../config')
const Router = require('koa-router')
const router = new Router({ prefix: '/answer' }) // koa-router 路由前缀

// 引入控制器
const {
  answerList,
  answerInfo,
  addAnswer,
  editAnswer,
  checkAnswerExist,
  getUserCreateAnswers,
} = require('../controllers/answer.js')

const auth = jwt({ secret })
// Answer列表
router.post('/', async (ctx, next) => {
  await answerList(ctx)
})
// 回答详情
router.post('/detail', async (ctx, next) => {
  await answerInfo(ctx)
})
// 新增回答
router.post('/add', auth, async (ctx, next) => {
  await addAnswer(ctx)
})
// 修改回答
router.post('/edit', auth, checkAnswerExist, async (ctx, next) => {
  await editAnswer(ctx)
})

router.post('/createAnswersList', auth, async (ctx, next) => {
  await getUserCreateAnswers(ctx)
})

module.exports = router
