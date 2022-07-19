import request from '@/utils/request'
import storage from '@/utils/storage'

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

export const delMyChannelApi = (target) => {
  return request({
    url: `/v1_0/user/channels/${target}`,
    method: 'DELETE'
  })
}

export const addMyChannelApi = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [{ id, seq }]
    }
  })
}

// 在本地存取数据
const TOUTIAO_CHANNELS = 'TOUTIAO_CHANNELS'
export const getMyChannelsByLocal = () => storage.get(TOUTIAO_CHANNELS)
export const setMyChannelsToLocal = (channel) =>
  storage.set(TOUTIAO_CHANNELS, channel)
