//引入readline-sync模块
const readline = require('readline-sync');
let name = readline.question("your Database name: ");
let password = readline.question("your Database password: ");
console.log(name + ':' + password);

module.exports = {
  // dbUrl: 'mongodb://admin:admin@localhost:27017', // 本地
  // dbUrl: 'mongodb://admin:wdcs303@115.159.55.14:27017/test', // 生产
  dbUrl: 'mongodb://name:password@115.159.55.14:27017/test',
  secret: 'zhihu-pwd', // JWT 签名密钥
}
