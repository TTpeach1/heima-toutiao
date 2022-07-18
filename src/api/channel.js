import request from '@/utils/request'

/**
 *
 * @returns
 */
export const getMyChannelApi = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}
/**
 * 获取所有频道列表
 * @returns promise
 */
export const getAllChannelApi = () => {
  return request({
    url: '/v1_0/channels'
  })
}
