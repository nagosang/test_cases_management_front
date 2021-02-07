import request from '@/utils/request'

export function getGroupList() {
    return request({
      url: '/getGroupList',
      method: 'get',
    })
  }
  