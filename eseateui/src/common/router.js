import Vue from 'vue';
import VueRouter from 'vue-router'
import routes from '@/route/index'
import store from './store'

Vue.use(VueRouter)

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    document.title = '天宇管理系统'
    if (store.getters.token || to.path == '/login') {
        next();
    } else {
        next('/login')
    }
});

export default router