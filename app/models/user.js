// 用户表模型设计
const mongoose = require('mongoose')
const { Schema, model } = mongoose

// Schema 用于生成表（json文档）的类
const userSchema = new Schema({
  __v: { type: Number, select: false },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  addr: { type: String, required: false },
  age: { type: Number, required: false },
})

// model 申明（实例化） userSchema 表
module.exports = model('User', userSchema)
