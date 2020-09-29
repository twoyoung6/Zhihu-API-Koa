const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

router.get('/', async (ctx, next) => {
  console.log('哈哈')
})

app.use(router.routes())

app.listen(3000)

console.log(`app is running at http://localhost:3000`)
