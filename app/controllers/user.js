const mongoose = require('mongoose')
const userModel = require('../models/user')
const topicsModel = require('../models/topics')
const answerModel = require('../models/answer')
const jsonwebtoken = require('jsonwebtoken')
const Crypt = require('../utils/bcryptjs')
const { secret } = require('../config')
const { decorator } = require('../utils/utils.js') // 请求 response 统一处理脚本
class UserC {
  // 授权
  async checkUserAuth(ctx, next) {
    let req = ctx.request.body
    if (req.id !== ctx.state.user._id && ctx.state.user.name !== 'admin') {
      ctx.throw(401, '暂无权限进行此操作')
    }
    await next()
  }
  // 检测用户的有效性
  async checkUserExist(ctx, next) {
    ctx.verifyParams({
      id: { type: 'string', require: true },
    })
    let id = mongoose.Types.ObjectId(ctx.request.body.id) // id 转 ObjectId
    let user = await userModel.findById(id)
    if (!user) {
      ctx.throw(404, '该用户不存在...')
      return
    }
    await next()
  }
  // 用户列表
  async userList(ctx) {
    ctx.verifyParams({
      size: { type: 'number', required: true },
      page: { type: 'number', required: true },
    })
    const page = Math.max(ctx.request.body.page * 1, 1) - 1 // 目前是第几页
    const size = Math.max(ctx.request.body.size * 1, 10) // 每页的条数
    ctx.body = decorator({
      data: await userModel
        .find({ name: new RegExp(ctx.request.body.q) }) // 模糊搜索的实现
        .limit(size)
        .skip(page * size),
    })
  }
  // 用户基本信息
  async userInfo(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    })
    // followList locations business occupation.company occupation.job（查询条件 查询结果的作用域 field）
    let field = ctx.request.body.field.split(',').join(' ')
    let user = await userModel
      .findById(ctx.request.body.id)
      .select(field)
      .populate(field)
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
    // 对明文密码加密存入数据库
    let params = ctx.request.body
    params.password = Crypt.encrypt(params.password)
    const user = await new userModel(params).save()
    if (!user) {
      ctx.throw(400, '新增用户失败...')
      return
    }
    ctx.body = decorator({
      message: '用户注册（新增）成功',
    })
  }

  // 登录
  async login(ctx) {
    // 1.0 校验入参（用户名称及密码），必输项；
    // 2.0 未查询到有效的用户信息则提示前端非法的用户名及密码；如查询到用户信息则 3.0；
    // 3.0 调用 bcrypt 的 compareSync 解密方法进行明文密码与加密密码比对，如错误，则告诉前端密码错误；如正确则 4.0；
    // 4.0 调用 jwt 的 sign 方法签发一个token给前端；签发的内容是用 id 及 name；
    //    4.1后面前端再发来其他请求并携带这个 token 时，用 jwt({ secret }) 验证 token 是否有效（认证当前是否处于登录状态）；详见 routes/user.js
    ctx.verifyParams({
      name: { type: 'string', require: true },
      password: { type: 'string', require: true },
    })
    const data = ctx.request.body
    // 通过账户名称查找数据
    const user = await userModel
      .findOne({ name: data.name })
      .select('+password')
    if (!user) {
      ctx.body = {
        code: 404,
        message: '该用户不存在...',
      }
      return
    }
    // 校验用户输入的密码和数据库中的加密密码
    let checkPassword = null
    if (data.name == 'admin') {
      checkPassword = data.password === user.password
    } else {
      checkPassword = Crypt.decrypt(data.password, user.password)
    }
    if (!checkPassword) {
      ctx.body = {
        code: 404,
        message: '非法的密码...',
      }
      return
    }
    let { _id, name } = user

    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
    ctx.body = {
      code: 200,
      token: token,
      message: '登录成功...',
    }
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
      business: { type: 'array', required: false },
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
  // 登录用户的关注
  async getFollowList(ctx) {
    const data = await userModel
      .findById(ctx.state.user._id)
      .select('+followList')
      .populate('followList')
    // populate 返回对象 followList 所有数据而不只是 id
    if (!data) {
      ctx.body = decorator({
        massage: '用户不存在',
        code: 404,
      })
    }
    ctx.body = decorator({
      data: data.followList,
    })
  }
  // 登录用户的粉丝列表
  async getFansList(ctx) {
    try {
      const fans = await userModel.find({ followList: [ctx.state.user._id] })
      ctx.body = decorator({
        message: '粉丝列表查询成功',
        data: fans,
      })
    } catch (error) {
      ctx.body = decorator({ code: 400, message: '响应失败' })
    }
  }
  // 关注别人
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
  // 取消关注别人
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

  // 检测话题的有效性
  async checkTopicExist(ctx, next) {
    ctx.verifyParams({
      id: { type: 'string', require: true },
    })
    let id = mongoose.Types.ObjectId(ctx.request.body.id) // id 转 ObjectId
    let user = await topicsModel.findById(id)
    if (!user) {
      ctx.throw(404, '该话题还未创建...')
      return
    }
    await next()
  }
  // 关注话题
  async followTopic(ctx) {
    ctx.verifyParams({
      id: { type: 'string', require: true },
    })
    let param = ctx.request.body.id
    // 获取我关注的话题列表
    const me = await userModel
      .findById(ctx.state.user._id)
      .select('+followTopics')
    // 关注的话题不在当前登录用户的话题列表中才可以关注成功
    if (
      !me.followTopics
        .map((val) => {
          return `${val}`
        })
        .includes(param)
    ) {
      me.followTopics.push(param)
      me.save()
      ctx.body = decorator({
        message: '关注成功...',
        code: 204,
      })
    } else {
      ctx.body = decorator({
        code: 203,
        message: '关注失败~~您已经关注过该话题...',
      })
    }
  }
  // 取消关注话题
  async unFollowTopic(ctx) {
    ctx.verifyParams({
      id: { type: 'string', require: true },
    })
    let param = ctx.request.body.id
    // 获取我的粉丝列表
    const me = await userModel
      .findById(ctx.state.user._id)
      .select('+followTopics')
    // 关注的话题不在当前登录话题的粉丝列表中以及关注的不是自己的情况下才可以关注成功
    if (
      me.followTopics
        .map((val) => {
          return `${val}`
        })
        .includes(param)
    ) {
      // 获取当前取消关注ID在列表中的位置索引
      let index = me.followTopics
        .map((val) => {
          return `${val}`
        })
        .findIndex((val) => {
          return val == param
        })
      me.followTopics.splice(index, 1)
      me.save()
      ctx.body = decorator({
        message: '取消关注成功...',
        code: 200,
      })
    } else {
      ctx.body = decorator({
        code: 204,
        message: '取消关注失败~~您还未关注该话题...',
      })
    }
  }
  // 登录用户关注的话题列表
  async getFollowTopicsList(ctx) {
    const data = await userModel
      .findById(ctx.state.user._id)
      .select('+followTopics')
      .populate('followTopics')
    // populate 返回对象 followTopics 所有数据而不只是 id
    if (!data) {
      ctx.body = decorator({
        massage: '话题不存在',
        code: 404,
      })
    }
    ctx.body = decorator({
      data: data.followTopics,
    })
  }

  // 登录用户喜欢赞同的答案列表
  async getLikeAnswerList(ctx) {
    const data = await userModel
      .findById(ctx.state.user._id)
      .populate('likeAnswers')
      .select('+likeAnswers')
    if (!data) {
      ctx.body = decorator({
        massage: '用户不存在',
        code: 404,
      })
    }
    console.log(data)
    ctx.body = decorator({
      data: data.likeAnswers,
    })
  }
  // 赞同 / 取消赞同答案
  async likeAnswer(ctx, next) {
    ctx.verifyParams({
      answerId: { type: 'string', require: true },
    })
    let param = ctx.request.body.answerId
    // 获取赞同喜欢过的答案列表
    const me = await userModel
      .findById(ctx.state.user._id)
      .select('+likeAnswers')
    if (
      !me.likeAnswers
        .map((val) => {
          return val && `${val}`
        })
        .includes(param)
    ) {
      me.likeAnswers.push(param)
      me.save()
      await answerModel.findByIdAndUpdate(param, { $inc: { likeCount: 1 } }) // 答案的喜欢数量增 1
      ctx.body = decorator({
        message: '赞同答案成功...',
        code: 204,
      })
      await next()
    } else {
      let index = me.likeAnswers
        .map((val) => {
          return `${val}`
        })
        .findIndex((val) => {
          return val === param
        })
      if (index > -1) {
        me.likeAnswers.splice(index, 1) // 取消赞同答案
        me.save()
        await answerModel.findByIdAndUpdate(param, { $inc: { likeCount: -1 } }) // 答案的喜欢数量减 1
        ctx.body = decorator({
          code: 203,
          message: '您已经取消赞同...',
        })
        await next()
      }
    }
  }
  // 踩答案
  async hateAnswer(ctx, next) {
    ctx.verifyParams({
      answerId: { type: 'string', require: true },
    })
    let param = ctx.request.body.answerId
    // 获取我踩过的答案列表
    const me = await userModel
      .findById(ctx.state.user._id)
      .select('+hateAnswers')
    if (
      me.hateAnswers
        .map((val) => {
          return `${val}`
        })
        .includes(param)
    ) {
      let index = me.hateAnswers
        .map((val) => {
          return val && `${val}`
        })
        .findIndex((val) => {
          return val == param
        })
      me.hateAnswers.splice(index, 1) // 取消答案
      me.save()
      ctx.body = decorator({
        message: '取消踩成功...',
        code: 200,
      })
      await next()
    } else {
      me.hateAnswers.push(param)
      me.save()
      ctx.body = decorator({
        code: 204,
        message: '踩一踩答案成功...',
      })
      await next()
    }
  }
}

module.exports = new UserC()
