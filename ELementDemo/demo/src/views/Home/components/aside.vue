<template>
  <div class="menu">
    <el-menu
      :router="true"
      :default-active="defaultPath"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <template v-for="item in allMenu">
        <el-submenu v-if="item.child" :index="item.url" :key="item.id">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{item.title}}</span>
          </template>
          <template v-for="child in item.child">
            <el-menu-item :index="child.url" :key="child.id">
              <span>{{child.title}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      allMenu: [
        {
          id: 11000,
          title: "首页",
          url: "模块一",
          child: [
            { id: 11001, title: "主页", url: "container" },
            { id: 11002, title: "1-1", url: "child1" }
          ]
        },
        {
          id: 12000,
          title: "模块二",
          url: "模块二",
          child: [{ id: 11002, title: "1-2", url: "child2" }]
        }
      ]
    };
  },
  methods: {},
  computed: {
    defaultPath: function() {
      console.log(this.$route.path.split("#")[0])
      return this.$route.path.split("#")[0];
    }
  }
};
</script>

<style>
.menu{
  width: 101%;
}

</style>