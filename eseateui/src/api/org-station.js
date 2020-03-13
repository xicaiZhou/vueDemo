import {
    request
} from '@/common/request.js';

// 查询子部门
export function FindStation(data) {
    return request({
        method: "post",
        url: "/station/find",
        data
    })
}