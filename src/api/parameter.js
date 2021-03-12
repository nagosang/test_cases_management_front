import request from '@/utils/request'

export function addParameter(data, interfaceId) {
  return request({
    url: '/addParameter?interfaceId='+ interfaceId,
    method: 'post',
    data
  })
}

export function deleteParameter(parameterId, interfaceId) {
  return request({
    url: '/deleteParameter?parameterId='+parameterId+'&interfaceId='+interfaceId,
    method: 'get'
  })
}

export function updateParameter(data, interfaceId) {
  return request({
    url: '/updateParameter?interfaceId=' + interfaceId,
    method: 'post',
    data
  })
}
