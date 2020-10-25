const userModel = require('../models/user')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')
const { decorator } = require('../../utils/utils.js') // 请求 response 统一处理脚本
class UserC {
  // 授权
  async checkUserAuth(ctx, next) {
    let req = ctx.request.body
    // console.log(req, ctx.state)
    if (req.id !== ctx.state.user._id && req.id !== 'admin') {
      ctx.throw(401, '暂无权限进行此操作')
    }
    await next()
  }

  // 用户列表
  async userList(ctx) {
    ctx.body = decorator({
      data: await userModel.find(),
    })
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
    ctx.body = decorator({
      data: user,
    })
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
    ctx.body = decorator({
      message: '用户注册（新增）成功',
    })
  }
  // 修改用户
  async editUser(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      age: { type: 'number', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: true },
      introduce: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      occupation: { type: 'array', itemType: 'object', required: false },
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
    ctx.body = decorator({
      message: `编辑成功 ${user}`,
    })
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
    ctx.body = decorator({
      message: '删除成功',
    })
  }
  // 登录
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
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
    ctx.body = {
      token: token,
      message: '登录成功...',
    }
  }
  // 关注列表
  async getFollowList(ctx) {
    ctx.verifyParams({
      id: { type: 'string', require: true },
    })
    const data = await userModel
      .findById(ctx.request.body.id)
      .select('+followList')
      .populate('followList')
    // populate 返回对象 followList 所有数据而不只是 id
    if (!data) {
      ctx.throw(404)
    }
    ctx.body = decorator({
      data: data.followList,
    })
  }
  // 粉丝列表
  async getFansList(ctx) {
    ctx.verifyParams({
      id: { type: 'string', require: true },
    })
    try {
      const fans = await userModel.find({ followList: [ctx.request.body.id] })
      ctx.body = decorator({
        message: '粉丝列表查询成功',
        data: fans,
      })
    } catch (error) {
      ctx.body = decorator({ code: 400, message: '响应失败' })
    }
  }
  // 关注
  async follow(ctx) {
    ctx.verifyParams({
      id: { type: 'string', require: true },
    })
    let param = ctx.request.body.id
    // 获取我的粉丝列表
    const me = await userModel
      .findById(ctx.state.user._id)
      .select('+followList')
    // 关注的用户不在当前登录用户的粉丝列表中以及关注的不是自己的情况下才可以关注成功
    if (
      !me.followList
        .map((val) => {
          return `${val}`
        })
        .includes(param) &&
      ctx.state.user._id != ctx.request.body.id
    ) {
      me.followList.push(param)
      me.save()
      ctx.body = decorator({
        message: '关注成功...',
        code: 204,
      })
    } else {
      ctx.body = decorator({
        code: 203,
        message: '关注失败~~您已经关注过或者不能关注自己...',
      })
    }
  }
  // 取消关注
  async unFollow(ctx) {
    ctx.verifyParams({
      id: { type: 'string', require: true },
    })
    let param = ctx.request.body.id
    // 获取我的粉丝列表
    const me = await userModel
      .findById(ctx.state.user._id)
      .select('+followList')
    // 关注的用户不在当前登录用户的粉丝列表中以及关注的不是自己的情况下才可以关注成功
    if (
      me.followList
        .map((val) => {
          return `${val}`
        })
        .includes(param)
    ) {
      // 获取当前取消关注ID在列表中的位置索引
      let index = me.followList
        .map((val) => {
          return `${val}`
        })
        .findIndex((val) => {
          return val == param
        })
      me.followList.splice(index, 1)
      me.save()
      ctx.body = decorator({
        message: '取消关注成功...',
        code: 200,
      })
    } else {
      ctx.body = decorator({
        code: 204,
        message: '取消关注失败~~您还未关注过Ta...',
      })
    }
  }
}

module.exports = new UserC()
