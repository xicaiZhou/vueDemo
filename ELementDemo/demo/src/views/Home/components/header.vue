<template>
  <el-header>
    <div class="header-item">
      <el-avatar shape="square" :src="squareUrl"></el-avatar>
    </div>
    <div class="header-item-right">
      <span style="margin-right:10px">王小虎</span>
      <el-button size="small" @click="logout">登出</el-button>
    </div>
  </el-header>
</template>

<script>
export default {
  data() {
    return {
      squareUrl:
        "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3299138037,391931528&fm=26&gp=0.jpg"
    };
  },
  methods:{
    logout() {
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="scss">
.el-header {
  background-color: #1da7d1;
  color: #333;
  line-height: 60px;
  height: 60px;
  width: 100%;
  display: flex;

  .header-item {
    padding: 0 10px;
  }
  .header-item-right {
    margin-left: auto;
    margin-right: 20px;
  }

  .el-avatar {
    margin-top: 10px;
  }
  el-header .item {
    padding: 0 10px;
    text-align: right;
  }
}
</style>