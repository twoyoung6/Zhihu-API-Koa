const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()
const userRouter = new Router({ prefix: '/users' }) // koa-router 路由前缀

// 路由中传递多中间件（授权中间件）
const auth = async (ctx, next) => {
  if (ctx.url !== 'users') {
    await ctx.throw(401)
  }
}
// 首页
router.get('/:name/:age', async (ctx, next) => {
  ctx.status = 404 // status 设置
  ctx.body = `hello koa ${ctx.params.name} ${ctx.params.age}`
})
router.post('/', async (ctx, next) => {
  ctx.status = 202
  ctx.body = { name: '神奇的数据', type: 'Array' }
})
// 用户
userRouter.get('/', auth, async (ctx, next) => {
  ctx.status = 401
  ctx.body = '用户'
})

app.use(bodyParser())
app.use(router.routes())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods()) // 所有接口支持 options 请求中间件

app.listen(3000)

console.log(`app is running at http://localhost:3000`)
