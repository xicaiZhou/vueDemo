import {
    request
  } from '@/common/request.js';
  // 预付房租
  
/**
 * 分页查询
 */
export function getAgencyCostByPage(params) {
	return request({
		method: "post",
		url: "/agency/cost_detail/page",
		data: params
	});
}
/**
 * 确认收款
 */
export function payConfirm(params) {
	return request({
		method: "post",
		url: "/agency/cost_detail/pay/confirm",
		data: params
	});
}
/**
 * 新增备注
 */
export function remarkSave(params) {
	return request({
		method: "post",
		url: "/agency/cost_detail/remark/save",
		data: params
	});
}
/**
 * 更新备注
 */
export function remarkUpdate(params) {
	return request({
		method: "post",
		url: "/agency/cost_detail/remark/update",
		data: params
	});
}
/**
* 根据agencyCostDetailId查询
*/
export function remarkListById(agencyCostDetailId) {
  return request({
    method: "get",
    url: `/agency/cost_detail/remark/list`,
    params: { agencyCostDetailId }
  });
}
/**
* 根据agencyCostDetailId删除
*/
export function remarkDeleteById(id) {
  return request({
    method: "get",
    url: `/agency/cost_detail/remark/delete`,
    params: { id }
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
		url: "/agency/cost_detail/broker/audit",
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
		url: "/agency/cost_detail/shopowner/audit",
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
		url: "agency/cost_detail/manager/audit",
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
		url: "agency/cost_detail/audit",
		data: params
	});
}

/**
* 预付作废
*/
export function abolition(params) {
	return request({
		method: "post",
		url: "/agency/cost_detail/abolition",
		data: params
	});
}
  