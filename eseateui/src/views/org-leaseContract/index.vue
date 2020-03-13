<template>
  <div class="mContainer">
    <div class="contorl">
      <el-button type="primary" size="mini" v-if="permissions.broker" :disabled="((approve.isFlow == 1 || approve.isBroker == 5 || approve.isBroker == 1 || approve.isShopowner == 1 || approve.isManager == 1 || approve.isAudit == 1) ? true  : false)" @click="auditor(1,0)">经纪人确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.broker" :disabled="((approve.isFlow == 1 || approve.isBroker == 5 || approve.isBroker == 0 || approve.isShopowner == 1 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)" @click="auditor(1,1)">撤销经纪人确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 1 || approve.isManager == 1 || approve.isAudit == 1) ? true  : false)" @click="auditor(2,0)">店长确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 0 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)" @click="auditor(2,1)">撤销店长确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.manager" :disabled="((approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)" @click="auditor(3,0)">经理确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.manager" :disabled="((approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 0 || approve.isAudit == 1) ?  true : false)" @click="auditor(3,1)">撤销经理确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 1) ?  true : false)" @click="auditor(4,0)">财务确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 0) ?  true : false)" @click="auditor(4,1)">撤销财务确认</el-button>
    </div>
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true" >
        <m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
        <el-form-item label="经纪人">
          <el-input v-model="table.parms.masterBroker" class="minput" placeholder="请输入经纪人"></el-input>
        </el-form-item>
        <el-form-item label="楼盘名称">
          <el-input class="minput" v-model="table.parms.buildingName" placeholder="请输入楼盘名称"></el-input>
        </el-form-item>
        <el-form-item label="合同状态">
          <el-select placeholder="请选择" v-model="table.parms.status">
            <el-option
              v-for="item in contractTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input v-model="table.parms.accountNo" class="minput" placeholder="请输入台账编号"></el-input>
        </el-form-item>
        <el-form-item label="租户姓名">
          <el-input v-model="table.parms.memberName" class="minput" placeholder="请输入业主姓名"></el-input>
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input v-model="table.parms.agencyNo" class="minput" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <el-form-item label="签约日期">
          <el-date-picker
            v-model="table.parms.beginTime"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart">
          </el-date-picker>
          至
          <el-date-picker
            v-model="table.parms.endTime"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsEnd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="门牌号">
          <el-input v-model="table.parms.address" class="minput" placeholder="请输入门牌号"></el-input>
        </el-form-item>
        <el-form-item label="是否续签">
          <el-select v-model="table.parms.signType" placeholder="请选择">
            <el-option
              v-for="item in signTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成交人">
          <el-select placeholder="请选择" v-model="table.parms.paymentWay">
            <el-option
              v-for="item in payTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-select placeholder="请选择" v-model="table.parms.paymentWay">
            <el-option
              v-for="item in payTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="currentChange(1)">查 询</el-button>
          <el-button type="primary" @click="newLedger()">新建租赁合同</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      ref="mtable"
      :hasIndex="true"
      :hasPaginationSizes="true"
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      :notChangeRow="notChangeRow"
      @currentChange="currentChange"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
      @dblhandleCurrentChange="dblhandleCurrentChange"
    >
      <el-table-column label="操作" width="300px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" 
            style="color: red" 
            @click="toDelate(scope.row.leaseId)"
            :disabled="(scope.row.isBroker !== 0) || (scope.row.isShopowner !== 0) || (scope.row.isManager !== 0) || (scope.row.isAudit !== 0)"
            >删除</el-button>
          <el-button type="text" 
            @click="editContract(scope.row)"
            v-if="scope.row.status!==0"
            :disabled="(scope.row.isBroker !== 0) || (scope.row.isShopowner !== 0) || (scope.row.isManager !== 0) || (scope.row.isAudit !== 0)"
            >修改</el-button>
          <el-button type="text" 
            @click="showChangeContract(scope.row.leaseId)"
            v-if="scope.row.status!==0"
            :disabled="(scope.row.isBroker !== 0) || (scope.row.isShopowner !== 0) || (scope.row.isManager !== 0) || (scope.row.isAudit !== 0)"
            >变更合同</el-button>
          <el-button type="text" 
            @click="addBill(scope.row)"
            >添加账单</el-button>
          <el-button type="text" 
            @click="toStop(scope.row)"
            v-if="scope.row.status!==0"
            >作废</el-button>
        </template>
      </el-table-column>
    </m-table>

    <!-- 变更合同changeContract-->
    <change-contract
      v-if="isShowChangeContract"
      ref="changeContract"
      :id="activeChangeContractId"
      @close="closeChangeContract"
    ></change-contract>
    <!-- 变更合同END -->

    <!-- 作废弹框 -->
    <el-dialog
      title="合同作废"
      :visible.sync="dialogVisible3"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="500px"
    >
      <el-form label-width="70px" size="small">
        <el-form-item label="作废原因">
          <el-input
            v-model="stopReson"
            type="textarea"
            :rows="5"
            size="small"
            style="width: 350px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" type="primary" @click="submitStop">保 存</el-button>
        <el-button size="mini" @click="cancelStop">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 作废弹框END -->

    <!-- 新建/修改租赁合同（台账，业主） -->
    <m-detail
      v-if="visible"
      :visible.sync="visible"
      :type="detailType"
      :leaseNo="leaseNo"
      :id="activeChangeContractId"
      @update="currentChange"
      @close="closeContract"
    ></m-detail>
    <!-- 新建/修改租赁合同END -->

    <!-- 添加账单 -->
    <el-dialog
      title="添加账单"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="350px"
    >
      <el-form label-width="70px" size="small">
        <el-form-item label="类型">
          <el-input class="minput" value="预收" style="width: 220px;" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" style="width: 220px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="金额">
          <el-input class="minput" placeholder="请输入金额" style="width: 220px;"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="5" size="small" style="width: 220px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" type="primary" @click="submitAddBill">确 认</el-button>
        <el-button size="mini" @click="dialogVisible2=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加账单END -->
  </div>
</template>

<script>
import moment from "moment";
import MTable from "@/components/Table";
import MDetail from "./detail";
import MCascader from "@/components/department/mcascader";
import ChangeContract from "./changeContract";
import {
  getLeaseByPage,
  cancelLease,
  deleteLease,
  brokerAudit,
  shopownerAudit,
  managerAudit,
  financialAudit,
  findByLeaseNo
} from "@/api/org-leaseContract";
export default {
  components: {
    MTable,
    MDetail,
    MCascader,
    ChangeContract
  },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.table.parms.endTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.beginTime;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      permissions: {
        broker: false,
        storeManager: false,
        finance: false,
        manager: false
      },
      approve:{
        isBroker: 5,
        isShopowner: 5,
        isManager: 5,
        isAudit: 5,
        isFlow: 0
      },
      stopLeaseId: "", // 作废合同id
      stopReson: "", // 作废原因
      activeChangeContractId: "", // 当前选择的租赁合同id
      isShowChangeContract: false,
      dialogVisible2: false,
      dialogVisible3: false,
      detailType: "add",
      leaseNo: "",
      table: {
        loading: false,
        list: [],
        setting: [
          {
            label: "合同状态",
            value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue == -1
                ? "删除"
                : cellValue == 0
                ? "作废"
                : cellValue == 1
                ? "生效"
                : "到期";
            }
          },
          {
            label: "合同编号",
            value: "leaseNo"
          },
          {
            label: "签约日期",
            value: "signTime"
          },
          {
            label: "台账编号",
            value: "accountNo"
          },
          {
            label: "主成交人",
            value: "masterDealer"
          },
          {
            label: "副成交人",
            value: "slaveDealer"
          },
          {
            label: "台账主经纪人",
            value: "masterBroker"
          },
          {
            label: "台账门店",
            value: "storeName"
          },
          {
            label: "合同地址",
            value: "address"
          },
          {
            label: "合同日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return `${row.startTime}至${row.endTime}`;
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
            label: "付款方式",
            value: "paymentWay"
          },
          {
            label: "租户姓名",
            value: "memberName"
          },
          {
            label: "经纪人确认",
            value: "isBroker",
            formatter(row, column, cellValue, index) {
              return cellValue === 0
                ? "未审核"
                : cellValue === 1
                ? "已审核"
                : " 取消审核";
            }
          },
          {
            label: "经纪人",
            value: "masterBroker"
          },
          {
            label: "店长确认",
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
            label: "经理确认",
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
            label: "财务确认",
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
          },
          {
            label: "合同总计",
            value: "totalIncome"
          },
          {
            label: "租金总计",
            value: "totalRent"
          },
          {
            label: "首次费用",
            value: "firstPric"
          },
          {
            label: "录入时间",
            value: "createTime"
          },
          {
            label: "录入人",
            value: "createUser"
          },
          {
            label: "签约状态",
            value: "signType",
            formatter(row, column, cellValue, index) {
              return cellValue == 0 ? "新签" : "续签";
            }
          },
          {
            label: "作废人员",
            value: "abolition"
          },
          {
            label: "作废原因",
            value: "reason"
          },
          {
            label: "作废日期",
            value: "updatetime"
          },
          {
            label: "系统编号",
            value: "leaseSysNo"
          }
        ],
        parms: {
          companyId: "", //公司ID
          storeId: "", //门店ID
          masterBroker: "", //经纪人
          status: 1, // 合同状态
          accountNo: "", //台账编号
          memberName: "", //租户姓名
          agencyNo: "", //合同编号
          buildingName: "",
          beginTime: "",
          endTime: "",
          paymentWay: "", //付款方式
          address: "", //楼盘
          signType: "", //是否签约
        },
        total: 10,
        page: 1,
        rows: 10
      },
      signTypes: [
        { value: "", label: "所有项" },
        { value: 0, label: "新签" },
        { value: 1, label: "续签" }
      ],
      contractTypes: [{ value: 1, label: "有效" }, { value: 0, label: "作废" }],
      payTypes: [
        { value: "", label: "所有项" },
        { value: 0, label: "季付" },
        { value: 1, label: "半年付" },
        { value: 2, label: "一年付" },
        { value: 3, label: "月付" },
        { value: 4, label: "全付" },
        { value: 5, label: "两月付" }
      ],
      visible: false,
      currentRow: '',
      notChangeRow: false
    };
  },
  watch: {
    "table.parms.beginTime"(val) {
      if (val) {
        this.table.parms.beginTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.beginTime = "";
      }
    },
    "table.parms.endTime"(val) {
      if (val) {
        this.table.parms.endTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.endTime = ""
      }
    }
  },
  methods: {
    /**
     * 双击查看
    */
    dblhandleCurrentChange(ele){
      this.detailType = 'look'
      this.activeChangeContractId = ele.leaseId;
      this.leaseNo = ele.leaseNo;
      this.visible = false;
      if (!this.visible) {
        this.visible = true;
      }
    },
    handleCurrentChange(val){ //单选
      if(!val) return
      findByLeaseNo(val.leaseSysNo).then(res => {
        let { code, body } = res;
        this.approve = val
        if (body) {
          this.approve.isFlow = 1;
        }
      })
      this.currentRow = val
    },
    showChangeContract(id) {
      this.isShowChangeContract = true;
      this.activeChangeContractId = id;
      this.$nextTick(function() {
        this.$refs.changeContract.show()
      })
    },
    /*
     * 添加账单
     */
    addBill(val) {
      this.dialogVisible2 = true
    },
    /*
     * 提交添加账单接口
     */
    submitAddBill() {
      this.dialogVisible2 = false
    },
    // 设置显示页数
    handleSizeChange(val) {
      this.currentChange(1, val)
    },
    /*
     * 获取租赁合同Table数据
     */
    currentChange(val, totalNum) {
      this.approve  ={
        isBroker: 5,
        isShopowner: 5,
        isManager: 5,
        isAudit: 5,
        isFlow: 0
      }
      if (val || val === 0) {
        this.table.page = val;
      }
      if (totalNum || totalNum === 0) {
        this.table.rows = totalNum;
      }
      let { page, rows, parms } = this.table;
      getLeaseByPage({ ...parms, page, rows }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.table.list = body.rows;
          this.table.total = body.total
          this.$nextTick(() => {
            this.notChangeRow = true
            if (!this.currentRow)  {
              console.log('this.currentRow is null')
              return
            }
            this.$refs.mtable.setCurrentRow(this.table.list.find(d => d.leaseId === this.currentRow.leaseId))
          })
        }else {
          this.table.total = 0
        }
      });
    },
    /*
     * 新建租赁合同
     */
    newLedger() {
      this.detailType = 'add'
      this.visible = false;
      if (!this.visible) {
        this.visible = true;
      }
    },
    /*
     * 修改租赁合同
     */
    editContract(ele) {
      this.detailType = "edit";
      this.activeChangeContractId = ele.leaseId;
      this.leaseNo = ele.leaseNo;
      this.visible = false;
      if (!this.visible) {
        this.visible = true;
      }
      // this.$router.push({name: 'editAgencyContract',params:{id:1}})
    },
    /*
     * 作废租赁合同
     */
    toStop(val) {
      this.dialogVisible3 = true;
      this.stopLeaseId = val.leaseId;
      this.leaseNo = val.leaseNo
    },
    /**
     * 提交作废
     */
    submitStop() {
      if (this.stopReson === "") {
        this.$message({
          type: "warning",
          message: "请输入作废理由!"
        });
        return;
      }
      cancelLease({
        leaseId: this.stopLeaseId,
        leaseNo: this.leaseNo,
        reason: this.stopReson,
        status: 0
      })
        .then(res => {
          if (res.code == 1000) {
            this.$message({
              type: "success",
              message: "作废成功!"
            });
            this.currentChange();
            this.cancelStop();
          } else {
            this.$message({
              type: "error",
              message: "作废失败!"
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.$message({
            type: "error",
            message: "作废失败!"
          });
        });
    },
    /**
     * 取消作废
     */
    cancelStop() {
      this.dialogVisible3 = false;
      this.stopLeaseId = "";
      this.stopReson = "";
    },
    /*
     * 删除租赁合同
     */
    toDelate(leaseId) {
      this.$confirm("此操作将删除该合同, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteLease({ leaseId }).then(res => {
            if (res.code == 1000) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.currentChange();
            } else {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    closeContract() {
      this.visible = false;
    },
    closeChangeContract() {
      this.isShowChangeContract = false;
      // this.$nextTick(function() {
        // this.$refs.changeContract.close();
      // });
    },
    /*
    * 经纪人，店长，经理，财务四级审核
    */
    auditor(val1, val2) {
      //审批
      switch (val1) {
        case 1: //经纪人
          if (!val2) this.open2("提交经纪人审核申请", val1, val2);
          else this.open2("撤销经纪人审核申请", val1, val2);
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
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          switch (type) {
            case 1:
              const params1 = {
                isBroker: status ? 0 : 1,
                isAudit: this.approve.isAudit,
                isManager: this.approve.isManager,
                isShopowner: this.approve.isShopowner,
                leaseIds: [this.approve.leaseId]
              };
              // 请使用合同支出的审核接口（下同）
              brokerAudit(params1).then(res => {
                this.currentChange();
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              });
              break;
            case 2:
              const params2 = {
                isBroker: this.approve.isBroker,
                isAudit: this.approve.isAudit,
                isManager: this.approve.isManager,
                isShopowner: status ? 0 : 1,
                leaseIds: [this.approve.leaseId]
              };
              if (this.approve.isBroker !== 1) {
                this.$message({
                  type: "error",
                  message: "请先进行经纪人审核!"
                });
                return;
              }
              // 请使用合同支出的审核接口（下同）
              shopownerAudit(params2).then(res => {
                this.currentChange();
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              });
              break;
            case 3:
              const params3 = {
                isBroker: this.approve.isBroker,
                isAudit: this.approve.isAudit,
                isManager: status ? 0 : 1,
                isShopowner: this.approve.isShopowner,
                leaseIds: [this.approve.leaseId]
              };
              if (this.approve.isShopowner !== 1) {
                this.$message({
                  type: "error",
                  message: "请先进行店长审核!"
                });
                return;
              }
              managerAudit(params3).then(res => {
                this.currentChange();
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              });
              break;
            case 4:
              const params4 = {
                isBroker: this.approve.isBroker,
                isAudit: status ? 0 : 1,
                isManager: this.approve.isManager,
                isShopowner: this.approve.isShopowner,
                leaseIds: [this.approve.leaseId]
              };
              if (this.approve.isManager !== 1) {
                this.$message({
                  type: "error",
                  message: "请先进行经理审核!"
                });
                return;
              }
              financialAudit(params4).then(res => {
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
    }
  },
  mounted() {
    this.currentChange(1);
    if (this.$store.getters.userinfo) {
      // 在不同的地方调用方法的时候，这个变量的的类型是不一样的，JSON.parse()里的参数只能是string类型
      const userinfo = typeof this.$store.getters.userinfo == 'string' ? JSON.parse(this.$store.getters.userinfo) : this.$store.getters.userinfo;
      // console.log("userinfo=====",userinfo);
      
      /*
      * broker   经纪人
      * storeManager   店长
      * manager   经理
      * finance   财务
      */
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
</style>
