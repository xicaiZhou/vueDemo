import {
  request
} from '@/common/request.js';
// 刪除明细
export function deleteContractExpenditureDetail(params) {
  return request({
    method: "post",
    url: "/budget/contract_expenditure/detail/delete",
    data: params
  });
}
// 查询明细
export function getContractExpenditureDetailList(params) {
  return request({
    method: "get",
    url: "/budget/contract_expenditure/detail/list",
    params
  });
}
// 新增明细 
export function saveContractExpenditureDetail(params) {
  return request({
    method: "post",
    url: "/budget/contract_expenditure/detail/save",
    data: params
  });
}
// 更新明细 
export function updateContractExpenditureDetail(params) {
  return request({
    method: "post",
    url: "/budget/contract_expenditure/detail/update",
    data: params
  });
}

/**
 * 根据ID查询支出
 * id: contractExpenditureId
 */
export function findContractExpenditureById(params) {
  return request({
    method: "get",
    url: "/budget/contract_expenditure/findById",
    params
  });
}
// 分页查询
export function getContractExpenditureByPage(params) {
  return request({
    method: "post",
    url: "/budget/contract_expenditure/page",
    data: params
  });
}
// 支出新增
export function saveContractExpenditure(params) {
  return request({
    method: "post",
    url: "/budget/contract_expenditure/save",
    data: params
  });
}
// 支出修改
export function updateContractExpenditure(params) {
  return request({
    method: "post",
    url: "/budget/contract_expenditure/update",
    data: params
  });
}


/**
 * 删除
 * id: contractExpenditureId
 */
export function deleteContractExpenditure(params) {
  return request({
    method: "get",
    url: "/budget/contract_expenditure/del",
    params: params
  });
}

//店长审核
export function shopownerAudit(params) {
  return request({
    method: "post",
    url: "/budget/contract_expenditure/shopowner/audit",
    data: params
  });
}

//经理审核
export function managerAudit(params) {
  return request({
    method: "post",
    url: "/budget/contract_expenditure/manager/audit",
    data: params
  });
}

//财务审核
export function contractExpenditureAudit(params) {
  return request({
    method: "post",
    url: "/budget/contract_expenditure/audit",
    data: params
  });
}