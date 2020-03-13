<template>
  <div class="base-header">
    <el-row :gutter="24">
      <el-col :span="12">
        <div @click="home">
          <el-image class="logo" :src="logo"></el-image>
          <span class="title">天宇后台管理系统</span>
        </div>
      </el-col>
      <el-col :span="12" class="loginSign">
        <div class="flex-end">
          <el-button @click.native="logout" size="small" round type="success" icon="el-icon-s-tools">退出登录</el-button>
          <!-- <el-dropdown> -->
            <!-- <span class="el-dropdown-link">
              <el-avatar :size="50" :src="defaultAvatar"></el-avatar>
            </span> -->
            <!-- <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
        <span class="el-dropdown-link loginUser">欢迎您 {{roleNames}}&{{username}} 用户</span>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'BaseHeader',
  data() {
    return {
      roleNames: '',
      username:'',
      logo: 'https://cn.vuejs.org/images/logo.png',
      defaultAvatar:
        'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    }
  },
  methods: {
    home() {
      // this.$router.push('/')
      console.info('go home')
    },
    logout() {
      this.$confirm('确认退出此次登录？')
        .then(_ => {
          this.$store.commit('logout')
          this.$router.push('/login')
        })
        .catch(_ => {});
    }
  },
  created(){
    this.username = JSON.parse(localStorage.getItem("userinfo")).username
    let roleses = JSON.parse(localStorage.getItem("userinfo")).permissions.roleNames
    this.roleNames = roleses.join('/')
  }
}
</script>
<style lang="scss">
.base-header {
  margin: 0px;
  padding: 5px 10px 5px 10px;
  height: 100%;
  background: white;
  .logo {
    width: 35px;
    vertical-align: middle;
  }
  .title {
    font-size: 28px;
    text-align: left;
    vertical-align: middle;
  }
  .loginSign{
    display: flex;
    flex-direction: row-reverse;
    .loginUser{
      font-weight: bold;
      line-height: 50px;
      font-size: 16px;
      margin-right: 20px;
    }
  }
}
</style>

