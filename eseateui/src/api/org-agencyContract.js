import {
  request
} from '@/common/request.js';
// 代理合同

/**
 * 分页查询
 */
export function getAgencyByPage(params) {
  return request({
    method: "post",
    url: "/agency/page",
    data: params
  });
}

/**
 * 代理合同新增
 */
export function saveAgency(params) {
  return request({
    method: "post",
    url: "/agency/save",
    data: params
  });
}

/**
 * 代理合同修改
 */
export function updateAgency(params) {
  return request({
    method: "post",
    url: "/agency/update",
    data: params
  });
}

/**
 * 代理合同作废
 */
export function cancelAgency(params) {
  return request({
    method: "post",
    url: "/agency/cancel",
    data: params
  });
}

/**
 * 代理合同删除
 */
export function deleteAgency(params) {
  return request({
    method: "post",
    url: "/agency/delete",
    data: params
  });
}

/**
 * 判断代理合同编号是否存在
 */
export function existeAgencyNo(agencyNo) {
  return request({
    method: "get",
    url: `/agency/agencyNo/existe`,
    params: { agencyNo }
  });
}

/*
* 经纪人审核/撤销
* isBroker
* 0 未审核， 1 审核， 2 取消审核
*/
export function brokerAudit(params) {
  return request({
    method: "post",
    url: "/agency/broker/audit",
    data: params
  });
}

/*
* 店长审核/撤销
* isShopowner
* 0 未审核， 1 审核， 2 取消审核
*/
export function shopownerAudit(params) {
  return request({
    method: "post",
    url: "/agency/shopowner/audit",
    data: params
  });
}

/*
* 经理审核/撤销
* isManager
* 0 未审核， 1 审核， 2 取消审核
*/
export function managerAudit(params) {
  return request({
    method: "post",
    url: "/agency/manager/audit",
    data: params
  });
}

/*
* 财务审核/撤销
* isAudit
* 0 未审核， 1 审核， 2 取消审核
*/
export function financialAudit(params) {
  return request({
    method: "post",
    url: "/agency/audit",
    data: params
  });
}
/**
 * 查询付款协议列表
 */
export function getPaymentAgreement(data) {
  return request({
    method: "post",
    url: "/agency/payment_agreement/template/get",
    data
  });
}

/**
 * 查询合同详情
 */
export function getContractDetail(id) {
  return request({
    method: "get",
    url: `/agency/findById`,
    params: { id }
  });
}
/**
 * 根据编号获取子类是否在审核中（业主租金和所有预付房租）
 */
export function findByAgencyNo(agencySysNo) {
  return request({
    method: "get",
    url: `/agency/findByAgencySysNo`,
    params: { agencySysNo }
  });
}
/**
 * 变更合同
 */
export function changeAgency(data = {}) {
  return request({
    method: "post",
    url: `/agency/change`,
    data
  });
}
/**
 * 获取成交人
 */
export function findTrader(storeId) {
  return request({
    method: "post",
    url: `/dept/findUserByStoreId`,
    params: { storeId }//根据门店id
  });
}
/**
 * 获取预收预付信息
 */
export function updatePayment(data = {}) {
  return request({
    method: "post",
    url: `/agency/cost_detail/get`,
    data
  });
}
/**
 * 代理合同新增
 */
export function saveContract(data = {}) {
  return request({
    method: "post",
    url: `/agency/save`,
    data
  });
}
/**
 * 业主押金分页查询
 */
export function getAgencyDeposit(data = {}) {
  return request({
    method: "post",
    url: `/agency/agencyDeposit`,
    data
  });
}
/**
 * 业主押金确认回收
 */
export function entryAgencyDeposit(data = {}) {
  return request({
    method: "post",
    url: `/agency/entryDeposit`,
    data
  });
}