const Router = require('koa-router')
const router = new Router()
const { index, hello, post } = require('../controllers/home')

router.get('/', (ctx) => {
  index(ctx)
})
// 首页
router.get('/:name/:age', async (ctx, next) => {
  ctx.status = 404 // status 设置
  hello(ctx)
})
router.post('/', async (ctx, next) => {
  post(ctx)
})
module.exports = router
