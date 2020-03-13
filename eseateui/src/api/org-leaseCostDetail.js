import {
	request
} from '@/common/request.js';
// 预付房租

/**
* 分页查询
*/
export function getLeaseCostByPage(params) {
	return request({
		method: "post",
		url: "/lease/cost_detail/page",
		data: params
	});
}
/**
* 根据ID查询
*/
export function getCostDetailFindById(id) {
  return request({
    method: "get",
    url: `/lease/cost_detail/findById`,
    params: { id }
  });
}
/**
 * 新增备注
 */
export function remarkSave(params) {
	return request({
		method: "post",
		url: "/lease/cost_detail/remark/save",
		data: params
	});
}
/**
 * 更新备注
 */
export function remarkUpdate(params) {
	return request({
		method: "post",
		url: "/lease/cost_detail/remark/update",
		data: params
	});
}
/**
* 根据leaseCostDetailId查询
*/
export function remarkListById(leaseCostDetailId) {
  return request({
    method: "get",
    url: `/lease/cost_detail/remark/list`,
    params: { leaseCostDetailId }
  });
}
/**
* 根据id删除
*/
export function remarkDeleteById(id) {
  return request({
    method: "get",
    url: `/lease/cost_detail/remark/delete`,
    params: { id }
  });
}
/**
* 确认收款
*/
export function payConfirm(params) {
	return request({
		method: "post",
		url: "/lease/cost_detail/collect/confirm",
		data: params
	});
}
/**
* 预收作废
*/
export function abolition(params) {
	return request({
		method: "post",
		url: "/lease/cost_detail/abolition",
		data: params
	});
}