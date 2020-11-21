const commentModel = require('../models/comment.js')
const { decorator } = require('../utils/utils.js') // 请求 response 统一处理脚本

class CommentC {
  // 🍎检测评论的有效性
  async checkCommentExist(ctx, next) {
    ctx.verifyParams({
      questionId: { type: 'string', required: true },
      answerId: { type: 'string', required: true },
      commentId: { type: 'string', required: true },
    })
    const comment = await commentModel.findById(ctx.request.body.commentId)
    console.log(comment, ctx.request.body.questionId)
    if (!comment) {
      ctx.body = decorator({
        code: 400,
        message: '该评论不存在',
      })
      return
    }
    if (
      comment.answerId !== ctx.request.body.answerId ||
      comment.questionId !== ctx.request.body.questionId
    ) {
      ctx.body = decorator({
        code: 400,
        message: '该回答下没有此评论',
      })
      return
    }
    ctx.state.comment = comment // 会话缓存 comment
    await next()
  }
  // 🚕某问题下的评论列表
  async commentList(ctx) {
    ctx.verifyParams({
      answerId: { type: 'string', required: true },
      questionId: { type: 'string', required: true },
      rootId: { type: 'string', required: false },
      size: { type: 'number', required: true },
      page: { type: 'number', required: true },
    })
    const page = Math.max(ctx.request.body.page * 1, 1) - 1 // 目前是第几页
    const size = Math.max(ctx.request.body.size * 1, 10) // 每页的条数
    ctx.body = decorator({
      data: await commentModel
        .find({
          content: new RegExp(ctx.request.body.q),
          questionId: ctx.request.body.questionId,
          answerId: ctx.request.body.answerId,
          rootId: ctx.request.body.rootId,
        }) // 正则匹配，模糊搜索
        .limit(size)
        .skip(page * size)
        .populate('from to rootId'),
    })
  }
  // 评论详情
  async commentInfo(ctx) {
    ctx.verifyParams({
      commentId: { type: 'string', required: true },
    })
    const comment = await commentModel
      .findById(ctx.request.body.commentId)
      .populate('from to rootId')
    if (!comment) {
      ctx.body = decorator({
        code: 400,
        message: '该评论不存在',
      })
      return
    }
    ctx.body = decorator({
      data: comment,
    })
  }
  // 新增评论
  async addComment(ctx) {
    ctx.verifyParams({
      answerId: { type: 'string', required: true },
      questionId: { type: 'string', required: true },
      content: { type: 'string', required: true },
      rootId: { type: 'string', required: false },
      to: { type: 'string', required: false },
    })
    const comment = await new commentModel({
      ...ctx.request.body,
      from: ctx.state.user._id,
    }).save()
    if (!comment) {
      ctx.throw(400, '新增评论失败...')
      return
    }
    ctx.body = decorator({
      message: '评论新增成功',
    })
  }
  // 修改评论🍉
  async editComment(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
    })
    const { content } = ctx.request.body
    await ctx.state.comment.update(
      { content },
      {
        new: true,
      }
    )
    if (!ctx.state.comment) {
      ctx.throw(400, '修改评论失败...')
      return
    }
    ctx.body = decorator({
      message: `修改成功 ${ctx.state.comment}`,
    })
  }

  // 获取登录用户发布的评论列表
  async getUserCreateComments(ctx) {
    try {
      const commentList = await commentModel
        .find({
          from: ctx.state.user._id,
        })
        .populate('from to rootId')
      ctx.body = decorator({
        message: '查询成功',
        data: commentList,
      })
    } catch (error) {
      ctx.body = decorator({ code: 400, message: '响应失败' })
    }
  }
}

module.exports = new CommentC()
