import request from '@/utils/request'

export function getTestCaseList(projectId, belong) {
  return request({
    url: '/getTestCaseList?projectId=' + projectId+ '&belongId=' + belong,
    method: 'get',
  })
}

export function getTestCaseInfo(testCaseId) {
  return request({
    url: '/getTestCaseInfo?testCaseId=' + testCaseId,
    method: 'get'
  })
}

export function updateTestCaseStep(projectId, data) {
  return request({
    url: '/updateTestCaseStep?projectId=' + projectId,
    method: 'post',
    data
  })
}
