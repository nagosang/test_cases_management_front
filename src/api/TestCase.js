import request from '@/utils/request'

export function getTestCaseList(projectId, belong) {
  return request({
    url: '/getTestCaseList?projectId=' + projectId+ '&belongId=' + belong,
    method: 'get',
  })
}
