const Koa = require('koa')
const app = new Koa()
const path = require('path')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const signRoute = require('./routes')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const config = require('./config')

// ‘MongoDB’ 数据库连接
mongoose.connect(
  config.dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  console.log('MongoDB 数据库连接成功...')
)
mongoose.now('error', () => {
  console.log(error)
})

// 静态服务中间件
app.use(koaStatic(path.join(__dirname, '/public')))

// http 错误统一处理中间件
app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  })
)

// post 参数解析中间件
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'),
      keepExtensions: true, // 保持文件jpg,png 拓展名
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    },
  })
)

// http 参数校验中间件
app.use(parameter(app))
signRoute(app)

app.listen(3000, () => {
  console.log(`app is running at http://localhost:3000`)
})
