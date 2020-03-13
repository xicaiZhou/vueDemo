<template>
  <el-header>
    <div class="item">
      <el-avatar shape="square" :src="squareUrl"></el-avatar>
    </div>
    <div class="item">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px; "></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>查看</el-dropdown-item>
          <el-dropdown-item>新增</el-dropdown-item>
          <el-dropdown-item>删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>王小虎</span>
    </div>
  </el-header>
</template>

<script>
export default {
  data() {
    return {
      squareUrl: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3299138037,391931528&fm=26&gp=0.jpg"
    };
  }
};
</script>

<style>
.el-header {
  background-color: #1da7d1;
  color: #333;
  line-height: 60px;
  height: 60px;
  display: flex;
  justify-content: flex-end;
}
.el-avatar {
  margin-top: 10px;
}
.item {
  padding: 0 10px;
  text-align: right;
}
</style>