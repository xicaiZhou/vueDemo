

import {
    request
  } from '@/common/request.js';

//   新增收入
export function officeIncomeSave(form) {
    return request({
        method: "post",
        url: "/budget/office_income/save",
        data: form
    })
}
//   编辑收入
export function officeIncomeUpdate(form) {
    return request({
        method: "post",
        url: "/budget/office_income/update",
        data: form
    })
}
// 分页查询
export function getOfficeIncomeList(form) {
    return request({
        method: "post",
        url: "budget/office_income/page",
        data: form
    })
}
//根据ID查询收入
export function getOfficeIncomeFind(params) {
    return request({
        method: "get",
        url: "budget/office_income/findById",
        params: params
    })
}
// 新增明细
export function detailSave(form) {
    return request({
        method: "post",
        url: "budget/office_income/detail/save",
        data: form
    })
}
// 修改明细
export function detailUpdate(form) {
    return request({
        method: "post",
        url: "/budget/office_income/detail/update",
        data: form
    })
}
// 查询明细
export function detailList(params) {
    return request({
        method: "get",
        url: "/budget/office_income/detail/list",
        params: params
    })
}
// 刪除明细
export function detailDelete(form) {
    return request({
        method: "post",
        url: "/budget/office_income/detail/delete",
        data: form
    })
}
// 确认审核
export function detailAudit(form) {
    return request({
        method: "post",
        url: "/budget/office_income/audit",
        data: form
    })
}

// 删除收入
export function officeIncomeDelete(params) {
    return request({
				method: "get",
				url: "/budget/office_income/del",
				params: params
    })
}