const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const { JWT_PWD } = require('../config')
class UserC {
  // 授权
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
  // 新增（注册）用户
  async addUser(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true },
      addr: { type: 'string', required: false },
      age: { type: 'number', required: false },
    })
    // 注册用户冲突检测
    let { name } = ctx.request.body
    let isRepeat = await userModel.findOne({ name })
    if (isRepeat) {
      ctx.throw(409, '好巧~~~该名称已被注册了...')
    }
    const user = await new userModel(ctx.request.body).save()
    if (!user) {
      ctx.throw(400, '新增用户失败...')
      return
    }
    ctx.body = '用户注册（新增）成功'
  }
  // 修改用户
  async editUser(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      age: { type: 'number', required: false },
    })
    const user = await userModel.findByIdAndUpdate(
      ctx.request.body.id,
      ctx.request.body,
      { new: true }
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
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', require: true },
      password: { type: 'string', require: true },
    })
    const user = await userModel.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(404, '非法的用户名及密码...')
    }
    let { _id, name } = user
    const token = jwt.sign({ _id, name }, JWT_PWD, { expiresIn: '1d' })
    ctx.body = { token }
  }
}

module.exports = new UserC()
