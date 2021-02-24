const Router = require('koa-router')
const router = new Router()
const { hello, post, upload, login } = require('../controllers/home')
const jwt = require('koa-jwt')
const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', async (ctx) => {
  ctx.redirect('login.html');
})
//登录路由
router.post('/login', async (ctx, next) => {
  await login(ctx)
})
// 首页
router.get('/:name/:age', async (ctx, next) => {
  await hello(ctx)
})
router.post('/', async (ctx, next) => {
  await post(ctx)
})
// 图片上传路由
router.post('/upload', auth, async (ctx, next) => {
  await upload(ctx)
})
module.exports = router
