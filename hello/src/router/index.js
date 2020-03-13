import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import CarBrand from '@/components/CarBrand'
import CarSeries from '@/components/CarSeries'
// import store from '../common/store'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        keepAlive: true // 需要被缓存的组件
      }
    },
    {
      path: '/CarBrand',
      name: 'CarBrand',
      component: CarBrand,
      meta: {
        keepAlive: false // 不需要被缓存的组件
      }
    },
    {
      path: '/CarSeries',
      name: 'CarSeries',
      component: CarSeries,
      meta: {
        keepAlive: false // 不需要被缓存的组件
      }
    }
  ]
})
