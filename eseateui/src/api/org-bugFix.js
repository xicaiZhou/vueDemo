import {
	request
} from '@/common/request.js';
// bug反馈

/**
* 分页查询
*/
export function getIssueFindByPage(params) {
	return request({
		method: "post",
		url: "/issue/findByPage",
		data: params
	});
}
/**
* 保存问题录入
*/
export function issueSaveByPage(params) {
	return request({
		method: "post",
		url: "/issue/save",
		data: params
	});
}
/**
* 更新问题录入
*/
export function issueUpdateByPage(params) {
	return request({
		method: "post",
		url: "/issue/update",
		data: params
	});
}
/**
* 删除问题录入
*/
export function issueRemoveByPage(params) {
	return request({
		method: "post",
		url: "/issue/remove",
		params: params
	});
}
/**
* 根据用户ID查询
*/
export function issueFindByIdByPage(params) {
	return request({
		method: "post",
		url: "/issue/findById",
		data: params
	});
}
