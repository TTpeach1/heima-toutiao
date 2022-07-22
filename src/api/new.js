import request from '@/utils/request'

export const getArticleListApi = (channelId, timestamp) => {
  return request({
    url: 'v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}
/**
 *
 * @param {*} id
 * @returns 获取文章详情
 */
export const getContentApi = (id) => {
  return request({
    url: '/v1_0/articles/' + id
  })
}
// export const getContentApi = (article_id) => {
//   return request({
//     url: '/v1_0/articles/' + article_id
//   })
// }
export const setCollectApi = (id) => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target: id
    }
  })
}
export const getCollectApi = (id) => {
  return request({
    url: `/v1_0/article/collections/${id}`,
    method: 'DELETE',
    data: {
      target: id
    }
  })
}
/**
 *
 * @param {*} id
 * @returns 点赞
 */
export const setPointApi = (id) => {
  return request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target: id
    }
  })
}
/**
 *
 * @param {*} id
 * @returns 取消点赞
 */
export const getPointApi = (id) => {
  return request({
    url: `/v1_0/article/likings/${id}`,
    method: 'DELETE'
  })
}
