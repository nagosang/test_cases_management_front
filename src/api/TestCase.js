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

export function createTestCaseStep(projectId, data) {
  return request({
    url:'/createTestCaseStep?projectId=' + projectId,
    method: 'post',
    data
  })
}

export function deleteTestCaseStep(testCaseStepId, projectId) {
  return request({
    url: '/deleteTestCaseStep?testCaseStepId=' + testCaseStepId + '&projectId=' + projectId,
    method: 'get'
  })
}

export function changeTestCaseStep(projectId, data) {
  return request({
    url: '/changeTestCaseStepNo?projectId=' + projectId,
    method: 'post',
    data
  })
}

export function createTestCase(data) {
  return request({
    url: '/createTestCase',
    method: 'post',
    data
  })
}

export function deleteTestCase(testCaseId, projectId) {
  return request({
    url: '/deleteTestCase?testCaseId=' + testCaseId + '&projectId=' + projectId,
    method: 'get'
  })
}
