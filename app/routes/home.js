const Router = require('koa-router')
const router = new Router()
const { index, hello, post, upload } = require('../controllers/home')

router.get('/', async (ctx) => {
  await index(ctx)
})
// 首页
router.get('/:name/:age', async (ctx, next) => {
  await hello(ctx)
})
router.post('/', async (ctx, next) => {
  await post(ctx)
})
// 图片上传路由
router.post('/upload', async (ctx, next) => {
  await upload(ctx)
})
module.exports = router
