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

export function groupChangeLeader(groupId, newLeaderId) {
  return request({
    url: '/groupChangeLeader?groupId='+groupId+'&newLeaderId='+newLeaderId,
    method:'post'
  })
}

export function removeMember(groupId, memberId) {
  return request({
    url: '/removeMember?groupId='+groupId+'&memberId='+memberId,
    method: 'post'
  })
}

export function getGroupListForChange(groupId) {
  return request({
    url: '/getGroupListForChange?groupId=' + groupId,
    method: 'get'
  })
}
