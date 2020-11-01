// 用户表模型设计
const mongoose = require('mongoose')
const { Schema, model } = mongoose
mongoose.set('useFindAndModify', false)

// Schema 用于生成表（json文档）的类
const topicSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  description: { type: String, required: true },
  avatar_url: { type: String, required: false },
})

module.exports = model('Topics', topicSchema)
