<template>
  <div>
    <!--流水明细-->
		<h3>流水明细</h3>
    <div class="table_margin">
      <el-form label-width="90px" size="small" :inline="true">
				<el-form-item label="状态 " label-width="50px">
          <el-radio-group v-model="recoverStatus">
            <el-radio label="">全部</el-radio>
            <el-radio label="1">已付</el-radio>
            <el-radio label="0">未付</el-radio>
          </el-radio-group>
        </el-form-item>
				<el-button type="primary" size="mini" @click="handleClickSearch">查询</el-button>
        <el-form-item label="合计金额">
          <el-input class="minput" disabled label-width="80px" :value="info.amount"></el-input>
        </el-form-item>
      </el-form>
      <m-table
        :hasIndex="true"
        :data="info.flowCostDetailFindVOS"
        :setting="setting"
        :loading="loading"
        :hasPagination="false"
      ></m-table>
    </div>
  </div>
</template>
<script>
import MTable from "@/components/Table";
import { transaction } from "@/api/org-performance";
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
      info: {},
      loading: false,
      // 状态， 不传默认全部，0：未收/未付，1：已收/已付
      recoverStatus: '',
      setting: [
        {
          label: "收支编号",
          value: "flowDetailId"
        },
        {
          label: "凭证编号",
          value: "confirmNo"
        },
        {
          label: "入账日期",
          value: "entryDate"
        },
        {
          label: "更新日期",
          value: "updateTime"
        },
        {
          label: "收支金额",
          value: "budgetAmount"
        },
        {
          label: "入账人员",
          value: "entryUserName"
        },
        {
          label: "更新人员",
          value: "updateUserName"
        },
        {
          label: "备注",
          value: "description"
        }
      ]
    };
  },
  computed: {
    list() {
      return []
    }
  },
  methods: {
    getData(endTime = '') {
      const form = {
        //actualDate: endTime,
        accountNo: this.accountNo,
        recoverStatus: this.recoverStatus
      }
      transaction(form).then(res => {
        console.log('transaction...', res)
        if (res.code == 1000) {
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
