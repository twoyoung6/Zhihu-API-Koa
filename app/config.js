// 配置文件
module.exports = {
  // dbUrl: 'mongodb://admin:admin@localhost:27017', // 本地
  dbUrl:
    'mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb', // 生产
  secret: 'zhihu-pwd', // JWT 签名密钥
}
