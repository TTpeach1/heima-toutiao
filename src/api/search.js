import request from '@/utils/request'

export const getSearchSuggestionApi = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: { q }
  })
}

export const getSearchResultApi = (page, perPage, q) => {
  return request({
    url: '/v1_0/search',
    params: { page, per_page: perPage, q }
  })
}
