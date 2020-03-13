import {
  request
} from '@/common/request.js';
// 临时帐

/**
 * 分页查询
 */
export function getTempAccountByPage(params) {
  return request({
    method: "post",
    url: "/temporary/account/page",
    data: params
  });
}
/**
 * 新增
 */
export function saveTempAccountByPage(params) {
  return request({
    method: "post",
    url: "/temporary/account/save",
    data: params
  });
}
/**
 * 更新
 */
export function updateTempAccountByPage(params) {
  return request({
    method: "post",
    url: "/temporary/account/update",
    data: params
  });
}

// 以下接口是公司账户卡号管理
/**
 * 分页查询
 */
export function getCompanyCardtByPage(params) {
  return request({
    method: "post",
    url: "/company/card/find",
    data: params
  });
}
/**
 * 新增
 */
export function saveCompanyCard(params) {
  return request({
    method: "post",
    url: "/company/card/save",
    data: params
  });
}
/**
 * 更新
 */
export function updateCompanyCard(params) {
  return request({
    method: "post",
    url: "/company/card/update",
    data: params
  });
}
/**
* 根据id删除
*/
export function cardDeleteById(id) {
  return request({
    method: "get",
    url: `/company/card/delete`,
    params: { id }
  });
}
/**
 * 根据ID删除/company/card/findById
*/
export function cardFindyId(id) {
  return request({
    method: "get",
    url: `/company/card/findById`,
    params: { id }
  });
}
/**
 * 现金查询
 */
export function findFlowCash(params) {
  return request({
    method: "post",
    url: "/flow/cash/find",
    data: params
  });
}
/**
 * 现金更新
 */
export function updateFlowCash(params) {
  return request({
    method: "post",
    url: "/flow/cash/update",
    data: params
  });
}
/**
 * 账户查询
 */
export function findFlowCompanyCard(params) {
  return request({
    method: "post",
    url: "/flow/company/card/find",
    data: params
  });
}
/**
 * 账户更新
 */
export function updateFlowCompanyCard(params) {
  return request({
    method: "post",
    url: "/flow/company/card/update",
    data: params
  });
}

/**********************************流水明细*************************************/
/**
 * 流水明细查询
 */
export function findFlowDetailPage(params) {
  return request({
    method: "post",
    url: "/flowDetail/page",
    data: params
  });
}
/**
 * 流水明细-确认凭证
 */
export function flowDetailConfirm(data) {
  return request({
    method: "post",
    url: "/flowDetail/confirm",
    params: {
      id: data
    }
  });
}
/**
 * 流水明细-撤销凭证
 */
export function flowDetailCancel(data) {
  return request({
    method: "post",
    url: "/flowDetail/cancelConfirm",
    params: {
      id: data
    }
  });
}
/**
 * 流水管理-根据公司ID和日期获取日流水
 */
export function flowDetailByDay(params) {
  return request({
    method: "post",
    url: `/flowDetail/flowByDay?companyId=${params.companyId}&date=${params.date}`,
    data: params
  });
}
/**
 * 流水管理-根据公司ID获取盘点流水
 */
export function flowGenerateFlowByDay(params) {
  return request({
    method: "post",
    url: `/flowDetail/generateFlowByDay?companyId=${params.companyId}`,
    data: params
  });
}


