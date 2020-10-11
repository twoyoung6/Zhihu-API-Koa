const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const signRoute = require('./routes')
const error = require('koa-json-error')
const parameter = require('koa-parameter')

// http 错误统一处理中间件
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  })
)

// post 参数解析中间件
app.use(bodyParser())

// http 参数校验中间件
app.use(parameter(app))
signRoute(app)

app.listen(3000, () => {
  console.log(`app is running at http://localhost:3000`)
})
