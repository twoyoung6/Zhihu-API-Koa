// 评论表模型设计
const mongoose = require('mongoose')
const { Schema, model } = mongoose
mongoose.set('useFindAndModify', false)

// Schema 用于生成表（json文档）的类
const commentSchema = new Schema(
  {
    __v: { type: Number, select: false },
    questionId: { type: String, required: true, select: true },
    answerId: { type: String, required: true, select: true },
    content: { type: String, required: true },
    rootId: { type: Schema.Types.ObjectId, ref: 'Comment', select: true },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      select: false,
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

module.exports = model('Comment', commentSchema)
