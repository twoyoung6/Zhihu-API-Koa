// 答案表模型设计
const mongoose = require('mongoose')
const { Schema, model } = mongoose
mongoose.set('useFindAndModify', false)

// Schema 用于生成表（json文档）的类
const answerSchema = new Schema(
  {
    __v: { type: Number, select: false },
    questionId: { type: String, required: true, select: true },
    content: { type: String, required: true },
    createUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      select: false,
      required: true,
    },
    likeCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = model('Answer', answerSchema)
