 /* jshint esversion: 6 */
 import {
     request
 } from '@/common/request.js';

 // 获取菜单
 export function AllMenu() {
     return request({
         method: "post",
         url: "/menu/findByUser",
     })
 }
 // 获取角色查菜单
 export function FindByRole(form) {
     return request({
         method: "post",
         url: "/menu/findByRole",
         params: form
     })
 }