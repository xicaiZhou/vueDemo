<!-- 业绩核算 -->
<template>
  <div class> 
    	<!--实时业绩-->
		<div class="table_margin">
			<el-form label-width="90px" size="small" :inline="true">
				<el-form-item label="台账编号">
					<el-input class="minput" disabled :value="ledger.accountNo"></el-input>
				</el-form-item >
				<el-form-item label="房源地址">
					<el-input class="minput" disabled :value="ledger.address"></el-input>
				</el-form-item>
        <el-form-item label="门店">
					<el-input class="minput" disabled :value="ledger.storeName"></el-input>
				</el-form-item>
        <br>
        <el-form-item label="经纪人">
					<el-input class="minput" disabled :value="ledger.masterBroker"></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group :value="ledger.status">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
    </div>
    <div class="table_float clearfix">
      <div class="table_div">
        <el-form label-width="100px" size="small" :inline="true">
          <el-form-item label="客户押金未退">
            <el-input class="minput" disabled :value="info.leaseDepositNoAmount"></el-input>
          </el-form-item >
        </el-form>
        <m-table
          :hasIndex="true"
          :data="info.leaseDepositNoVOS"
          :setting="table1.setting"
          :loading="table1.loading"
          :hasPagination="false"
          >
        </m-table>
      </div>
      <div class="table_div">
        <el-form label-width="100px" size="small" :inline="true">
          <el-form-item label="客户押金已退">
            <el-input class="minput" disabled :value="info.leaseDepositAmount"></el-input>
          </el-form-item >
        </el-form>
        <m-table
          :hasIndex="true"
          :data="info.leaseDepositVOS"
          :setting="table2.setting"
          :loading="table2.loading"
          :hasPagination="false"
          >
        </m-table>
      </div>
      <div class="table_div">
        <el-form label-width="100px" size="small" :inline="true">
          <el-form-item label="业主押金">
            <el-input class="minput" disabled :value="info.agencyDepositNoAmount"></el-input>
          </el-form-item >
        </el-form>
        <m-table
          :hasIndex="true"
          :data="info.agencyDepositNoVOS"
          :setting="table3.setting"
          :loading="table3.loading"
          :hasPagination="false"
          >
        </m-table>
      </div>
    </div>
    <!-- 业绩查询 -->
    <m-achievement :accountNo="ledger.accountNo" :address="ledger.address"></m-achievement>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import moment from 'moment'
import MTable from "@/components/Table";
import MAchievement from "./achievement";
import { actualDeposits } from "@/api/org-performance";

export default {
  props: {
    ledger: {
      type: Object,
      default: () => ({})
    }
  },
  //import引入的组件需要注入到对象中才能使用
  components: {
    MTable,
    MAchievement
  },
  data() {
    //这里存放数据
    return {
      info: {},
      table1: {
        loading: false,
        list: [],
        setting: [
          {
            label: "金额",
            value: "preAmount"
          },
          {
            label: "租户姓名",
            value: "memberName"
          },
          {
            label: "合同编号",
            value: "leaseNo"
          }
        ],
      }, 
      table2: {
        loading: false,
        list: [],
        setting: [
          {
            label: "金额",
            value: "realAmount"
          },
          {
            label: "租户姓名",
            value: "memberName"
          },
          {
            label: "合同编号",
            value: "leaseNo"
          }
        ],
      },
      table3: {
        loading: false,
        list: [],
        setting: [
          {
            label: "金额",
            value: "preAmount"
          },
          {
            label: "租户姓名",
            value: "memberName"
          },
          {
            label: "合同编号",
            value: "agencyNo"
          },
          {
            label: "状态",
            value: "recoverStatus",
            formatter(row, column, cellValue, index) {
              return cellValue === 1
                ? "已退款"
                : "未退款";
            }
          }
        ],
      },
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    getData() {
      console.log(this.ledger)
      const form = {
        accountNo: this.ledger.accountNo
        // actualDate: this.ledger.createTime,
        // recoverStatus: this.ledger.status
      }
      actualDeposits(form).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.info = body || {};
        }
      }).catch(err => {
        console.error(err)
      })
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getData()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.table_float{
  margin: 20px 0;
}
.table_float .table_div{
 width: 30%;
 float: left;
 margin-right: 3%;
}
.clearfix:after{
  content: "";
  display: block;
  height: 0;
  clear:both;
  visibility: hidden;
}
.clearfix{
  *zoom: 1;
}
</style>