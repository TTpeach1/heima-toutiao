import request from '@/utils/request'
/**
 *
 * @param {*} id
 * @returns 获取评论或评论回复
 */
export const getCommentApi = (type, source, offset, limit) => {
  return request({
    url: '/v1_0/comments',
    params: {
      type,
      source,
      offset,
      limit
    }
  })
}
