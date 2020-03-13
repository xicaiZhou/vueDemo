import {
  request
} from '@/common/request.js';

//办公支出-分页查询
export function getOfficeExpenditure(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/page",
    data: params
  });
}

//办公支出-新增
export function saveOfficeExpenditure(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/save",
    data: params
  });
}

//办公支出-修改
export function updateOfficeExpenditure(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/update",
    data: params
  });
}

//办公支出-明细查询
export function getOfficeExpenditureDetail(params) {
  return request({
    method: "get",
    url: `/budget/office_expenditure/detail/list?officeExpenditureId=${params.officeExpenditureId}`,
    data: {}
  });
}

//办公支出-明细新增
export function saveOfficeExpenditureDetail(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/detail/save",
    data: params
  });
}

//办公支出-明细修改
export function updateOfficeExpenditureDetail(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/detail/update",
    data: params
  });
}

//办公支出-明细删除(支持批量删除)
export function deleteOfficeExpenditureDetail(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/detail/delete",
    data: params
  });
}

//办公支出-财务审核确认
export function saveOfficeExpenditureAudit(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/audit",
    data: params
  });
}

//办公支出-根据ID查询
export function getOfficeExpenditureFindById(id) {
  return request({
    method: "get",
    url: `/budget/office_expenditure/findById?id=${id}`,
    data: {}
  });
}

//店长审核
export function shopownerAudit(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/shopowner/audit",
    data: params
  });
}

//经理审核
export function managerAudit(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/manager/audit",
    data: params
  });
}

//财务审核
export function officeExpenditureAudit(params) {
  return request({
    method: "post",
    url: "/budget/office_expenditure/audit",
    data: params
  });
}

// 删除支出
export function officeExpenditureDelete(params) {
  return request({
    method: "get",
    url: "/budget/office_expenditure/del",
    params: params
})
}