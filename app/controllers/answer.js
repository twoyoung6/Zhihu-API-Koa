const answerModel = require('../models/answer.js')
const { decorator } = require('../utils/utils.js') // 请求 response 统一处理脚本

class AnswerC {
  // 🍎检测答案的有效性
  async checkAnswerExist(ctx, next) {
    ctx.verifyParams({
      answerId: { type: 'string', required: true },
      questionId: { type: 'string', required: true },
    })
    const answer = await answerModel.findById(ctx.request.body.answerId)
    console.log(answer, ctx.request.body.questionId)
    if (!answer) {
      ctx.body = decorator({
        code: 400,
        message: '该答案不存在',
      })
      return
    }
    if (answer.questionId !== ctx.request.body.questionId) {
      ctx.body = decorator({
        code: 400,
        message: '该问题下没有此答案',
      })
      return
    }
    ctx.state.answer = answer // 会话缓存 answer
    await next()
  }
  // 🚕某问题下的答案列表
  async answerList(ctx) {
    ctx.verifyParams({
      questionId: { type: 'string', required: true },
      size: { type: 'number', required: true },
      page: { type: 'number', required: true },
    })
    const page = Math.max(ctx.request.body.page * 1, 1) - 1 // 目前是第几页
    const size = Math.max(ctx.request.body.size * 1, 10) // 每页的条数
    ctx.body = decorator({
      data: await answerModel
        .find({
          content: new RegExp(ctx.request.body.q),
          questionId: ctx.request.body.questionId,
        }) // 正则匹配，模糊搜索
        .limit(size)
        .skip(page * size),
    })
  }
  // 答案详情
  async answerInfo(ctx) {
    ctx.verifyParams({
      answerId: { type: 'string', required: true },
    })
    const answer = await answerModel
      .findById(ctx.request.body.answerId)
      .populate('createUser')
    if (!answer) {
      ctx.body = decorator({
        code: 400,
        message: '该答案不存在',
      })
      return
    }
    ctx.body = decorator({
      data: answer,
    })
  }
  // 新增答案
  async addAnswer(ctx) {
    ctx.verifyParams({
      questionId: { type: 'string', required: true },
      content: { type: 'string', required: true },
    })
    const answer = await new answerModel({
      ...ctx.request.body,
      createUser: ctx.state.user._id,
    }).save()
    if (!answer) {
      ctx.throw(400, '新增答案失败...')
      return
    }
    ctx.body = decorator({
      message: '答案新增成功',
    })
  }
  // 修改答案🍉
  async editAnswer(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    })
    await ctx.state.answer.update(ctx.request.body, {
      new: true,
    })
    if (!ctx.state.answer) {
      ctx.throw(400, '修改答案失败...')
      return
    }
    ctx.body = decorator({
      message: `修改成功 ${ctx.state.answer}`,
    })
  }

  // 获取登录用户发布的答案列表
  async getUserCreateAnswers(ctx) {
    try {
      const answerList = await answerModel.find({
        createUser: ctx.state.user._id,
      })
      ctx.body = decorator({
        message: '查询成功',
        data: answerList,
      })
    } catch (error) {
      ctx.body = decorator({ code: 400, message: '响应失败' })
    }
  }
}

module.exports = new AnswerC()
