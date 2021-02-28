import request from '@/utils/request'

export function getNoGroupUser() {
  return request({
    url: '/getNoGroupUser',
    method: 'get',
  })
}

export function getInfo() {
  return request({
    url: '/getUserInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getGroupMember(groupId) {
  return request({
    url: '/getGroupMember?groupId=' + groupId,
    method: 'get'
  })
}
