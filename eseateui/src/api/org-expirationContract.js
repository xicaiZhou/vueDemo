  import {
    request
  } from '@/common/request.js';
  // 到期合同
  
  /**
   * 分页查询
   */
  export function getExpirationPage(data) {
    return request({
      method: "post",
      url: "/expire/page",
      data
    });
  }
//
  export function getModifye(data) {
    return request({
      method: "post",
      url: "/expire/modify",
      data
    });
  }