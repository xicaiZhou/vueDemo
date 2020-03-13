<template>
  <div>
    <van-nav-bar
      title="车系"
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
  name: 'CarSeries',
  data () {
    return {
      text: '车系'
    }
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
    onClickRight () {}
  }
}
</script>

<style>
</style>
