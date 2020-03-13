import {
  request
} from '@/common/request.js';
// 租赁合同

/**
 * 分页查询
 */
export function getLeaseByPage(params) {
  return request({
    method: "post",
    url: "/lease/page",
    data: params
  });
}
/**
 * 查询租赁合同详情
 */
export function getLeaseContractDetail(id) {
  return request({
    method: "get",
    url: `/lease/findById`,
    params: { id }
  });
}
/**
 * 判断代理合同编号是否存在
 */
export function existeLeaseNo(leaseNo) {
  return request({
    method: "get",
    url: `/lease/leaseNo/existe`,
    params: { leaseNo }
  });
}
/**
 * 根据编号获取子类是否在审核中（租户押金和所有预收房租）
 */
export function findByLeaseNo(leaseSysNo) {
  return request({
    method: "get",
    url: `/lease/findByLeaseSysNo`,
    params: { leaseSysNo }
  });
}
/**
 * 租赁合同新增
 */
export function saveLeaseContract(data = {}) {
  return request({
    method: "post",
    url: `/lease/save`,
    data
  });
}
/**
 * 租赁合同修改
 */
export function updateLeaseAgency(data = {}) {
  return request({
    method: "post",
    url: `/lease/update`,
    data
  });
}
/**
 * 查询付款协议列表
 */
export function getLeasePaymentAgreement(data) {
  return request({
    method: "post",
    url: "/lease/payment_agreement/template/get",
    data
  });
}
/**
 * 获取预收预付信息
 */
export function updateLeasePayment(data = {}) {
  return request({
    method: "post",
    url: `/lease/cost_detail/get`,
    data
  });
}
/**
* 变更租赁合同
*/
export function changeLease(data = {}) {
  return request({
    method: "post",
    url: `/lease/change`,
    data
  });
}
/**
 * 租赁合同作废
 */
export function cancelLease(params) {
  return request({
    method: "post",
    url: "/lease/cancel",
    data: params
  });
}

/**
 * 租赁合同删除
 */
export function deleteLease(params) {
  return request({
    method: "post",
    url: "/lease/delete",
    data: params
  });
}
/**
 * 查询出租房间信息
 */
export function getRoom(data = {}) {
  return request({
    method: "post",
    url: `contract/account/findPlan`,
    data
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
    url: "/lease/broker/audit",
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
    url: "/lease/shopowner/audit",
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
    url: "/lease/manager/audit",
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
    url: "/lease/audit",
    data: params
  });
}
/*
* 租户押金分页查询
*/
export function getLeaseDepositPage(params) {
  return request({
    method: "post",
    url: "/lease/deposit/page",
    data: params
  });
}
/*
* 租户押金确认回收
*/
export function entryLeaseDepositPage(params) {
  return request({
    method: "post",
    url: "/lease/deposit/entry",
    data: params
  });
}
/*
* 租户押金店长审核
*/
export function leaseDepositShopowner(params) {
  return request({
    method: "post",
    url: "/lease/deposit/shopowner/audit",
    data: params
  });
}
/*
* 租户押金经理审核
*/
export function leaseDepositManager(params) {
  return request({
    method: "post",
    url: "/lease/deposit/manager/audit",
    data: params
  });
}
/*
* 租户押金财务审核
*/
export function auditLeaseDeposit(params) {
  return request({
    method: "post",
    url: "/lease/deposit/audit",
    data: params
  });
}