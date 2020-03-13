<!--预收明细 预付明细 -->
<template>
	<div class="table_margin">
		<h3>预收明细</h3>
		<div class="table_margin">
			<el-form label-width="50px" size="small" :inline="true">
				<el-form-item label="状态 ">
					<el-radio-group v-model="recoverStatus">
						<el-radio label="">全部</el-radio>
						<el-radio label="1">已收</el-radio>
						<el-radio label="0">未收</el-radio>
					</el-radio-group>
				</el-form-item >
				<el-button type="primary" size="mini" @click="handleClickSearch">查询</el-button>
				<el-form-item label="未收金额合计" label-width="120px">
					<el-input class="minput" disabled label-width="80px" :value="info.newOldPerformanceAmount || 0"></el-input>
				</el-form-item>
				<el-form-item label="已收金额合计" label-width="96px">
					<el-input class="minput" disabled label-width="80px" :value="info.amount || 0"></el-input>
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
import { receiptDetail } from "@/api/org-performance";
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
      setting: [
        {
          label: "预收日期",
          value: "prepaidDate",
        },
        {
          label: "房租日期",
          value: "",
          formatter(row, column, cellValue, index) {
							return `${row.startTime}-${row.endTime}`;
					}   
        },
        {
          label: "实收日期",
          value: "acturalDate", 
        },
        {
          label: "分类",
          value: "classification"
        },
        {
          label: "预收金额",
          value: "prepaidAmount"
        },
        {
          label: "实收金额",
          value: "acturalAmount"
        },
        {
          label: "截止金额",
          value: "endAmount"
        },
        {
          label: "客户姓名",
          value: "name"
        },
        {
          label: "合同编号",
          value: "leaseNo"
        },
        {
					label: "合同状态",
					value: "leaseStatus",
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
          label: "成交人",
          value: "masterDealer"
        },
        {
          label: "状态",
          value: "status",
          formatter(row, column, cellValue, index) {
            return cellValue == 1 ? "已收款" : "未收款";
          }
        },
        {
          label: "凭证编号",
          value: "confirmNo"
        },
      ],
      info: {},
      recoverStatus: ''
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
      receiptDetail(form).then(res => {
        console.log('receiptDetail', res)
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
      return this.info.leaseCostDetailFindVOS || []
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