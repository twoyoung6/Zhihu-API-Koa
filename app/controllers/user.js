const userModel = require('../models/user')
class UserC {
  // 用户列表
  async userList(ctx) {
    ctx.body = await userModel.find()
  }
  // 用户基本信息
  async userInfo(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    })
    let user = await userModel.findById(ctx.request.body.id)
    if (!user) {
      ctx.throw(400, '未查询到该用户任何信息...')
      return
    }
    ctx.body = user
  }
  // 新增用户
  async addUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      age: { type: 'number', required: false },
    })
    const user = await new userModel(ctx.request.body).save()
    if (!user) {
      ctx.throw(400, '新增用户失败...')
      return
    }
    ctx.body = user
  }
  // 修改用户
  async editUser(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      name: { type: 'string', required: false },
      age: { type: 'number', required: false },
    })
    const user = await userModel.findByIdAndUpdate(
      ctx.request.body.id,
      ctx.request.body
    )
    if (!user) {
      ctx.throw(400, '编辑用户失败...')
      return
    }
    ctx.body = `编辑成功 ${user}`
  }
  // 删除用户
  async removeUser(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    })
    const user = await userModel.findByIdAndRemove(ctx.request.body.id)
    if (!user) {
      ctx.throw(400, '删除用户失败, 没有此用户...')
      return
    }
    ctx.body = '删除成功'
  }
}

module.exports = new UserC()
