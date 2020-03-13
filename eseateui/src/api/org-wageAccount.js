import {
	request
} from '@/common/request.js';
// 代理合同

/**
 * 分页查询
 */
export function getWageAccountByPage(params) {
	return request({
		method: "post",
		url: "/wage_account/page",
		data: params
	});
}


/**
 * 刷新业绩
 */
export function wageAccountPerformance(params) {
	return request({
		method: "post",
		url: "/wage_account/refresh/performance",
		data: params
	});
}


/**
 * 修改
 */
export function wageAccountUpdate(params) {
	return request({
		method: "post",
		url: "/wage_account/update",
		data: params
	});
}


/**
 * 发放
 */
export function wageAccountGrant(params) {
	return request({
		method: "post",
		url: "/wage_account/grant",
		data: params
	});
}