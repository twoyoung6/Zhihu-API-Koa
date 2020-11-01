const mongoose = require('mongoose')
const topicsModel = require('../models/topics.js')
const userModel = require('../models/user.js')
const { decorator } = require('../utils/utils.js') // 请求 response 统一处理脚本
class TopicsC {
  // 授权
  async checkUserAuth(ctx, next) {
    let id = ctx.state.user.name
    // console.log(ctx.state)
    if (id !== 'admin') {
      ctx.throw(401, '暂无权限进行此操作')
    }
    await next()
  }
  // 话题列表
  async topicsList(ctx) {
    ctx.verifyParams({
      size: { type: 'number', required: true },
      page: { type: 'number', required: true },
    })
    const page = Math.max(ctx.request.body.page * 1, 1) - 1 // 目前是第几页
    const size = Math.max(ctx.request.body.size * 1, 10) // 每页的条数
    ctx.body = decorator({
      data: await topicsModel
        .find({ name: new RegExp(ctx.request.body.q) }) // 正则匹配，模糊搜索
        .limit(size)
        .skip(page * size),
    })
  }
  // 话题基本信息
  async topicsInfo(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    })
    let topics = await topicsModel.findById(ctx.request.body.id)
    if (!topics) {
      ctx.throw(400, '未查询到话题信息...')
      return
    }
    ctx.body = decorator({
      data: topics,
    })
  }

  // 新增话题
  async addTopics(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      description: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
    })
    // 新增话题冲突检测
    let { name } = ctx.request.body
    let isRepeat = await topicsModel.findOne({ name })
    if (isRepeat) {
      ctx.throw(409, '抱歉，该话题已被抢先创建了...')
    }
    const topics = await new topicsModel(ctx.request.body).save()
    if (!topics) {
      ctx.throw(400, '新增话题失败...')
      return
    }
    ctx.body = decorator({
      message: '话题新增成功',
    })
  }
  // 修改话题🍉
  async editTopics(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      name: { type: 'string', required: false },
      description: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
    })
    const topics = await topicsModel.findByIdAndUpdate(
      ctx.request.body.id,
      ctx.request.body,
      { new: true }
    )
    if (!topics) {
      ctx.throw(400, '编辑话题失败...')
      return
    }
    ctx.body = decorator({
      message: `编辑成功 ${topics}`,
    })
  }

  // 获取关注该话题的用户列表
  async getTopicFollows(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    })
    try {
      const userList = await userModel.find({
        followTopics: [ctx.request.body.id],
      })
      ctx.body = decorator({
        message: '该话题关注者查询成功',
        data: userList,
      })
    } catch (error) {
      ctx.body = decorator({ code: 400, message: '响应失败' })
    }
  }
}

module.exports = new TopicsC()
