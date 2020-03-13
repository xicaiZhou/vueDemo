<template>
  <div class="mContainer">
    <div class="contorl">
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 1 || approve.isManager == 1 || approve.isAudit == 1) ? true  : false)" @click="auditor(2,0)">店长确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 0 || approve.isManager == 1 || approve.isAudit == 1) ? true  : false)" @click="auditor(2,1)">撤销店长确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.manager" :disabled="((approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)" @click="auditor(3,0)">经理确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.manager" :disabled="((approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 0 || approve.isAudit == 1) ? true : false)" @click="auditor(3,1)">撤销经理确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 1 || approve.recoverStatus == 1) ?  true : false)" @click="auditor(4,0)">财务确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 0 || approve.recoverStatus == 1) ?  true : false)" @click="auditor(4,1)">撤销财务确认</el-button>
      <el-button type="primary" size="mini" :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 0 || approve.recoverStatus == 1) ?  true : false)" @click="toDetail(1)">退款提交</el-button>
      <el-button type="primary" size="mini" :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 0 || approve.recoverStatus !== 1) ?  true : false)" @click="toDetail(2)">取消退款提交</el-button>
    </div>
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
        <el-form-item label="楼 盘">
          <el-select placeholder="请选择" v-model="table.parms.buildingId">
            <el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号">
          <el-input class="minput" v-model="table.parms.familyId"></el-input>
        </el-form-item>
        <m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
        <el-form-item label="合同编号">
          <el-input class="minput" v-model="table.parms.leaseNo"></el-input>
        </el-form-item>
        <el-form-item label="退款状态">
          <el-select placeholder="请选择" v-model="table.parms.recoverStatus">
            <el-option v-for="(item, i) in recoverStatues" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="currentChange(1)">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      ref="mtable"
      :hasIndex="true"
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      :notChangeRow="notChangeRow"
      @currentChange="currentChange"
      @handleCurrentChange="handleCurrentChange"
    >
    </m-table>
    <br>
    <br>  
    <h5>审 核</h5>
    <m-table :hasIndex="false" :hasPagination="false" :data="tableAudit.list" :setting="tableAudit.setting"></m-table>
    <br>  
    <br>
    <h5>入账流水</h5>
    <m-table 
      :hasIndex="true" 
      :data="table2.list" 
      :setting="table2.setting"
      :total="table2.total"
      :pageNum="table2.page"
      :pageSize="table2.rows">
      </m-table>
    <!-- 退款提交 -->
    <el-dialog width="750px" title="退款提交" 
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false">
      <el-form label-width="90px" size="small" :inline="true">
        <h5>合同</h5>
        <el-form-item label="合同编号">
          <el-input style="width: 240px;" v-model="dialogForm.leaseNo" :disabled="true" class="minput"></el-input>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input style="width: 240px;" v-model="dialogForm.accountNo" :disabled="true" class="minput"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="合同地址">
          <el-input style="width: 585px;" v-model="dialogForm.address" :disabled="true" class="minput"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="主经纪人">
          <el-select placeholder="请选择" v-model="dialogForm.masterBroker" :disabled="true">
            <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="副经纪人">
          <el-select placeholder="请选择" v-model="dialogForm.slaveDealer" :disabled="true">
            <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="客户姓名">
          <el-input style="width: 240px;" v-model="dialogForm.memberName" :disabled="true" class="minput"></el-input>
        </el-form-item>
        <!-- <m-cascader :companyId.sync="searchParams.companyId" :storeId.sync="searchParams.storeId"></m-cascader> -->
        <el-form-item label="台账公司">
          <el-input style="width: 240px;" v-model="dialogForm.company" :disabled="true" class="minput"></el-input>
        </el-form-item>
        <el-form-item label="台账门店">
          <el-input style="width: 240px;" v-model="dialogForm.storeName" :disabled="true" class="minput"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="预退日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.preRecoverDate" :disabled="true"></el-date-picker>
        </el-form-item>
        <el-form-item label="预退金额">
          <el-input style="width: 240px;" class="minput" v-model="dialogForm.preRecoverAmount" :disabled="true"></el-input>
        </el-form-item>
        <br>
        <h5>退款</h5>
        <el-form-item label="实退日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.realRecoverDate" :disabled="true"></el-date-picker>
        </el-form-item>
        <el-form-item label="实退金额">
          <el-input style="width: 240px;" class="minput" v-model="dialogForm.realRecoverAmount" :disabled="true"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="备注">
          <el-input style="width: 585px;" type="textarea" :rows="6" placeholder="请输入备注" v-model="dialogForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 退款提交END -->

  </div>
</template>

<script>
import { FindByName } from "@/api/org-user";
import { buildingFindAll } from "@/api/org-house";
import MTable from "@/components/Table";
import MCascader from "@/components/department/mcascader";
import { getLeaseDepositPage, 
  entryLeaseDepositPage, 
  leaseDepositShopowner,
  leaseDepositManager, 
  auditLeaseDeposit } from "@/api/org-leaseContract"

import { findFlowDetailPage } from "@/api/org-tempAccount";

export default {
  components: {
    MTable,
    MCascader
  },
  data() {
    return {
      currentRow: '',
      notChangeRow: false,
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
            label: "分类",
            value: "category"
          },
          {
            label: "退款状态",
            value: "recoverStatus",
            formatter(row, column, cellValue, index) {
              return cellValue === 1  ? "已退款" : "未退款";
            }
          },
          {
            label: "预退日期",
            value: "preRecoverDate",
            width: 120
          },
          {
            label: "合同编号",
            value: "leaseNo",
            width: 230
          },
          {
            label: "台账编号",
            value: "accountNo",
            width: 120
          },
          {
            label: "主经济人",
            value: "masterBroker"
          },
          {
            label: "房源地址",
            value: "address",
            width: 200
          },
          {
            label: "预退金额",
            value: "preRecoverAmount"
          },
          {
            label: "实退日期",
            value: "realRecoverDate",
            width: 120
          },
          {
            label: "实退金额",
            value: "realRecoverAmount"
          },
          {
            label: "备注",
            value: "description",
            width: 300
          },
          {
            label: "退款编号",
            value: "id"
          },
        ],
        parms: {
          accountNo: "",
          buildingId: "",
          companyId: "",
          familyId: "",
          leaseNo: "",
          memberName: "",
          recoverStatus: "0",
          storeId: ""
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
      tableAudit: {
        list: [],
        setting: [
          {
            label: "退款提交",
            value: "recoverStatus",
            formatter(row, column, cellValue, index) {
              return cellValue === 0
                ? "未提交"
                : cellValue === 1
                ? "已提交"
                : " 取消提交";
            }
          },
          {
            label: "提交人",
            value: "createUser"
          },
          {
            label: "店长审核",
            value: "isShopowner",
            formatter(row, column, cellValue, index) {
              return cellValue === 0
                ? "未审核"
                : cellValue === 1
                ? "已审核"
                : " 取消审核";
            }
          },
          {
            label: "店长",
            value: "shopowner"
          },
          {
            label: "经理审核",
            value: "isManager",
            formatter(row, column, cellValue, index) {
              return cellValue === 0
                ? "未审核"
                : cellValue === 1
                ? "已审核"
                : " 取消审核";
            }
          },
          {
            label: "经理",
            value: "manager"
          },
          {
            label: "财务审核",
            value: "isAudit",
            formatter(row, column, cellValue, index) {
              return cellValue === 0
                ? "未审核"
                : cellValue === 1
                ? "已审核"
                : " 取消审核";
            }
          },
          {
            label: "财务",
            value: "auditor"
          }
        ]
      },
      permissions: {
        broker: false,
        storeManager: false,
        finance: false,
        manager: false
      },
      approve:{
        isShopowner: 5,
        isManager: 5,
        isAudit: 5,
        allStatus: false,
        isFlow: 0,// 0是没有流水凭证，1是有
      },
      dialogForm: {
        id: 0,
        description: "",
        recoverStatus: 0
      },
      createUsers: [{ name: "所有项", id: "" }],
      buildings: [{ name: "所有项", id: "" }],
      recoverStatues: [{ name: "所有项", id: "" }, { name: "已退款", id: "1" }, { name: "未退款", id: "0" }],
      dialogTableVisible: false,
      selectedRowData: {}
    };
  },
  computed: {
    form() {
      return {
        id: this.dialogForm.id,
        description: this.dialogForm.description,
        realRecoverAmount: this.dialogForm.realRecoverAmount,
        realRecoverDate: this.dialogForm.realRecoverDate,
        recoverStatus: 1
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
      getLeaseDepositPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          if (body.rows.length != 0) {
            this.table.list = body.rows
            this.table.total = body.total;
            this.$nextTick(() => {
              this.notChangeRow = true
              if (!this.currentRow)  {
                console.log('this.currentRow is null')
                return
              }
              this.$refs.mtable.setCurrentRow(this.table.list.find(d => d.id === this.currentRow.id))
            })
          }else {
            this.approve.isFlow = 1
            this.table.list = []
            this.table.total = 0;
          }
        }
      });
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
                this.approve.isFlow = 1
                return true;
              }else {
                this.approve.isFlow = 5
              }
            })
          }else {
            this.approve.isFlow = 5
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
        
        this.$confirm("确定取消本次退款提交吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.form.recoverStatus = 2;
          entryLeaseDepositPage(this.form).then(res => {
            const { code } = res;
            if (code == 1000) {
              this.$message({
                message: "取消退款提交成功",
                type: "success"
              });
              this.currentChange();
              this.dialogTableVisible = false;
            } else {
              this.$message({
                message: "取消退款提交失败",
                type: "error"
              });
            }
          });
        })
      }else {
        this.dialogTableVisible = true;
        this.dialogForm.realRecoverDate = this.timeDefault();
        this.dialogForm.realRecoverAmount = this.selectedRowData.preRecoverAmount
      }
    },
    /**
     * 提交回收按钮
    */
    handleSubmit() {
      if (this.approve.isFlow == 1) {
        this.$message({
          message: "请先撤销流水凭证更新",
          type: "error"
        });
        return
      }
      entryLeaseDepositPage(this.form).then(res => {
        const { code } = res;
        if (code == 1000) {
          this.$message({
            message: "退款提交成功",
            type: "success"
          });
          this.currentChange();
          this.dialogTableVisible = false;
        } else {
          this.$message({
            message: "退款提交失败",
            type: "error"
          });
        }
      });
    },
    /**
     * 单选
    */
    handleCurrentChange(val){
      if(!val) return
      this.selectedRowData = val
      this.approve = val
      this.approve.allStatus = true
      this.tableAudit.list = [{ ...val }];
      this.table2.parms = {
        companyId: val.companyId,
        storeId: val.storeId,
        budgetNo: val.leaseDepositNo
      }
      this.flowDetails(1);
      this.currentRow = val
    },
    /*
    * 经纪人，店长，经理，财务四级审核
    */
    auditor(val1, val2) {
      //审批
      switch (val1) {
        case 1: //经纪人
          break;
        case 2: //店长
          if (!val2) this.open2("提交店长审核申请", val1, val2);
          else this.open2("撤销店长审核申请", val1, val2);
          break;
        case 3: //经理
          if (!val2) this.open2("提交经理审核申请", val1, val2);
          else this.open2("撤销经理审核申请", val1, val2);
          break;
        case 4: //财务
          if (!val2) this.open2("提交财务审核申请", val1, val2);
          else this.open2("撤销财务审核申请", val1, val2);
          break;
        default:
          break;
      }
    },
    open2(msg, type, status) {
      if (!this.approve.allStatus) {
        this.$message({
          type: "error",
          message: "请先选择租户押金"
        });
        return;
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          switch (type) {
            case 1:
              break;
            case 2:
              const params2 = {
                isShopowner: status ? 0 : 1,
                isManager: this.approve.isManager,
                isAudit: this.approve.isAudit,
                leaseDepositIds: [this.approve.id]
              };
              // 请使用合同支出的审核接口（下同）
              leaseDepositShopowner(params2).then(res => {
                this.currentChange();
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              });
              break;
            case 3:
              const params3 = {
                isShopowner: this.approve.isShopowner,
                isManager: status ? 0 : 1,
                isAudit: this.approve.isAudit,
                leaseDepositIds: [this.approve.id]
              };
              if (this.approve.isShopowner !== 1) {
                this.$message({
                  type: "error",
                  message: "请先进行店长审核!"
                });
                return;
              }
              leaseDepositManager(params3).then(res => {
                this.currentChange();
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              });
              break;
            case 4:
              const params4 = {
                isShopowner: this.approve.isShopowner,
                isManager: this.approve.isManager,
                isAudit: status ? 0 : 1,
                leaseDepositIds: [this.approve.id]
              };
              if (this.approve.isManager !== 1) {
                this.$message({
                  type: "error",
                  message: "请先进行经理审核!"
                });
                return;
              }
              auditLeaseDeposit(params4).then(res => {
                this.currentChange();
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              });
              break;
            default:
              break;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
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
    if (this.$store.getters.userinfo) {
      // 在不同的地方调用方法的时候，这个变量的的类型是不一样的，JSON.parse()里的参数只能是string类型
      const userinfo = typeof this.$store.getters.userinfo == 'string' ? JSON.parse(this.$store.getters.userinfo) : this.$store.getters.userinfo;
      this.permissions = userinfo.permissions
    }
  }
};
</script>

<style>
.mContainer .el-table__body tr.current-row > td {
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
