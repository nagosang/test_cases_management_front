import request from '@/utils/request'

export function getProjectListByGroup(groupId) {
  return request({
    url: '/getProjectListByGroup?groupId=' + groupId,
    method: 'get',
  })
}

export function getProjectListByUser() {
  return request({
    url: '/getProjectListByUser',
    method: 'get',
  })
}
