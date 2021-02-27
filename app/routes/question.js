const jwt = require('koa-jwt')
const { secret } = require('../config')
const Router = require('koa-router')
const router = new Router({ prefix: '/api/question' }) // koa-router 路由前缀

// 引入控制器
const {
  questionList,
  questionInfo,
  addQuestion,
  editQuestion,
  checkQuestionExist,
  getUserCreateQuestions,
} = require('../controllers/question.js')

const auth = jwt({ secret })
// Question列表
router.post('/', async (ctx, next) => {
  await questionList(ctx)
})
// 问题详情
router.post('/detail', checkQuestionExist, async (ctx, next) => {
  await questionInfo(ctx)
})
// 新增问题
router.post('/add', auth, async (ctx, next) => {
  await addQuestion(ctx)
})
// 修改问题
router.post('/edit', auth, checkQuestionExist, async (ctx, next) => {
  await editQuestion(ctx)
})

router.post('/createQuestionsList', auth, async (ctx, next) => {
  await getUserCreateQuestions(ctx)
})

module.exports = router
