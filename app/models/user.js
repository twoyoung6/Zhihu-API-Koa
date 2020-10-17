// 用户表模型设计
const mongoose = require('mongoose')
const { Schema, model } = mongoose

// Schema 用于生成表（json文档）的类
const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: false },
})

// model 申明（实例化） userSchema 表
module.exports = model('User', userSchema)
