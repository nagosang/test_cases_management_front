import request from '@/utils/request'

export function getGroupList() {
  return request({
    url: '/getGroupList',
    method: 'get',
  })
}
  
export function createGroup(data) {
  return request({
    url: '/createGroup',
    method: 'post',
    data
  })
}

export function deleteGroup(groupId) {
  return request({
    url: '/deleteGroup?groupId='+groupId,
    method: 'get'
  })
}

export function groupAddMember(memberId, groupId) {
  return request({
    url: '/groupAddMember?memberId=' + memberId + '&groupId=' + groupId,
    method: 'get',
  })
}
