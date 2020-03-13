<template>
  <div>
    <h3>预付明细</h3>
			<div class="table_margin">
			<el-form label-width="90px" size="small" :inline="true">
				<el-form-item label="状态 " label-width="50px">
					<el-radio-group v-model="recoverStatus">
						<el-radio label="">全部</el-radio>
						<el-radio label="1">已付</el-radio>
						<el-radio label="0">未付</el-radio>
					</el-radio-group>
				</el-form-item >
				<el-button type="primary" size="mini" @click="handleClickSearch">查询</el-button>
				<el-form-item label="已付合计金额" label-width="120px">
					<el-input class="minput" disabled :value="info.amount || 0" label-width="100px"></el-input>
				</el-form-item>
				<el-form-item label="未付合计金额" label-width="120px">
					<el-input class="minput" disabled :value="info.newOldPerformanceAmount || 0" label-width="100px"></el-input>
				</el-form-item>
			</el-form>
			<m-table
			:hasIndex="true"
			:data="list"
			:setting="setting"
			:loading="loading"
			:hasPagination="false">
			</m-table>
    </div>
  </div>
</template>
<script>
import MTable from "@/components/Table";
import { prepaymentDetail } from "@/api/org-performance";
export default {
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
			recoverStatus: '',
      setting: [
				{
					label: "房租日期",
					value: "",
					formatter(row, column, cellValue, index) {
						return `${row.startTime}-${row.endTime}`;
					}   
				},
				{
					label: "合同编号",
					value: "agencyNo"
				},
				{
					label: "合同状态",
					value: "agencyStatus",
					formatter(row, column, cellValue, index) {
						return cellValue == 0 ? '作废' : '有效';
					}   
				},
				{
					label: "预付状态",
					value: "isAbolition",
					formatter(row, column, cellValue, index) {
						return cellValue == 0 ? '作废' : '有效';
					}   
				},
				{
					label: "预付金额",
					value: "prepaidAmount"
				},{
					label: "实付金额",
					value: "acturalAmount"
				},
				{
					label: "截止金额",
					value: "endAmount"
				},{
					label: "经纪人",
					value: "masterBroker"
				},
				{
					label: "预付日期",
					value: "prepaidDate"
				},
				{
					label: "分类",
					value: "classification"
				},
				{
					label: "实付日期",
					value: "acturalDate"
				},{
					label: "状态",
					value: "status",
					formatter(row, column, cellValue, index) {
						return cellValue == 1 ? "已付款" : "未付款";
					}
				},{
					label: "凭证编号",
					value: "confirmNo"
				},
			]
    };
  },
  methods: {
    getData(endTime = '') {
      const form = {
        actualDate: endTime,
        accountNo: this.accountNo,
        recoverStatus: this.recoverStatus
      }
      prepaymentDetail(form).then(res => {
        console.log('prepaymentDetail------', res)
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
  },
  computed: {
    list() {
      return this.info.agencyCostDetailFindVOS || []
    }
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.table_margin{
	margin: 20px 0;
}
</style>

