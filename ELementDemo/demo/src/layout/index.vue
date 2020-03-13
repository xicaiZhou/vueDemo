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
     padding: 5px;
     background-color: fff;
  }
  .el-aside {
    width: 230px !important;
  }

  .el-footer {
    height: 30px !important;
  }
}
</style>