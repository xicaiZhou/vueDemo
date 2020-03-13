<template>
  <div>
    <el-container>
      <el-header>
        <slot name="header"></slot>
      </el-header>
      <el-container>
        <el-aside>
          <slot name="aside"></slot>
        </el-aside>
        <el-container>
          <el-main>
            <slot name="main"></slot>
          </el-main>

        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss">
.el-container {
  margin: 0;
  padding: 0;

  .el-header {
    padding: 0;
  }
  .el-main {
     padding: 10px;
     border: 10px solid #E6E6E6;
  }
  .el-aside {
    width: 230px !important;
    background-color: #545c64;
  }

  .el-footer {
    height: 30px !important;
  }
}
</style>