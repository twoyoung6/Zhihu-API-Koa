class UserC {
  userList(ctx) {
    ctx.status = 401
    ctx.body = '用户列表页'
  }
  userInfo(ctx) {
    ctx.status = 200
    ctx.body = '用户基本信息页'
  }
  addUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string' },
      age: { type: 'number' },
    })
    ctx.body = '新增用户成功'
  }
}

module.exports = new UserC()
