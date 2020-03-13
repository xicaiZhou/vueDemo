<!--合同收入支出明细 实时业绩 流水明细 业绩核对 -->
<template>
  <div class>
    <!--合同收入支出明细-->
		<h3>合同收入支出明细</h3>
    <div class="table_margin">
      <el-form label-width="90px" size="small" :inline="true">
        <el-form-item label="类别" label-width="50px">
          <el-radio-group v-model="type">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="2">收入</el-radio>
            <el-radio :label="1">支出</el-radio>
          </el-radio-group>
        </el-form-item>
				<el-button type="primary" size="mini" @click="handleClickSearch">查询</el-button>
        <el-form-item label="收入金额" >
          <el-input class="minput" disabled  :value="info.incomeAmount" label-width="80px"></el-input>
        </el-form-item>
        <el-form-item label="支出金额">
          <el-input class="minput" disabled  :value="info.expenditureAmount" label-width="80px"></el-input>
        </el-form-item>
      </el-form>
      <m-table
        :hasIndex="true"
        :data="list"
        :setting="setting"
        :loading="loading"
        :hasPagination="false"
      ></m-table>
    </div>
  </div>
</template>
<script>
import MTable from "@/components/Table";
import { contractPayment } from "@/api/org-performance";

const TYPE = {
  1: "现金",
  2: "转账",
  3: "POS机",
  4: "微信",
  5: "支付宝",
  99: "其他"
}
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
      info: {},
      setting: [
        {
          label: "创建日期",
          value: "createTime"
        },
        {
          label: "类别",
          value: "budgetType"
        },
        {
          label: "金额",
          value: "totalFee"
        },
        {
          label: "操作人",
          value: "createUser"
        },
        {
          label: "收款方式",
          value: "type",
          formatter(row, column, cellValue, index) {
            return TYPE[row.type]
          }
        },
        {
          label: "凭证编号",
          value: "confirmNo"
        },
        {
          label: "备注",
          value: "description"
        }
      ],
      // 合同类型
      type: 0
    };
  },
  computed: {
    list() {
      return this.info.contractCostDetailFindVOS || []
    }
  },
  methods: {
    getData(endTime = '') {
      const form = {
        actualDate: endTime,
        accountNo: this.accountNo,
        type: this.type
      }
      console.log(JSON.stringify(form))
      contractPayment(form).then(res => {
        console.log('contractPayment...', res)
        if (res.code == 1000) {
          const map = {'': '全部', }
          res.body.contractCostDetailFindVOS.forEach(d => {
            d.actualDate = this.actualDate
          })
          this.info = res.body
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