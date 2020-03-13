import Vue from 'vue'
import Router from 'vue-router'
import child1 from '../views/child1/index.vue'
import child2 from '../views/child2/index.vue'
import index from '../views/Home/index.vue'
import login from '../views/login/index.vue'
import container from '../views/container.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/',
      name: 'index',
      component: index,
      redirect:'/container',
      children: [{
        path: '/child1',
        name: 'child1',
        component: child1
      },{
        path: '/child2',
        name: 'child2',
        component: child2
      },{
        path: '/container',
        name: 'container',
        component: container
      }
    ]
    }
  ]
})
