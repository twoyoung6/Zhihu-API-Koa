const mongoose = require('mongoose')
const question = require('../models/question.js')
const questionModel = require('../models/question.js')
const userModel = require('../models/user.js')
const { decorator } = require('../utils/utils.js') // 请求 response 统一处理脚本
class QuestionC {
  // 🍎检测问题的有效性
  async checkQuestionExist(ctx, next) {
    const question = await questionModel.findById(ctx.request.body.id)
    if (!question) {
      ctx.body = decorator({
        code: 400,
        message: '该话题不存在',
      })
    }
    ctx.state.question = question // 会话缓存 question
    await next()
  }
  // 🚕问题列表
  async questionList(ctx) {
    ctx.verifyParams({
      size: { type: 'number', required: true },
      page: { type: 'number', required: true },
    })
    const page = Math.max(ctx.request.body.page * 1, 1) - 1 // 目前是第几页
    const size = Math.max(ctx.request.body.size * 1, 10) // 每页的条数
    ctx.body = decorator({
      data: await questionModel
        .find({
          $or: [
            { title: new RegExp(ctx.request.body.q) },
            { name: new RegExp(ctx.request.body.q) },
            { description: new RegExp(ctx.request.body.q) },
          ],
        }) // 正则匹配，模糊搜索
        .limit(size)
        .skip(page * size),
    })
  }
  // 问题详情
  async questionInfo(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
    })
    const question = await questionModel.findById(ctx.request.body.id)
    ctx.body = decorator({
      data: question,
    })
  }
  // 新增问题
  async addQuestion(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: true },
    })
    // 新增问题冲突检测
    let { title } = ctx.request.body
    let isRepeat = await questionModel.findOne({ title })
    if (isRepeat) {
      ctx.throw(409, '抱歉，该问题已被抢先创建了...')
    }
    const question = await new questionModel({
      ...ctx.request.body,
      createUser: ctx.state.user._id,
    }).save()
    if (!question) {
      ctx.throw(400, '新增问题失败...')
      return
    }
    ctx.body = decorator({
      message: '问题新增成功',
    })
  }
  // 修改问题🍉
  async editQuestion(ctx) {
    ctx.verifyParams({
      id: { type: 'string', required: true },
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
    })
    await ctx.state.question.update(ctx.request.body, {
      new: true,
    })
    if (!ctx.state.question) {
      ctx.throw(400, '编辑问题失败...')
      return
    }
    ctx.body = decorator({
      message: `编辑成功 ${ctx.state.question}`,
    })
  }

  // 获取登录用户发布的问题列表
  async getUserCreateQuestions(ctx) {
    try {
      const questionList = await questionModel.find({
        createUser: ctx.state.user._id,
      })
      ctx.body = decorator({
        message: '查询成功',
        data: questionList,
      })
    } catch (error) {
      ctx.body = decorator({ code: 400, message: '响应失败' })
    }
  }
}

module.exports = new QuestionC()
