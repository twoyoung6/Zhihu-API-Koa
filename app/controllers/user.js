class UserC {
  userList(ctx) {
    ctx.status = 401
    ctx.body = '用户列表页'
  }
}

module.exports = new UserC()
