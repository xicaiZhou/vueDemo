import {
    request
} from '@/common/request.js';

// 获取角色
export function AllRole(form) {
    return request({
        method: "post",
        url: "/role/find",
        data: form
    })
}
// 移除角色
export function RemoveRole(form) {
    return request({
        method: "post",
        url: "/role/remove",
        params: form
    })
}
// 修改角色
export function EditRole(form) {
    return request({
        method: "post",
        url: "/role/update",
        data: form
    })
}
// 修改角色
export function AddRole(form) {
    return request({
        method: "post",
        url: "/role/save",
        data: form
    })
}