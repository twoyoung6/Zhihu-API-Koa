// 授权函数
module.exports = async (ctx, next) => {
  if (ctx.url !== 'users') {
    await ctx.throw(401) // 返回错误
  }
}
