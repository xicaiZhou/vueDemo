<template>
  <div>
    <!--实时业绩-->
    <div class="table_margin">
      <el-form label-width="80px" size="small" :inline="true">
        <el-form-item label="实时业绩" label-width="70px" class="blackItem">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
        <el-form-item label="实时业绩" label-width="146px">
          <el-input class="minput" disabled :value="info.prePerformanceAmount"></el-input>
        </el-form-item>
				<br>
        <el-form-item label="预收已收">
          <el-input class="minput" disabled :value="info.leaseCostDetailAmount"></el-input>
        </el-form-item>
        <el-form-item label="预收未收">
          <el-input class="minput" disabled :value="info.leaseCostDetailNoAmount"></el-input>
        </el-form-item>
        <el-form-item label="预付已付">
          <el-input class="minput" disabled :value="info.agencyCostDetailAmount"></el-input>
        </el-form-item>
        <el-form-item label="预付未付">
          <el-input class="minput" disabled :value="info.agencyCostDetailNoAmount"></el-input>
        </el-form-item>
				<br>
        <el-form-item label="业主押金">
          <el-input class="minput" disabled :value="info.agencyDepositAmount"></el-input>
        </el-form-item>
        <el-form-item label="合同支出">
          <el-input class="minput" disabled :value="info.contractExpenditureAmount"></el-input>
        </el-form-item>
        <el-form-item label="合同收入">
          <el-input class="minput" disabled :value="info.contractIncomeAmount"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import MTable from "@/components/Table";
import { realTime } from "@/api/org-performance";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    MTable
  },
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
      loading: false,
      info: {}
    };
  },
  //方法集合
  methods: {
    getData() {
      const form = {
        //actualDate: this.actualDate,
        accountNo: this.accountNo
      }
      realTime(form).then(res => {
        console.log('realTime', res)
        if (res.code == 1000) {
          this.info = res.body
        }
      }).catch(err => {
        console.error(err)
      })
    }
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
.table_margin{
	margin: 20px 0;
}
</style>

