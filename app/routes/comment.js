const jwt = require('koa-jwt')
const { secret } = require('../config')
const Router = require('koa-router')
const router = new Router({ prefix: '/comment' }) // koa-router 路由前缀

// 引入评论控制器
const {
  commentList,
  commentInfo,
  addComment,
  editComment,
  checkCommentExist,
  getUserCreateComments,
} = require('../controllers/comment.js')

const auth = jwt({ secret })
// Comment列表
router.post('/', async (ctx, next) => {
  await commentList(ctx)
})
// 评论详情
router.post('/detail', async (ctx, next) => {
  await commentInfo(ctx)
})
// 新增评论
router.post('/add', auth, async (ctx, next) => {
  await addComment(ctx)
})
// 修改评论
router.post('/edit', auth, checkCommentExist, async (ctx, next) => {
  await editComment(ctx)
})

router.post('/createCommentsList', auth, async (ctx, next) => {
  await getUserCreateComments(ctx)
})

module.exports = router
