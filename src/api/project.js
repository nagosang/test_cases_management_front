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

export function getProjectInfo(projectId) {
  return request({
    url: '/getProjectInfo?projectId=' + projectId,
    method: 'get'
  })
}

export function updateProjecInfo(data) {
  return request({
    url: '/updateProjectInfo',
    method: 'post',
    data
  })
}
