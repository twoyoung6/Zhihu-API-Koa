const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const signRoute = require('./routes')
const error = require('koa-json-error')

app.use(
  error({
    postFormat: (e, { stack, ...rest }) =>
      process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
  })
)

app.use(bodyParser())

signRoute(app)

app.listen(3000, () => {
  console.log(`app is running at http://localhost:3000`)
})
