 /* jshint esversion: 6 */
 import {
     request
 } from '@/common/request.js';

 // 查询子部门
 export function find(data) {
     return request({
         method: "post",
         url: "/dept/find",
         params: data
     })
 }

 // 新增部门
 export function save(data) {
     return request({
         method: "post",
         url: "/dept/save",
         data
     })
 }

 // 查询门店
export function findAllId(form) {
    return request({
        method: "post",
        url: `/dept/find_all_id?parentId=${form.parentId}`,
        data: form
    })
}
  // 查询部门列表 
 export function findAll(data) {
    return request({
        method: "post",
        url: "/dept/findAll",
        data
    })
}

 // 修改部门信息
 export function update(data) {
     return request({
         method: "post",
         url: "/dept/update",
         data
     })
 }

 // 删除菜单
 export function remove(data) {
     return request({
         method: "post",
         url: "/dept/remove",
         params: {
             id: data
         }
     })
 }