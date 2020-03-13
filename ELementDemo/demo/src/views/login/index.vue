<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">管理系统</h3>
      </div>

      <el-form-item class="item" style="margin-top:60px">
        <el-input></el-input>
      </el-form-item>
      <el-form-item class="item" style="margin-top:30px">
        <el-input></el-input>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:300px; margin-top:50px"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {};
</script>

<style>
.login-container {
  background-color: #1da7d1;
  height: 100vh;
}
.title-container {
  padding-top: 100px;
}
.title {
  font-size: 26px;
  color: #fff;
}
.item {
  margin: 0 auto;
  width: 280px;
}
</style>