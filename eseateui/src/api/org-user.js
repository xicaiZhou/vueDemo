 /* jshint esversion: 6 */
 import {
		request
 } from '@/common/request.js';

 // 登录
 export function login(form) {
	return request({
		method: "post",
		url: "/user/login",
		data: form
	});
 }

 // 员工分页查询
 export function page(form) {
	return request({
		method: "post",
		url: "/user/page",
		data: form
	});
 }
 // 根据名字查找用户
 export function FindByName(form) {
	return request({
		method: "post",
		url: "/user/findUserByName",
		params: form
	});
 }
 // 修改用户
 export function EditUserInfo(form) {
	return request({
		method: "post",
		url: "/user/modifyUserInfo",
		data: form
	});
 }
 // 新增用户
 export function AddUserInfo(form) {
	return request({
		method: "post",
		url: "/user/register",
		data: form
	});
 }
 // 新增用户
 export function DeleteUserInfo(form) {
	return request({
		method: "post",
		url: "/user/deleteUser",
		data: form
	});
 }
 // 修改用户密码
 export function EditUserPwd(form) {
	return request({
		method: "post",
		url: "/user/modifyPwd",
		data: form
	});
 }

 // 获取员工信息
 export function GetUserInfo(form) {
	return request({
		method: "post",
		url: "/user/getUserInfo",
		data: form
	});
 }