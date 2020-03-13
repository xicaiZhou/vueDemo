<template>
  <div class="mContainer">
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
				<m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
        <el-form-item label="入账人员">
					<el-select placeholder="请选择" v-model="table.parms.entryUser">
            <el-option v-for="(item, i) in createUsers" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input class="minput" v-model="table.parms.accountNo" placeholder="请输入台账编号"></el-input>
        </el-form-item>
        <!-- <el-form-item label="门牌号">
          <el-input class="minput" placeholder="请输入门牌号"></el-input>
        </el-form-item> -->
        <el-form-item label="收支编号" v-model="table.parms.budgetNo">
          <el-input class="minput" placeholder="请输入收支编号"></el-input>
        </el-form-item>
				<el-form-item label="收入方式">
					<el-select placeholder="请选择" v-model="table.parms.budgetWay">
            <el-option v-for="(item, i) in alipayTypes" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="更新日期">
          <el-date-picker
            v-model="table.parms.updateDateBegin"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart">
          </el-date-picker>
          至
          <el-date-picker
            v-model="table.parms.updateDateEnd"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsEnd">
          </el-date-picker>
        </el-form-item>
				<el-form-item label="入账日期">
          <el-date-picker
            v-model="table.parms.entryDateBegin"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart1">
          </el-date-picker>
          至
          <el-date-picker
            v-model="table.parms.entryDateEnd"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsEnd2">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="currentChange(1)">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      :data="table.list"
      :hasPaginationSizes="true"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      @currentChange="currentChange"
      @handleSizeChange="handleSizeChange"
    >
      <el-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="scope">
					<el-button type="text" v-if="scope.row.confirmStatus === 1" @click="updatePipeline(scope.row)">撤销凭证</el-button>
          <el-button type="text" v-else @click="updatePipeline(scope.row)">更新凭证</el-button>
					<!-- <el-button type="text" @click="deletePipeline(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </m-table>
  </div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'
import MCascader from "@/components/department/mcascader";
import { FindByName } from "@/api/org-user";
import { 
  findFlowDetailPage, 
  flowDetailConfirm, 
  flowDetailCancel } from "@/api/org-tempAccount";

export default {
  components: {
    MTable,
    moment,
		MCascader
  },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.table.parms.updateDateEnd;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.updateDateBegin;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      pickerOptionsStart1: {
        disabledDate: time => {
          let endDateVal = this.table.parms.entryDateEnd;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd2: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.entryDateBegin;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      table: {
        loading:false,
        list: [],
        setting: [
          {
            label: "门店",
            value: "storeName"
          },
          {
            label: "入账日期",
            value: "entryDate",
          },
          {
            label: "更新日期",
            value: "updateTime",
          },
          {
            label: "确认状态",
            value: "confirmStatus",
            formatter(row, column, cellValue, index) {
              return cellValue === 1 ? "已确认" : "未确认";
            }
          },
          {
            label: "凭证编号",
            value: "confirmNo",
          },
          {
            label: "收支金额",
            value: "budgetAmount"
          },
          {
            label: "余额",
            value: "balance",
          },
          {
            label: "更新人员",
            value: "updateUserName"
          },
          {
            label: "公司",
            value: "companyName",
          },
					{
            label: "入账人员",
            value: "entryUserName"
          },
          {
            label: "收支编号",
            value: "flowDetailId",
          },
          {
            label: "台账编号",
            value: "accountNo",
          },
          {
            label: "收支类型",
            value: "budgetType"
					},
					{
            label: "收支方式",
            value: "budgetWay"
          },
          {
            label: "房源地址",
            value: "houseAddress",
          },
          {
            label: "大类",
            value: "bigClassification",
					},
					{
            label: "小类",
            value: "smallClassification",
					},
					{
            label: "项目",
            value: "project",
					},
					{
            label: "备注",
            value: "description",
					},
					{
            label: "房租期限",
            value: "houseRentDate",
					},
					{
            label: "创建时间",
            value: "confirmDate",
          }
        ],
        parms: {
          budgetNo: "",
          entryDateBegin: "",
          entryDateEnd: "",
          updateDateBegin: "",
          updateDateEnd: "",
          companyId: "",
          storeId: "",
          entryUser: "",
          accountNo: "",
        },
        total: 10,
        page: 1,
        rows: 10
			},
			createUsers: [{ name: "所有项", id: "" }],
			alipayTypes: [{ name: "所有项", id: "" }, { name: "现金", id: "1" }, { name: "转账", id: "2" }, { name: "POS机", id: "3" }, { name: "微信", id: "4" }, { name: "支付宝", id: "5" }],
    };
  },
  watch: {
    "table.parms.updateDateBegin"(val) {
      if (val) {
        this.table.parms.updateDateBegin = moment(val).format("YYYY-MM-DD");
        
      }else {
        this.table.parms.updateDateBegin = ""
      }
    },
    "table.parms.updateDateEnd"(val) {
      if (val) {
        this.table.parms.updateDateEnd = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.updateDateEnd = ""
      }
    },
    "table.parms.entryDateBegin"(val) {
      if (val) {
        this.table.parms.entryDateBegin = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.entryDateBegin = "";
      }
    },
    "table.parms.entryDateEnd"(val) {
      if (val) {
        this.table.parms.entryDateEnd = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.entryDateEnd = ""
      }
    }
  },
  methods: {
		// 设置显示页数
    handleSizeChange(val) {
      this.currentChange(1, val)
    },
		/**
     * 获取分页数据
    */
    currentChange(val, totalNum) {
      if (val || val === 0) {
        this.table.page = val;
      }
      if (totalNum || totalNum === 0) {
        this.table.rows = totalNum;
      }
      let { page, rows, parms } = this.table;
      findFlowDetailPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.table.list = body.rows
          this.table.total = body.total;
        }
      });
    },
    /**
     * 取消或确认凭证
    */
    updatePipeline(val) {
      if (val.confirmStatus === 1) {
        // 取消凭证
        flowDetailCancel(val.id).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              message: "撤销凭证成功",
              type: "success"
            });
            this.currentChange();
          }else {
            this.$message({
              message: "撤销凭证失败",
              type: "error"
            });
          }
        })
      }else {
        // 确认凭证
        flowDetailConfirm(val.id).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              message: "更新凭证成功",
              type: "success"
            });
            this.currentChange();
          }else {
            this.$message({
              message: "更新凭证失败",
              type: "error"
            });
          }
        })

      }
    },
		/*
    * 查询所有录入人
    */
    findUserByName() {
      FindByName({}).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.createUsers = [{ name: "所有项", id: "" }, ...body];
        }
      });
    },
    /**
     * 获取当前日期后N天
    */
    timeDefault(AddDayCount) {
      var dd = new Date();
      dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
      var y = dd.getFullYear(); 
      var m = (dd.getMonth()+1)<10?"0"+(dd.getMonth()+1):(dd.getMonth()+1);//获取当前月份的日期，不足10补0
      var d = dd.getDate()<10?"0"+dd.getDate():dd.getDate();//获取当前几号，不足10补0
      return y+"-"+m+"-"+d; 
    }
  },
   mounted() {
    
    // 更新日期(默认当天)
    this.table.parms.updateDateBegin = this.timeDefault(0);
    this.table.parms.updateDateEnd = this.timeDefault(0);
    // this.updateDate = [this.timeDefault(0),this.timeDefault(0)];
    

    // 入账日期(默认当天)
    // this.table.parms.entryDateBegin = this.timeDefault(0);
    // this.table.parms.entryDateEnd = this.timeDefault(0);
    // this.prepaidDate = [this.timeDefault(0),this.timeDefault(0)];

		this.currentChange(1);
		this.findUserByName();
  }
};
</script>

<style scoped>
h5{
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
