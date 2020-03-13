import {
  request
} from '@/common/request.js';
// 确认审核
export function tableAudit(params) {
  return request({
    method: "post",
    url: "/budget/contract_income/audit",
    data: params
  });
}
// 刪除明细
export function deleteContractIncome(params) {
  return request({
    method: "post",
    url: "/budget/contract_income/detail/delete",
    data: params
  });
}
// 查询明细
export function getContractIncomeList(params) {
  return request({
    method: "get",
    url: "/budget/contract_income/detail/list",
    params
  });
}
// 新增明细
export function saveContractIncomeDetail(params) {
  return request({
    method: "post",
    url: "/budget/contract_income/detail/save",
    data: params
  });
}
// 更新明细
export function updateContractIncomeDetail(params) {
  return request({
    method: "post",
    url: "/budget/contract_income/detail/update",
    data: params
  });
}
//根据ID查询收入 
export function findContractIncomeById(params) {
  return request({
    method: "get",
    url: "/budget/contract_income/findById",
    params
  });
}
// 分页查询
export function getContractIncomeByPage(params) {
  return request({
    method: "post",
    url: "/budget/contract_income/page",
    data: params
  });
}
// 收入新增
export function saveContractIncome(params) {
  return request({
    method: "post",
    url: "/budget/contract_income/save",
    data: params
  });
}
// 收入修改
export function updateContractIncome(params) {
  return request({
    method: "post",
    url: "/budget/contract_income/update",
    data: params
  });
}

// 删除Table 
export function deteleTableContractIncome(params) {
  return request({
    method: "get",
    url: "/budget/contract_income/del",
    params: params
})
}