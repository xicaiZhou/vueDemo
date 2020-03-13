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
      <el-form-item class="item" style="margin-top:60px" prop="name">
        <el-input
          ref="name"
          prefix-icon="el-icon-user-solid"
          placeholder="请输入登录名或手机号"
          v-model="loginForm.name"
          tabindex="1"
          auto-complete="on"
          @keyup.enter.native="submit"
        ></el-input>
      </el-form-item>
      <el-form-item class="item" style="margin-top:30px" prop="password">
        <el-input
          ref="password"
          prefix-icon="el-icon-lock"
          placeholder="请输入密码"
          v-model="loginForm.password"
          tabindex="2"
          auto-complete="on"
          :type="isShowPassword === true ? 'password' : 'text'"
          @keyup.enter.native="submit"
        >
          <img
            class="item_img"
            v-if="isShowPassword"
            slot="suffix"
            src="../../assets/biyan.png"
            @click="isShowPassword = !isShowPassword"
          />
          <img
            class="item_img"
            v-if="!isShowPassword"
            slot="suffix"
            src="../../assets/zhengyan.png"
            @click="isShowPassword = !isShowPassword"
          />
        </el-input>
      </el-form-item>
      <el-button
        type="primary"
        style="width:300px; margin-top:50px"
        @click.native.prevent="submit"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShowPassword: true,
      pwdType: "password",
      loginForm: {
        name: "",
        password: ""
      },
      loginRules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 18, message: "长度在 4 到 18 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 18, message: "长度在 4 到 18 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          console.log(this.loginForm);
          // login(this.loginForm).then(data => {
          //   // save userinfo to store
          //   this.$store.commit('userinfo', data.body)
          this.$router.push("/");

          // })
        }
      });
    }
  }
};
</script>

<style lang="scss">
.login-container {
  background-color: #1da7d1;
  height: 100vh;
  .item_img {
    margin-top: 11px;
    width: 20px;
    margin-right: 5px;
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
}
</style>