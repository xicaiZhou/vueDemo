<template>
  <div class="mContainer">
    <div class="contorl">
      <el-button type="primary" size="mini" :disabled="((isFlow == 1 || selectedRowData.recoverStatus == 1) ? true  : false)" @click="toDetail(1)">确认回收</el-button>
      <el-button type="primary" size="mini" :disabled="((isFlow == 1 || selectedRowData.recoverStatus !== 1) ? true  : false)" @click="toDetail(2)">取消回收</el-button>
    </div>
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
        <m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
        <el-form-item label="合同编号">
          <el-input class="minput" v-model="table.parms.agencyNo"></el-input>
        </el-form-item>
        <el-form-item label="业主名称">
          <el-input class="minput" v-model="table.parms.memberName"></el-input>
        </el-form-item>
        <el-form-item label="所在楼盘">
          <el-select placeholder="请选择" v-model="table.parms.buildingId">
            <el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input class="minput" v-model="table.parms.accountNo"></el-input>
        </el-form-item>
        <el-form-item label="回收状态">
          <el-select placeholder="请选择" v-model="table.parms.recoverStatus">
            <el-option v-for="(item, i) in recoverStatues" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预回收日期">
          <el-date-picker
            v-model="table.parms.preRecoverDateBegin"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart">
          </el-date-picker>
          至
          <el-date-picker
            v-model="table.parms.preRecoverDateEnd"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsEnd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="currentChange(1)">查 询</el-button>
          <el-button type="primary">清空条件</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      @currentChange="currentChange"
      @handleCurrentChange="handleCurrentChange"
    >
    </m-table>
    <br>
    <br>
    <h5>流水记录</h5>
    <m-table 
      :hasIndex="true" 
      :data="table2.list" 
      :setting="table2.setting"
      :total="table2.total"
      :pageNum="table2.page"
      :pageSize="table2.rows">
      </m-table>
    <!-- 确定回收 -->
    <el-dialog width="750px" title="确定回收" 
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false">
      <el-form label-width="90px" size="small" :inline="true" ref="form">
        <el-form-item label="合同编号">
          <el-input style="width: 240px;" class="minput" v-model="dialogForm.agencyNo" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input style="width: 240px;" class="minput" v-model="dialogForm.accountNo" :disabled="true"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="合同地址">
          <el-input style="width: 585px;" class="minput" v-model="dialogForm.address" :disabled="true"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="主成交人">
          <el-select placeholder="请选择" v-model="dialogForm.masterDealer" :disabled="true">
            <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="副成交人">
          <el-select placeholder="请选择" v-model="dialogForm.slaveDealer" :disabled="true">
            <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <br>
        <!-- <m-cascader :companyId.sync="dialogForm.companyId" :storeId.sync="dialogForm.storeId"></m-cascader> -->
        
        <el-form-item label="台账公司">
          <el-input style="width: 240px;" v-model="dialogForm.company" class="minput" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="台账门店">
          <el-input style="width: 240px;" v-model="dialogForm.storeName" class="minput" :disabled="true"></el-input>
        </el-form-item>
        <br>
        <br>
        <el-form-item label="业主姓名">
          <el-input style="width: 240px;" class="minput" v-model="dialogForm.memberName" :disabled="true"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="预收日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.preRecoverDate" :disabled="true"></el-date-picker>
        </el-form-item>
        <el-form-item label="预收金额">
          <el-input style="width: 240px;" class="minput" v-model="dialogForm.preRecoverAmount" :disabled="true"></el-input>
        </el-form-item>
        <br>
        <br>
        <el-form-item label="收入方式">
          <el-radio-group v-model="dialogForm.recoverType">
            <el-radio :label="1">现金</el-radio>
            <el-radio :label="2">转账</el-radio>
            <el-radio :label="3">POS机</el-radio>
            <el-radio :label="4">微信</el-radio>
            <el-radio :label="5">支付宝</el-radio>
          </el-radio-group>
        </el-form-item>
        <br>
        <el-form-item label="实收日期">
          <el-date-picker type="date" :disabled="true" placeholder="选择日期" v-model="dialogForm.realRecoverDate"></el-date-picker>
        </el-form-item>
        <el-form-item label="实收金额">
          <el-input style="width: 240px;" :disabled="true" class="minput" v-model="dialogForm.realRecoverAmount"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :disabled="true" style="width: 585px;" type="textarea" :rows="6" placeholder="请输入备注" v-model="dialogForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 确定回收END -->
  </div>
</template>

<script>
import { FindByName } from "@/api/org-user";
import { buildingFindAll } from "@/api/org-house";
import { getAgencyDeposit, entryAgencyDeposit } from "@/api/org-agencyContract";
import { findFlowDetailPage } from "@/api/org-tempAccount";
import MTable from "@/components/Table";
import moment from 'moment'
import MCascader from "@/components/department/mcascader";
export default {
  components: {
    MTable,
    MCascader
  },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.table.parms.preRecoverDateEnd;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.preRecoverDateBegin;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      table: {
        loading: false,
        list: [],
        setting: [
          {
            label: "公司",
            value: "company",
            width: 120
          },
          {
            label: "门店",
            value: "storeName",
            width: 120
          },
          {
            label: "预回收日期",
            value: "preRecoverDate",
            width: 120
          },
          {
            label: "合同编号",
            value: "agencyNo",
            width: 230
          },
          {
            label: "业主姓名",
            value: "memberName"
          },
          {
            label: "台账编号",
            value: "accountNo",
            width: 120
          },
          {
            label: "房源地址",
            value: "address",
            width: 200
          },
          {
            label: "备注",
            value: "agencyDescription",
            width: 300
          },
          {
            label: "预回收金额",
            value: "preRecoverAmount"
          },
          {
            label: "实回收日期",
            value: "realRecoverDate",
            width: 120
          },
          {
            label: "实回收金额",
            value: "realRecoverAmount"
          },
          {
            label: "经济人",
            value: "masterBroker"
          },
          {
            label: "回收状态",
            value: "recoverStatus",
            formatter(row, column, cellValue, index) {
              return cellValue === 1 ? "已回收" : "未回收";
            }
          },
          {
            label: "分类",
            value: "category"
          },
          {
            label: "回收编号",
            value: "id"
          },
          {
            label: "到期备注",
            value: "expireDescription",
            width: 150
          },
          {
            label: "退款备注",
            value: "description",
            width: 150
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          agencyNo: "",
          memberName: "",
          buildingId: "",
          accountNo: "",
          recoverStatus: "0",
          preRecoverDateBegin: "",
          preRecoverDateEnd: "",
        },
        total: 10,
        page: 1,
        rows: 10
      },
      table2: {
        loading: false,
        list: [],
        setting: [
          {
            label: "公司",
            value: "companyName",
            width: 120
          },
          {
            label: "门店",
            value: "storeName",
            width: 120
          },
          {
            label: "ID",
            value: "id"
          },
          {
            label: "大类",
            value: "bigClassification"
          },
          {
            label: "小类",
            value: "smallClassification"
          },
          {
            label: "项目",
            value: "project"
          },
          {
            label: "房源地址",
            value: "houseAddress",
            width: 200
          },
          {
            label: "出账时间",
            value: "confirmDate",
            width: 120
          },
          {
            label: "收支类型",
            value: "budgetType"
          },
          {
            label: "金额",
            value: "budgetAmount",
          },
          {
            label: "流水编号",
            value: "flowDetailId",
            width: 230
          },
          {
            label: "入账日期",
            value: "entryDate",
            width: 120
          },
          {
            label: "确认标记",
            value: "confirmStatus",
            formatter(row, column, cellValue, index) {
              return cellValue === 1  ? "已确认" : "未确认";
            }
          },
          {
            label: "凭证编号",
            value: "confirmNo"
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          budgetNo: ""
        },
        total: 10,
        page: 1,
        rows: 10
      },
      dialogForm: {
        agencyNo: "",
        category: "",
        description: "",
        id: 0,
        preRecoverAmount: 0,
        preRecoverDate: "",
        realRecoverAmount: 0,
        realRecoverDate: "",
        recoverStatus: 0,
        recoverType: 1
      },
      createUsers: [{ name: "所有项", id: "" }],
      buildings: [{ name: "所有项", id: "" }],
      recoverStatues: [{ name: "所有项", id: "" }, { name: "已回收", id: "1" }, { name: "未回收", id: "0" }],
      dialogTableVisible: false,
      isFlow: 1,// 0是没有流水凭证，1是有
      selectedRowData: {}
    };
  },
  watch: {
    "table.parms.preRecoverDateBegin"(val) {
      if (val) {
        this.table.parms.preRecoverDateBegin = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.preRecoverDateBegin = ""
      }
    },
    "table.parms.preRecoverDateEnd"(val) {
      if (val) {
        this.table.parms.preRecoverDateEnd = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.preRecoverDateEnd = ""
      }
    }
  },
  computed: {
    form() {
      return {
        agencyNo: this.dialogForm.agencyNo,
        category: this.dialogForm.category,
        description: this.dialogForm.description,
        id: this.dialogForm.id,
        preRecoverAmount: this.dialogForm.preRecoverAmount,
        preRecoverDate: this.dialogForm.preRecoverDate,
        realRecoverAmount: this.dialogForm.realRecoverAmount,
        realRecoverDate: this.dialogForm.realRecoverDate,
        recoverStatus: 1,
        recoverType: this.dialogForm.recoverType
      };
    }
  },
  methods: {
    /**
     * 获取分页数据
    */
    currentChange(val) {
      if (val || val === 0) {
        this.table.page = val;
      }
      let { page, rows, parms } = this.table;
      getAgencyDeposit({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.table.list = body.rows
          this.table.total = body.total;
        }
      });
      
    },
    handleCurrentChange(val){ //单选
      if(!val) return
      this.selectedRowData = val
      this.table2.parms = {
        companyId: val.companyId,
        storeId: val.storeId,
        budgetNo: val.agencyDepositNo
      }
      this.flowDetails(1)
    },
    /**
		 * 默认查询分页流水明细
		*/
    flowDetails(val) {
      if (val || val === 0) {
        this.table2.page = val;
      }
      let { page, rows, parms } = this.table2;
      findFlowDetailPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.table2.list = body.rows
          if (body.rows.length != 0) {
            body.rows.some((item, i) => {
              if (item.confirmStatus == 1) {
                this.isFlow = 1
                // console.log("this.isFlow=-========",this.isFlow);
                return true;
              }else {
                this.isFlow = 5
              }
            })
          }else {
            this.isFlow = 5
          }
          this.table2.total = body.total;
        }
      });
    },
    /**
     * 确定回收弹框
    */
    toDetail(index) {
      this.dialogForm = { ...this.selectedRowData }

      if (index == 2 && this.selectedRowData.recoverStatus == 1) {
        this.$confirm("确定取消本次回收吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.form.recoverStatus = 2;
          entryAgencyDeposit(this.form).then(res => {
            const { code } = res;
            if (code == 1000) {
              this.$message({
                message: "取消回收成功",
                type: "success"
              });
              this.currentChange();
              this.dialogTableVisible = false;
            } else {
              this.$message({
                message: "取消回收失败",
                type: "error"
              });
            }
          });
        })
      }else {
        this.dialogTableVisible = true;
        this.dialogForm.recoverType = 1
        this.dialogForm.realRecoverDate = this.timeDefault();
        this.dialogForm.realRecoverAmount = this.selectedRowData.preRecoverAmount
      }
    },
    /**
     * 提交回收按钮
    */
    handleSubmit() {
      entryAgencyDeposit(this.form).then(res => {
        const { code } = res;
        if (code == 1000) {
          this.$message({
            message: "回收成功",
            type: "success"
          });
          this.currentChange();
          this.dialogTableVisible = false;
        } else {
          this.$message({
            message: "回收失败",
            type: "error"
          });
        }
      });
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
    /*
    * 查询所有楼盘
    */
    buildingFind() {
      buildingFindAll({}).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.buildings = [
            { name: "所有项", id: "" },
            ...body.map(item => {
              return { ...item };
            })
          ];
        }
      });
    },
    timeDefault() {
      var date = new Date();
      var s1 = date.getFullYear() + "-" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "-" + (date.getDate() >= 10 ? date.getDate() : ("0" + date.getDate()));
      return s1;
    }
  },
  mounted () {
    this.findUserByName();
    this.buildingFind();
    this.currentChange(1);
  }
};
</script>
<style>
.mContainer .el-table__body tr.current-row>td {
	background-color: #ffec8b !important;
}
</style>
<style scoped>
.contorl {
  padding: 20px 0;
  text-align: center;
}
h5 {
  font-size: 16px;
  margin-bottom: 10px;
}
.bInput {
  width: 500px;
}
</style>
