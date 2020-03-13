<template>
  <div class="hello">
    <h4>人员列表 store-state存放数据</h4>
    <ul >
      <li v-for = "user in userList">
        <span>{{ user.name }}</span>
        <span>{{ user.age }}</span>
      </li>
    </ul>
      <h4>派生人员列表 不会修改stroe数据</h4> 
    <ul >
      <li v-for = "user in ageChange">
        <span>{{ user.name }}</span>
        <span>{{ user.age }}</span>
      </li>
    </ul>

    <h4>store-getter人员列表 不会修改stroe数据 getter获取数据</h4>
    <ul >
      <li v-for = "user in getAge">
        <span>{{ user.name }}</span>
        <span>{{ user.age }}</span>
      </li>
    </ul>
      <h4>store-mutation 人员列表 mutation改变数据，mutaion更显事件注册，通过commot触发事件</h4>
      <button @click="agechange">age减少</button>

  </div>

</template>
 
<script>
export default {
  
  computed:{  
    userList(){
      return this.$store.state.userList
    },
    ageChange(){
      var list = this.$store.state.userList.map(user => {
        return {
          name: user.name,
          age: user.age - 1
        }
      })
      return list
    },
    getAge(){
      return this.$store.getters.getAge
    }
  },
  data () {
    return {
      
    }
  },
  methods:{
    agechange(){
      this.$store.commit('changeName')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
button {
  background: #000;
  color: #fff;
}
</style>
