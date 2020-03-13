<template>
  <div class="mContainer">
    <div class="mtools">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="流水明细" name="first">
          <br>
          <pipelineDetails v-if="activeName=='first'"></pipelineDetails>
        </el-tab-pane>
        <el-tab-pane label="流水盘点" name="second">
          <br>
          <pipelineManager v-if="activeName=='second'"></pipelineManager>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>

import pipelineDetails from "@/components/pipelineDetails";
import pipelineManager from "@/components/pipelineManager";

export default {
  components: {
    pipelineDetails,
    pipelineManager
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
