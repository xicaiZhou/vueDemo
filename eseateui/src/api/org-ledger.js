import {
  request
} from '@/common/request.js';

//台账编号
export function getAllContractList(form) {
  return request({
    method: "post",
    url: "/contract/account/find",
    data: form
  });
}
export function getContractList(form) {
  return request({
    method: "post",
    url: "/contract/account/findByPage",
    data: form
  });
}
// 获取详情
export function getContractListById(params) {
  return request({
    method: "get",
    url: `/contract/account/findById`,
    params
  });
}
//删除
export function removeContract(form) {
  return request({
    method: "post",
    url: "/contract/account/remove",
    params: form
  });
}

//新建
export function saveContract(form) {
  return request({
    method: "post",
    url: "/contract/account/save",
    data: form
  });
}
// 编辑
export function updateContract(form) {
  return request({
    method: "post",
    url: "/contract/account/update",
    data: form
  });
}
// 查询房源规划
export function getfindPlan(form) {
  return request({
    method: "post",
    url: "/contract/account/findPlan",
    data: form
  });
}
// 新增房源规划
export function savePlan(form) {
  return request({
    method: "post",
    url: "/contract/account/savePlan",
    data: form
  });
}
// 修改房源规划
export function updatePlan(form) {
  return request({
    method: "post",
    url: "/contract/account/updatePlan",
    data: form
  });
}
// 删除房源规划
export function removePlan(form) {
  return request({
    method: "post",
    url: "/contract/account/removePlan",
    params: form
  });
}
// 查询租金信息
export function findPlanRent(form) {
  return request({
    method: "post",
    url: "/contract/account/findPlanRent",
    params: form
  });
}
// 新增租金信息
export function savePlanRent(form) {
  return request({
    method: "post",
    url: "/contract/account/savePlanRent",
    data: form
  });
}
// 修改租金信息
export function updatePlanRent(form) {
  return request({
    method: "post",
    url: "/contract/account/updatePlanRent",
    data: form
  });
}
// 删除租金信息
export function removePlanRent(form) {
  return request({
    method: "post",
    url: "/contract/account/removePlanRent",
    params: form
  });
}
