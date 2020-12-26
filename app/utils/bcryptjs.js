const bcrypt = require('bcryptjs')

/**
 * 加密
 * @param {*} password
 */
const encrypt = (password) => {
  let salt = bcrypt.genSaltSync(5)
  let hash = bcrypt.hashSync(password, salt)
  return hash
}

/**
 * 解密
 * @param {*} password 明文密码
 * @param {*} hash 加密之后的密码
 */
const decrypt = (password, hash) => {
  return bcrypt.compareSync(password, hash)
}

module.exports = {
  encrypt,
  decrypt,
}
