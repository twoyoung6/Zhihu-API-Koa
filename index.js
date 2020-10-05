const Koa = require('koa')
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

router.get('/', async (ctx, next) => {
  ctx.body = 'hello koa'
})

userRouter.get('/', auth, async (ctx, next) => {
  ctx.body = '用户'
})

app.use(router.routes())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods()) // 所有接口支持 options 请求中间件

app.listen(3000)

console.log(`app is running at http://localhost:3000`)
