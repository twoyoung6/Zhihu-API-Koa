// 用户表模型设计
const mongoose = require('mongoose')
const { Schema, model } = mongoose
mongoose.set('useFindAndModify', false)
// Schema 用于生成表（json文档）的类
const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  addr: { type: String, required: false },
  age: { type: Number, required: false },
  // 头像
  avatar_url: { type: String, required: false },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
    default: 'male',
  },
  // 自我介绍
  introduce: { type: String },
  // 地址
  locations: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topics',
        required: false,
        select: false,
      },
    ],
  },
  // 行业
  business: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Topics',
        required: false,
        select: false,
      },
    ],
  },
  // 职业
  occupation: {
    type: [
      {
        company: { type: Schema.Types.ObjectId, ref: 'Topics', select: false },
        job: {
          type: Schema.Types.ObjectId,
          ref: 'Topics',
          enum: ['coder', 'player', 'singer', 'dancer', 'nijia'],
          select: false,
        },
      },
    ],
  },
  followList: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 定义类型为 objectId ,ref是关联的表实例名称
  },
})

// model 申明（实例化） userSchema 表
module.exports = model('User', userSchema)
