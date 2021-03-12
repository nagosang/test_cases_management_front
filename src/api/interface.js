import request from '@/utils/request'

export function getInterfaceList(projectId, belong) {
  return request({
    url: '/getInterfaceList?projectId=' + projectId+ '&belongId=' + belong,
    method: 'get',
  })
}

export function getInterfaceInfo(interfaceId) {
  return request({
    url: '/getInterfaceInfo?interfaceId='+ interfaceId,
    method: 'get',
  })
}

export function updateInterfaceInfo(data) {
  return request({
    url: '/updateInterfaceInfo',
    method: 'post',
    data
  })
}

export function deleteInterface(interfaceId, projectId) {
  return request({
    url: '/deleteInterface?interfaceId='+ interfaceId +'&projectId='+projectId,
    method: 'get'
  })
}

export function addInterface(data) {
  return request({
    url: '/addInterface',
    method: 'post',
    data
  })
}
