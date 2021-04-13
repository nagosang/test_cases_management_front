import request from '@/utils/request'

export function autoTest(data, method, interfaceId) {
  return request({
    url: '/autoTest?method=' + method + "&interfaceId=" + interfaceId,
    method: 'post',
    data
  })
}

export function autoTestByTimes(data, method, interfaceId) {
  return request({
    url: '/autoTestByTimes?method=' + method + "&interfaceId=" + interfaceId,
    method: 'post',
    data
  })
}

export function confirmTestResults(id) {
  return request({
    url: '/confirmTestResults?id='+id,
    method: 'get'
  })
}

export function queryTestResultsByPage(interfaceId, page) {
  return request({
    url: '/queryTestResultsByPage?interfaceId=' + interfaceId + "&page=" + page,
    method: 'get'
  })
}
