<template>
  <div class="mContainer">
    <div class="mtools">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="到期代理合同" name="first">
          <br>
          <agencyContract v-if="activeName=='first'"></agencyContract>
        </el-tab-pane>
        <el-tab-pane label="到期租赁合同" name="second">
          <br>
          <leaseContract v-if="activeName=='second'"></leaseContract>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

import agencyContract from '../../components/agencyContract'
import leaseContract from '../../components/leaseContract'

export default {
  components: {
    agencyContract,
    leaseContract
  },
  data() {
    return {
      activeName: 'first',
    };
  },
  methods: {
    handleClick(tab){
      this.index = tab.index
	  }
  }
};
</script>

<style scoped>
h5{
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
