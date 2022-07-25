import request from '@/utils/request'
// import store from '@/store'

export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}

export const timeBtnApi = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`,
    method: 'GET'
  })
}

export const getUserInfoApi = () => {
  return request({
    url: '/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
/**
 *
 * @param {*} id
 * @returns 关注作者
 */
export const attentionApi = (id) => {
  return request({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target: id
    }
  })
}
/**
 *
 * @param {*} id
 * @returns 取关作者
 */
export const noattentionApi = (id) => {
  return request({
    url: `/v1_0/user/followings/${id}`,
    method: 'DELETE',
    data: {
      target: id
    }
  })
}
/**
 *
 * @param {*} name
 * @param {*} gender 性别，0-男，1-女
 * @param {*} birthday
 * @param {*} intro 个人介绍
 * @returns 编辑用户个人资料
 */
export const compileUserApi = (name, gender, birthday, intro) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: {
      name,
      gender,
      birthday,
      intro
    }
  })
}
/**
 *
 * @returns 获取信息
 */
export const getUserApi = () => {
  return request({
    url: '/v1_0/user/profile',
    method: 'GET'
  })
}
export const getPhotoApi = (photo) => {
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: {
      photo
    }
  })
}
