import {
  request
} from '@/common/request.js'

/**
 * 查询业主分页列表
 * @param {*} data 
 */
export function findMemberPager(data = {}) {
  return request({
    method: "post",
    url: "/member/findByPage",
    data
  })
}
/**
 * 修改业主
 * @param {*} data 
 */
export function updateMemberPager(data = {}) {
  return request({
    method: "post",
    url: "/member/update",
    data
  })
}
/**
 * 删除业主
 * @param {*} data 
 */
export function removeMemberById(params) {
  return request({
    method: "post",
    url: "/member/remove",
    params: params
  })
}
/**
 * 新建业主
 * @param {*} data 
 */
export function createMember(data = {}) {
  return request({
    method: "post",
    url: "/member/entry",
    data
  })
}

/**
 * 查询台账列表
 * @param {*} data 
 */
export function findLedger(data = {}) {
  return request({
    method: "post",
    url: "/contract/account/findByPage",
    data
  })
}