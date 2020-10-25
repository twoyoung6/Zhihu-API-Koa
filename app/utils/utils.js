module.exports.decorator = ({
  code = 200,
  message = '响应成功',
  data = null,
}) => {
  return {
    code: code,
    message: message,
    data: data,
  }
}
