class HomeC {
  index(ctx) {
    ctx.body = `<h1>知乎主页</h1>`
  }
  hello(ctx) {
    ctx.status = 404 // status 设置
    ctx.body = `hello koa ${ctx.params.name} ${ctx.params.age}`
  }
  post(ctx) {
    ctx.status = 202
    ctx.body = { name: '神奇的数据', type: 'Array' }
  }
}

module.exports = new HomeC()
