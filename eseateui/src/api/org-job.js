

 import {
    request
} from '@/common/request.js'

// 查询部门下岗位
export const stationFind = (params) => {
    return request({
        method: "post",
        url: "/station/find",
        data: params
    })
}

// 新建岗位
export const stationSave = (data) => {
    return request({
        method: "post",
        url: "/station/save",
        data: data
    })
}

// 修改岗位
export const stationUpdate = (data) => {
    return request({
        method: "post",
        url: "/station/update",
        data: data
    })
}


// 删除岗位
export const stationRemove = (params) => {
    return request({
        method: "post",
        url: "/station/remove",
        params: params
    })
}


// 查询所有岗位标签
export const stationFindTags = (params) => {
    return request({
        method: "post",
        url: "/station/findTags",
        params: params
    })
}
