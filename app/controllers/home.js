const path = require('path')
class HomeC {
  index(ctx) {
    // ctx.throw(500)
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
  // 上传模块控制器
  async upload(ctx) {
    console.log('---upload---')
    if (!ctx.request.files.file.size) {
      ctx.throw(401, '请选择图片')
      return
    }
    try {
      const file = ctx.request.files.file
      // console.log(file.path)
      const ext = path.basename(file.path)
      console.log(`${ctx.request.origin}/uploads/${ext}`)
      ctx.body = { url: `${ctx.request.origin}/uploads/${ext}` }
    } catch (error) {
      ctx.throw(400, '图片上传失败')
    }
  }
}

module.exports = new HomeC()
