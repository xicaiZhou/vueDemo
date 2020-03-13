/*
 * utils.js
 * 工具类js
 */
/* jshint esversion: 6 */
import axios from 'axios'

const request = axios.create({})

// console.log(process)
// eslint-disable-next-line no-unused-vars
/* global config */
// request.defaults.baseURL = 'http://api.avatardata.cn/Joke/QueryJokeByTime?key=8a090c82e9c14648a36d7d0b0e90a7a6&page=2&rows=10&sort=asc&time=1418745237'
request.defaults.baseURL = ''
request.defaults.headers.post['Content-Type'] = 'application/json'
request.defaults.headers['Access-Control-Allow-Origin'] = '*'
request.defaults.timeout = 30000
request.defaults.withCredentials = true

// 拦截器
request.interceptors.request.use(
  config => {
    // if (config.hasLoad) {
    //   var load = document.createElement('div')
    //   load.className = 'loading flex-center'
    //   load.id = 'loading'
    //   load.innerText = 'loading ...'
    //   document.body.appendChild(load)
    // }
    // config.headers['token'] = localStorage.getItem('token')

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(

  response => {
    let load = document.getElementById('loading')
    if (load) {
      document.body.removeChild(load)
    }

    const res = response.data
    // if (res.code === '1000') {
    return res
    // }

    // 1003 illegal request
    // if (res.code === '1003') {
    //   router.push('/login')
    // }

    // return Promise.reject(new Error(res.msg || 'Error'))
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 302:
          error.message = '未授权，请重新登录'
          break
        case 400:
          error.message = '错误请求'
          break
        case 401:
          error.message = '未授权，请重新登录'
          break
        case 403:
          error.message = '未授权，拒绝访问'
          break
        case 404:
          error.message = '请求错误，未找到该资源'
          break
        case 405:
          error.message = '请求方法未允许'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器出错'
          break
        case 501:
          error.message = '网络未实现'
          break
        case 502:
          error.message = '网络错误,服务更新中...'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网络超时'
          break
        case 505:
          error.message = 'http版本不支持该请求'
          break
        default:
          error.message = `连接错误${error.response.status}`
          break
      }
    } else { // 跨域获取不到状态码或者其他状态码进行的处理
      error.message = '遇到点问题，请尝试重新登录'
    }
    return Promise.resolve(error)
  }
)

export {
  request
}
