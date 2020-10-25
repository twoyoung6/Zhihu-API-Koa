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
  locations: { type: [{ type: String, required: false }] },
  // 行业
  business: { type: String, required: false },
  // 职业
  occupation: {
    type: [
      {
        company: { type: String },
        job: {
          type: String,
          enum: ['coder', 'player', 'singer', 'dancer', 'nijia'],
        },
      },
    ],
  },
  followList: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }], // 定义类型为 objectId ,ref是关联的模型名称
    select: false,
  },
})

// model 申明（实例化） userSchema 表
module.exports = model('User', userSchema)
