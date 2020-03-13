<!-- 业绩查询 -->
<template>
	<div class="">
		<!--业绩查询-->
		<div class="table_margin">
			<el-form label-width="90px" size="small" :inline="true">
				<h2>业绩查询</h2>
				<br>
				<el-form-item label="截止日期">
					<el-date-picker
						v-model="endTime"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择日期">
					</el-date-picker>
					<el-button type="primary" @click="handleSearch">查询</el-button>
				</el-form-item >
				<el-form-item label="预计业绩金额"  label-width="146px">
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
				<el-form-item label="业主押金">
					<el-input class="minput" disabled :value="info.agencyDepositAmount"></el-input>
				</el-form-item>
				<el-form-item label="合同收入">
					<el-input class="minput" disabled :value="info.contractIncomeAmount"></el-input>
				</el-form-item>
				<el-form-item label="合同支出">
					<el-input class="minput" disabled :value="info.contractExpenditureAmount"></el-input>
				</el-form-item>
			</el-form>
    </div>
		<!--录入操作-->
		<h2>录入操作</h2>
		<!-- 业绩明细 -->
		<performance-vreakdown ref="vreakdown" :actualDate="endTime" :address="address" :accountNo="accountNo" :prePerformanceAmount="info.prePerformanceAmount"></performance-vreakdown>
		<!--预收明细 -->
    <receipt-detail ref='receipt' :actualDate="endTime" :accountNo="accountNo"></receipt-detail>
		<!-- 预付明细 -->
		<prepayment-detail ref='prepayment' :actualDate="endTime" :accountNo="accountNo"></prepayment-detail>
    <!--合同收入支出明细    -->
    <contractPayment ref='contractPayment' :actualDate="endTime" :accountNo="accountNo"></contractPayment>
		<!-- 实时业绩 -->
		<realtime-performance ref='realtimePerformance' :actualDate="endTime" :accountNo="accountNo"></realtime-performance>
		<!-- 流水明细 -->
		<transaction ref='transaction' :actualDate="endTime" :accountNo="accountNo"></transaction>
		<!-- 业绩核对 -->
		<performance-check ref='performanceCheck' :actualDate="endTime" :accountNo="accountNo"></performance-check>
	</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import moment from 'moment'
import MTable from "@/components/Table";
import PerformanceVreakdown from "./PerformanceVreakdown";
import ReceiptDetail from "./receiptDetail";
import PrepaymentDetail from "./prepaymentDetail";
import ContractPayment from "./contractPayment";
import RealtimePerformance from "./realtimePerformance";
import Transaction from "./transaction";
import PerformanceCheck from "./performanceCheck";
import MCascader from "@/components/department/mcascader";
import Ledger from "@/views/org-agencyContract/ledger";
import { actualPerformance } from "@/api/org-performance";	

export default {
	props: {
		accountNo: {
			type: String || Number,
			default: ''
		},
		address: {
			type: String || Number,
			default: ''
		}
	},
  //import引入的组件需要注入到对象中才能使用
  components: {
		MTable,
		PerformanceVreakdown,
		ReceiptDetail,
		PrepaymentDetail,
		ContractPayment,
		RealtimePerformance,
		Transaction,
		PerformanceCheck,
		Ledger,
		MCascader
  },
  data() {
    //这里存放数据
    return {
			// 截止日期
			endTime: moment().format('YYYY-MM-DD'),
			// 数据
			info: {}
    };
	},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
		handleSearch() {
			const form = {
				accountNo: this.accountNo,
				actualDate: this.endTime,
        recoverStatus: ''
			}
			actualPerformance(form).then(res => {
				console.log(res)
				if (res.code == 1000) {
					this.info = res.body || {}
				}
			}).catch(err => {
				console.error(err)
			})
			this.$refs.vreakdown.initData()
			this.$refs.receipt.getData(this.endTime)
			this.$refs.prepayment.getData(this.endTime)
			this.$refs.contractPayment.getData(this.endTime)
			this.$refs.realtimePerformance.getData(this.endTime)
			this.$refs.transaction.getData(this.endTime)
			this.$refs.performanceCheck.getData(this.endTime)
		}
	},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
		this.$nextTick(() => {
			this.handleSearch();
		})
	},
};
</script>
<style>
.mContainer .el-table__body tr.current-row > td {
  background-color: #ffec8b !important;
}
.redItem .el-form-item__label {
	color: indianred;
}
</style>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.table_margin{
	margin: 20px 0;
}
</style>