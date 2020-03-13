import {
    request
  } from '@/common/request.js';
  // 实际业绩
  
/**
 * 分页查询
 */
export function getActualPerformanceByPage(params) {
	return request({
		method: "post",
		url: "/performance/actual/page",
		data: params
	});
}

/**
 * 新增业绩
 */
export function saveActualPerformance(params) {
	return request({
		method: "post",
		url: "/performance/actual/save",
		data: params
	});
}

/**
 * 修改业绩
 */
export function updateActualPerformance(params) {
	return request({
		method: "post",
		url: "/performance/actual/update",
		data: params
	});
}

/**
 * 删除业绩
 */
export function removeActualPerformance(form) {
	return request({
		method: "post",
		url: "/performance/actual/remove",
		params: form
	});
}

/**
 * 根据ID查询
 */
export function actualPerformanceFindbyId(id) {
	return request({
    method: "get",
    url: `/performance/actual/id`,
    params: { id }
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
    url: "/performance/actual/shopowner/audit",
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
    url: "/performance/actual/audit",
    data: params
  });
}

/*
* 业绩核算使用--查询录入业绩
*/
export function getActual(params) {
  return request({
    method: "post",
    url: "/performance/actual/get",
    data: params
  });
}
