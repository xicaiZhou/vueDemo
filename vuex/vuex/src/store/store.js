import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    userList: [
      {name:'老鸡巴丁', age:30},
      {name:'老鸡巴唐', age:20}]
  },
  getters: {
    getAge(state){
      var list = state.userList.map(user => {
        return {
          name: user.name,
          age: user.age / 2
        }
      })
      return list
    }
  },
  mutations:{
    changeName: state => {
      state.userList.forEach(user => {
        user.name = '***' + user.name
      });
    }
  }
})
