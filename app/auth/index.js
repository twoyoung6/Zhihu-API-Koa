// 授权函数
module.exports = async (ctx, next) => {
  if (ctx.url !== '/users/info') {
    await ctx.throw(401) // 返回错误
  }
}
