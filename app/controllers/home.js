class HomeC {
  index(ctx) {
    ctx.throw(500)
    ctx.body = `<h1>知乎主页</h1>`
  }
  hello(ctx) {
    ctx.throw(404) // 手动抛出异常
    ctx.body = `hello koa ${ctx.params.name} ${ctx.params.age}`
  }
  post(ctx) {
    ctx.status = 202
    ctx.cookies.set('token', '$%##@!^&*(iyutr', []) // cookie 设置
    ctx.body = [{ name: '神奇的数据', type: 'Array' }]
  }
}

module.exports = new HomeC()
