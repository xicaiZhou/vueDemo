<template>
  <div class="house_regis">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 1、选择台账 -->
      <el-tab-pane label="选择台账" name="first">
        <MLedger ref="ledger" v-show="activeName=='first'" @changChoose="changChooseLedger"></MLedger>
      </el-tab-pane>
      <!-- 2、业绩核算 -->
      <el-tab-pane label="业绩核算" name="second" :disabled="isTabDisabled">
        <Mperformance v-if="activeName=='second'" :ledger="ledger"></Mperformance>
      </el-tab-pane>
      <!-- 3、代理合同 -->
      <el-tab-pane label="代理合同" name="third" :disabled="isTabDisabled">
        <MagencyContract v-if="activeName=='third'" :ledgerId="ledgerId"></MagencyContract>
      </el-tab-pane>
      <!-- 4、租赁合同 -->
      <el-tab-pane label="租赁合同" name="fourth" :disabled="isTabDisabled">
        <MleaseContract v-if="activeName=='fourth'" :ledgerId="ledgerId"></MleaseContract>
      </el-tab-pane>
      <!-- 5、房源规划 -->
      <el-tab-pane label="房源规划" name="fifth">
        <MhouseManager v-if="activeName=='fifth'"></MhouseManager>
			</el-tab-pane>
      <!-- 6、水电表设置 -->
      <el-tab-pane label="水电表设置" name="sixth">
        <MUtilityBillManage v-if="activeName=='sixth'"></MUtilityBillManage>
			</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import MLedger from "./ledger";// 选择台账
import Mperformance from "./performance";// 业绩核算
import MagencyContract from "./agencyContract";// 代理合同
import MleaseContract from "./leaseContract";// 租赁合同
import MhouseManager from '../../components/houseManage'// 房源规划
import MUtilityBillManage from '../UtilityBillManage'// 水电表设置
// import MhouseQuery from '../../components/houseQuery'// 房源查询

export default {
  components: {
    MLedger,
    Mperformance,
    MagencyContract,
    MleaseContract,
    MhouseManager,
    // MhouseQuery
  },
  data() {
    return {
      activeName: "first",
      isTabDisabled: true
    };
  },
  methods: {
    handleClick(tab) {
      this.index = tab.index;
    },
    changChooseLedger(data = {}) {
      if (data.accountNo) {
        this.isTabDisabled = data.accountNo ? false : true
      }
    }
  },
  created() {},
  computed: {
    ledgerId() {
      const ledger = this.$refs.ledger.chooseLedger
      return ledger.accountNo
    },
    ledger() {
      return this.$refs.ledger.chooseLedger
    }
  }
};
</script>

<style lang='scss' scoped>
.el-button-group {
  margin-left: 5px;
}
.el-input {
  width: 300px;
}

.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  text-align: center;
  padding-bottom: 20px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #67c23a;
  line-height: 36px;
  text-align: center;
  color: #ffffff;
  font-size: 18px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.oper-grid {
  padding-top: 20px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>