const mongoose = require('mongoose')
const topicsModel = require('../models/topics.js')
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
    ctx.body = decorator({
      data: await topicsModel.find(),
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
}

module.exports = new TopicsC()
