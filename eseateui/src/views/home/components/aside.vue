<template>
  <div class="base-aside">
    <el-menu
      :router="true"
      class="el-menu-vertical-demo"
      :default-active="defaultPath"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <template v-for="item in menuList">
        <el-submenu v-if="item.child" :index="item.url">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <template v-for="twoMenu in item.child">
            <template v-if="twoMenu.child">
              <el-submenu :index="twoMenu.url">
                <template slot="title">
                  <i :class="twoMenu.icon"></i>
                  <span>{{twoMenu.name}}</span>
                </template>
                <el-menu-item
                  v-for="threeMenu in twoMenu.child"
                  :key="threeMenu.id"
                  :index="threeMenu.url"
                >{{threeMenu.name}}</el-menu-item>
              </el-submenu>
            </template>
            <el-menu-item v-else :index="twoMenu.url">
              <i :class="twoMenu.icon"></i>
              <span slot="title">{{twoMenu.name}}</span>
            </el-menu-item>
          </template>
        </el-submenu>
        <el-menu-item v-else :index="item.url">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script >
import { AllMenu } from '@/api/org-menu'
export default {
  name: 'BaseAside',
  data() {
    return {
      menuData: {},
      menuList: []
    }
  },
  mounted() {
    this.getAllMenu()
  },
  computed: {
    defaultPath: function() {
      return this.$route.path.split('#')[0]
    }
  },
  methods: {
    getAllMenu() {
      AllMenu()
        .then(res => {
          if (res && res.body && res.body.length > 0) {
            this.menuList = res.body
          }
        })
        .catch(e => {
          console.log(e)
        })
    }
  }
}
</script>

<style lang="scss">
.base-aside {
  margin: 2px 2px 0 2px;
  width: 100%;
  height: calc(100vh - 65px);
  background: #545c64;
}
.el-submenu__title {
  font-size: 18px !important
}
</style>
