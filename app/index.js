const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const signRoute = require('./routes')

app.use(bodyParser())
signRoute(app)
app.listen(3000, () => {
  console.log(`app is running at http://localhost:3000`)
})
