<template>
  <!--业绩核对-->
  <div class="table_margin">
    <el-form label-width="90px" size="small" :inline="true">
    <el-form-item label="业绩核对" label-width="70px" class="blackItem">
        <el-button type="primary" @click="handleClickSearch">查询</el-button>
    </el-form-item>
    <el-form-item label="流水明细金额" label-width="96px">
        <el-input class="minput" disabled :value="info.flowCostDetailAmount || 0" ></el-input>
    </el-form-item>
    <el-form-item label="实时业绩金额" label-width="96px">
        <el-input class="minput" disabled :value="info.prePerformanceAmount || 0" ></el-input>
    </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getCheck } from "@/api/org-performance";
export default {
  props: {
    accountNo: {
      type: String,
      default: ''
		},
		actualDate: {
			type: String,
      default: ''
		}
  },
  data() {
    //这里存放数据
    return {
      info: {}
    };
  },
  //方法集合
  methods: {
     getData(endTime = '') {
      const form = {
        actualDate: endTime,
        accountNo: this.accountNo,
        recoverStatus: this.recoverStatus
      }
      getCheck(form).then(res => {
        if (res.code == 1000) {
          this.info = res.body || []
        }
      }).catch(err => {
        console.error(err)
      })
    },
    handleClickSearch() {
      this.getData(this.actualDate)
    }
  }
};
</script>
<style>
.blackItem .el-form-item__label {
	color: black;
	font-weight: bold
}
</style>
<style lang='scss' scoped>
.table_margin {
  margin: 20px 0;
}
</style>
