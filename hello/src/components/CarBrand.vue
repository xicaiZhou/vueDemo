<template>
<div>
    <van-nav-bar
  title="车辆品牌"
  left-text="返回"
  right-text="选择"
  left-arrow
  @click-left="onClickLeft"
  @click-right="onClickRight"
/>
<span>{{ text }}</span>
</div>

</template>

<script>
export default {
  name: 'CarBrand',
  data () {
    return {
      number: 123,
      text: ''
    }
  },
  created () {
    this.showmsg()
  },
  methods: {
    onClickLeft () {
      this.$router.push({
        path: '/',
        query: {
          number: 123
        }
      })
    },
    onClickRight () {

    },
    showmsg () {
      this.text = this.$route.params.msg
    }
  }
//   beforeRouteLeave (to, from, next) {
//     // 设置下一个路由的 meta
//     next()
//   }
}
</script>

<style>

</style>
