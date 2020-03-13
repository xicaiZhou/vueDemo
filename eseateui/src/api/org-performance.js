
import {
  request
} from '@/common/request.js';

// 业主、租户押金(已退/未退)列表
export const actualDeposits = (form = {}) => {
  return request({
    method: "post",
    url: "/performance/actual/deposits",
    data: form
  })
}
// 业绩查询
export const actualPerformance = (form = {}) => {
  return request({
    method: "post",
    url: "/performance/actual/find/performance",
    data: form
  })
}
// 查询录入业绩
export const actualGet = (form = {}) => {
  return request({
    method: "post",
    url: "/performance/actual/get",
    data: form
  })
}
// 预收明细查询
export const receiptDetail = (form = {}) => {
  return request({
    method: "post",
    url: "/performance/actual/find/lease/cost/detail",
    data: form
  })
}
// 预付明细查询
export const prepaymentDetail = (form = {}) => {
  return request({
    method: "post",
    url: "/performance/actual/find/agency/cost/detail",
    data: form
  })
}
// 合同收入支出明细查询
export const contractPayment = (form = {}) => {
  return request({
    method: "post",
    url: "/performance/actual/find/contract/cost/detail",
    data: form
  })
}
// 流水明细查询
export const transaction = (form = {}) => {
  return request({
    method: "post",
    url: "/performance/actual/find/flow/cost/detail",
    data: form
  })
}
// 实时业绩查询
export const realTime = (form = {}) => {
  return request({
    method: "post",
    url: "/performance/actual/find/performance/real_time",
    data: form
  })
}

// 业绩核对
export const getCheck = (form = {}) => {
  return request({
    method: "post",
    url: "/performance/actual/check",
    data: form
  })
}








