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
