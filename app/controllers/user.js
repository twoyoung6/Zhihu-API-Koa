class UserC {
  userList(ctx) {
    ctx.status = 401
    ctx.body = '用户列表页'
  }
  userInfo(ctx) {
    ctx.status = 200
    ctx.body = '用户基本信息页'
  }
}

module.exports = new UserC()
