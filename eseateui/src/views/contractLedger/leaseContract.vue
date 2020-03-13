<!-- 租赁合同 -->
<template>
  <div>
    <div class="table_margin">
      <el-form label-width="90px" size="small" :inline="true">
        <el-form-item label="台账编号">
          <el-input class="minput" v-model="this.ledgerId" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同状态">
          <el-radio-group v-model="table1Search" >
          <el-radio label="">全部</el-radio>
          <el-radio label="1">有效</el-radio>
          <el-radio label="0">无效</el-radio>
          </el-radio-group>
        </el-form-item >
      </el-form>
      <m-table
        :hasIndex="true"
        :data="table1List"
        :setting="table1.setting"
        :loading="table1.loading"
        :hasPagination="false"
        :showSummary="true"
        :summaryMethod="summaryMethod"
        @handleCurrentChange="changeAgency"
        >
      </m-table>
    </div>
    <div class="table_margin">
      <m-table
        :hasIndex="true"
        :data="table2List"
        :setting="table2.setting"
        :loading="table2.loading"
        :hasPagination="false"
        >
      </m-table>
     </div>
     <div class="table_margin">
      <el-form label-width="90px" size="small" :inline="true">
        <el-form-item label="预收信息">
          <el-radio-group v-model="table3Search" >
          <el-radio label="">全部</el-radio>
          <el-radio label="1">只看已付</el-radio>
          <el-radio label="0">只看未付</el-radio>
          </el-radio-group>
        </el-form-item >
      </el-form>
        <m-table
        :hasIndex="true"
        :data="table3List"
        :setting="table3.setting"
        :loading="table3.loading"
        :hasPagination="false">
      </m-table>
     </div>
  </div>
</template>

<script>
import moment from 'moment'
import MTable from "@/components/Table";
import {
  getLeaseByPage,getLeaseContractDetail
} from "@/api/org-leaseContract";
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    MTable
  },
  props: {
    ledgerId: {
      type: String | Number,
      default: ''
    }
  },
  data() {
    return {
      table1: {
        loading: false,
        list: [],
        setting: [
          // {
          //   label: "档案编号",
          //   value: "leaseNo"
          // },
          {
            label: "合同状态",
            value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue == -1 ? '删除' : cellValue == 0 ? '作废' : cellValue == 1 ? '生效' : '到期';
            }
          },
          {
            label: "合同编号",
            value: "leaseNo"
          },
          {
            label: "日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return `${row.startTime}至${row.endTime}`;
            }
          },
          {
            label: "首年租金",
            value: "",
            formatter(row, column, cellValue, index) {
              return row.rent;
            }
          },
          {
            label: "期限",
            value: "",
            formatter(row, column, cellValue, index) {
              return `${row.year}年${row.month}月${row.day}日`;
            }
          },
          {
            label: "合同总计",
            value: "totalIncome"
          },
          {
            label: "房源地址",
            value: "address"
          },
          {
            label: "分租类型",
            value: "rentType",
             formatter(row, column, cellValue, index) {
              return cellValue == 1 ? '整租' : '分租';
            }
          },
          {
            label: "分租房间",
            value: "rentHouse"
          },
          
        ],
      },
      table2: {
        loading: false,
        list: [],
        setting: [
          // {
          //   label: "年次",
          //   value: "years"
          // },
          {
            label: "合同日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return `${row.startTime}-${row.endTime}`;
            }
          },
           {
            label: "租金单价",
            value: "rent"
          },
          {
          label: "付款方式",
            value: "paymentWay"
          },
          {
            label: "提前付款天数",
            value: "advancePaymentDays"
          },
          {
            label: "租金合计",
            value: "rentTotal"
          }
        ],
      },
      table3: {
        loading: false,
        list: [],
        setting: [
          {
            label: "台账编号",
            value: "accountNo"
          },
          {
            label: "分类",
            value: "classification"
          },
          {
            label: "房租日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return `${row.startTime}至${row.endTime}`;
            }
          },
          {
            label: "预付日期",
            value: "prepaidDate"
          },
          {
            label: "预付金额",
            value: "prepaidAmount"
          },
          {
            label: "状态",
            value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue == 1 ? "已付款" : "未付款";
            }
          },
          {
            label: "实付日期",
            value: "acturalDate"
          },
          {
            label: "实付金额",
            value: "acturalAmount"
          },
          {
            label: "开始时间",
            value: "startTime"
          },
          {
            label: "结束时间",
            value: "endTime"
          },
          // {
          //   label: "是否审核",
          //   value: ""
          // },
          // {
          //   label: "是否有效",
          //   value: ""
          // },
        ],
      },
      table3Search: '',
      table1Search: '1'
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
   
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getAgencys({ accountNo: this.ledgerId })
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
     
  },
  methods: {
    /**
     * 获取合同
     */
    getAgencys(params = {}) {
      getLeaseByPage(params).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          //合同列表
          this.table1.list = body.rows || [];
          return
        }
        return Promise.reject('获取合同失败')
      }).catch(err => {
        console.error(err)
      })
    },
    getContract(leaseId) {
      getLeaseContractDetail(leaseId).then(res=>{
        let { code, body } = res;
        if(code == 1000){
          this.table2.list = body.leasePaymentAgreementVOS || [];
          this.table3.list = body.leaseCostDetailVOS || [];
          return
        }
        return Promise.reject('获取付款信息')
      }).catch(err  => {
        console.error(err)
      })
    },
    changeAgency(agency) {
      console.log('changeAgency', agency)
      if (!agency) {
        return
      }
      this.getContract(agency.leaseId)
    },
    /**
     * 账户余额求累加和
    */
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((c, index) => {
        if (index === 0) {
          sums[index] = '租金单价合计'
        } else if (index === 4) {
          let sum = 0
          data.forEach(d => {
            sum += d.rent
          })
          sums[index] = sum
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
  },
  computed: {
    table1List() {
      if (this.table1Search === '') {
        return this.table1.list
      }
      return this.table1.list.filter(d => d.status == this.table1Search)
    },
    table2List() {
      if (this.table1List.length === 0) {
        return []
      }
      return this.table2.list
    },
    table3List() {
      if (this.table1List.length === 0) {
        return []
      }
      if (this.table3Search === '') {
        return this.table3.list
      }
      return this.table3.list.filter(d => d.status == this.table3Search)
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.table_margin{
  margin: 0 0 40px;
}
</style>