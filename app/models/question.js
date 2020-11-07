// 问题表模型设计
const mongoose = require('mongoose')
const { Schema, model } = mongoose
mongoose.set('useFindAndModify', false)

// Schema 用于生成表（json文档）的类
const questionSchema = new Schema({
  __v: { type: Number, select: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    select: false,
    required: true,
  },
  topicList: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topics',
      },
    ],
    select: false,
  },
})

module.exports = model('Question', questionSchema)
