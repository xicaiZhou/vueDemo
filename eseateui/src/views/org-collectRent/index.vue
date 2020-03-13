<template>
<!-- 预付房租模块 -->
  <div class="mContainer">
    <div class="contorl">
      <el-button type="primary" size="mini" v-if="permissions.broker" :disabled="((approve.agencyStatus == 0 || approve.isFlow == 1 || approve.isBroker == 5 || approve.isBroker == 1 || approve.isShopowner == 1 || approve.isManager == 1 || approve.isAudit == 1) ? true  : false)" @click="auditor(1,0)">经纪人审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.broker" :disabled="((approve.agencyStatus == 0 || approve.isFlow == 1 || approve.isBroker == 5 || approve.isBroker == 0 || approve.isShopowner == 1 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)" @click="auditor(1,1)">撤销审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.agencyStatus == 0 || approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 1 || approve.isManager == 1 || approve.isAudit == 1) ? true  : false)" @click="auditor(2,0)">门店审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.agencyStatus == 0 || approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 0 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)" @click="auditor(2,1)">撤销门店审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.manager" :disabled="((approve.agencyStatus == 0 || approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)" @click="auditor(3,0)">经理审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.manager" :disabled="((approve.agencyStatus == 0 || approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 0 || approve.isAudit == 1) ?  true : false)" @click="auditor(3,1)">撤销经理审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.agencyStatus == 0 || approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 1) ?  true : false)" @click="auditor(4,0)">财务审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.agencyStatus == 0 || approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 0 || approve.status == 1) ?  true : false)" @click="auditor(4,1)">撤销财务审核</el-button>
    </div>
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
        <m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
        <el-form-item label="业主姓名">
          <el-input class="minput" placeholder="请输入业主姓名" v-model="table.parms.name"></el-input>
        </el-form-item>
        <el-form-item label="楼 盘">
          <el-select placeholder="请选择" v-model="table.parms.buildingId">
            <el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号">
          <el-input class="minput" placeholder="请输入门牌号" v-model="table.parms.familyId"></el-input>
        </el-form-item>
        <el-form-item label="楼盘名称">
          <el-input class="minput" v-model="table.parms.buildingName" placeholder="请输入楼盘名称"></el-input>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input class="minput" placeholder="请输入台账编号" v-model="table.parms.accountNo"></el-input>
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input class="minput" placeholder="请输入合同编号" v-model="table.parms.agencyNo"></el-input>
        </el-form-item>
        <el-form-item label="合同状态">
          <el-select placeholder="请选择" v-model="table.parms.agencyStatus">
            <el-option v-for="item in contractStatuses" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="预付状态">
          <el-select placeholder="请选择" v-model="table.parms.isAbolition">
            <el-option v-for="item in contractStatuses" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
         </el-form-item>
        <el-form-item label="经纪人">
          <el-input class="minput" placeholder="请输入经纪人" v-model="table.parms.masterBroker"></el-input>
        </el-form-item>
        <el-form-item label="预付日期">
          <el-date-picker
            v-model="table.parms.prepaidStartDate"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart">
          </el-date-picker>
          至
          <el-date-picker
            v-model="table.parms.prepaidEndDate"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsEnd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实付日期">
          <el-date-picker
            v-model="table.parms.acturalStartDate"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart1">
          </el-date-picker>
          至
          <el-date-picker
            v-model="table.parms.acturalEndDate"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsEnd2">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="付款状态">
          <el-select placeholder="请选择" v-model="table.parms.status">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="currentChange(0)">查 询</el-button>
          <el-button 
            v-if="this.approve.status === 0 || this.approve.status === 2" 
            @click="changeClick(approve, 1)" 
            :disabled="((this.approve.isBroker === 1) && (this.approve.isShopowner === 1) && (this.approve.isManager === 1) && (this.approve.isAudit === 1 && (this.approve.isFlow !==1)))?false:true"
            type="success" 
            size="small">确认付款</el-button>
          <el-button 
            v-else-if="this.approve.status === 1"
            @click="changeClick(approve, 2)" 
            :disabled="this.approve.isFlow !==1 || this.approve.agencyStatus !==0?false:true"
            type="success" 
            size="small">撤销付款</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      ref="mtable"
      :data="table.list"
      :hasPaginationSizes="true"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      :notChangeRow="notChangeRow"
      :showSummary="true"
      :summaryMethod="summaryMethod"
      @currentChange="currentChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-table-column label="操作" width="220px" fixed="right">
        <template slot-scope="scope">
          <el-button 
            type="text" 
            @click="toDetail(scope.row)" 
            size="small">预付详情</el-button>
          <el-button 
            @click="addDescClick(scope.row)" 
            :disabled="(scope.row.isBroker !== 0) || (scope.row.isShopowner !== 0) || (scope.row.isManager !== 0) || (scope.row.isAudit !== 0)"
            type="text"
            size="small">添加备注</el-button>
          <el-button v-if="scope.row.isAbolition == 1" @click="abolitionClick(scope.row)" :disabled="(scope.row.status == 1 || scope.row.agencyStatus == 0) ? true : false" type="text" size="small">预付作废</el-button>
          <el-button v-else @click="abolitionClick(scope.row)" :disabled="(scope.row.status == 1 || scope.row.agencyStatus == 0) ? true : false" type="text" size="small">撤销作废</el-button>
        </template>
      </el-table-column>
    </m-table>
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
    <!-- 预付详情 -->
    <el-dialog
      title="付款详情"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="850px">
        <el-form label-width="90px" :inline="true" size="small" :disabled="true">
          <el-form-item label="类 型">
            <el-input class="minput" :value="detailsDic.type == 1 ? '收入' : '支出'"></el-input>
          </el-form-item>
          <el-form-item label="分 类">
            <el-input class="minput" :value="detailsDic.classification"></el-input>
          </el-form-item>
          <h5>合 同</h5>
          <el-form-item label="合同编号">
            <el-input class="minput" :value="detailsDic.agencyNo"></el-input>
          </el-form-item>
          <el-form-item label="台账编号">
            <el-input class="minput" :value="detailsDic.accountNo"></el-input>
          </el-form-item>
          <el-form-item label="房源编号">
            <el-input class="minput"></el-input>
          </el-form-item>
          <el-form-item label="房源地址">
            <el-input class="minput" :value="detailsDic.address" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="经纪人">
            <el-select placeholder="请选择" :value="detailsDic.masterBroker"></el-select>
          </el-form-item>
          <h5>业 主</h5>
          <el-form-item label="业主姓名">
            <el-input class="minput" :value="detailsDic.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input class="minput" :value="detailsDic.identity"></el-input>
          </el-form-item>
          <el-form-item label="手 机">
            <el-input class="minput" :value="detailsDic.phoneNo"></el-input>
          </el-form-item>
          <el-form-item label="电 话">
            <el-input class="minput" :value="detailsDic.telephone"></el-input>
          </el-form-item>
          <el-form-item label="开户银行">
            <el-input class="minput" :value="detailsDic.bankName"></el-input>
          </el-form-item>
          <el-form-item label="账户名称">
            <el-input class="minput" :value="detailsDic.bankUserName"></el-input>
          </el-form-item>
          <el-form-item label="银行卡号">
            <el-input class="minput" :value="detailsDic.bankCardNo"></el-input>
          </el-form-item>
          <h5>预 付</h5>
          <el-form-item label="预付日期">
            <el-input class="minput" :value="detailsDic.prepaidDate"></el-input>
          </el-form-item>
          <el-form-item label="预付金额">
            <el-input class="minput" :value="detailsDic.prepaidAmount"></el-input>
          </el-form-item>
          <el-form-item label="房租日期">
            <el-input class="minput" :value="detailsDic.startTime"></el-input> 至
            <el-input class="minput" :value="detailsDic.endTime"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input class="bInput" type="textarea" :value="detailsDic.remarks"></el-input>
          </el-form-item>
          <h5>审 核</h5>
          <m-table :hasIndex="false" :hasPagination="false" :data="tableAudit.list" :setting="tableAudit.setting"></m-table>
        </el-form>
    </el-dialog>
    <!-- 预付详情END -->

    <!-- 添加备注 -->
    <el-dialog width="550px" title="备注留言" 
      :visible.sync="dialogTableVisible1"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false">
      <el-form label-width="0px" size="small" :inline="true">
        <el-form-item>
          <el-button size="small" type="primary" @click="openDesc">管理备注汇总</el-button>
        </el-form-item>
        <el-form-item>
          <el-input style="width: 500px;" type="textarea" :rows="4" placeholder="请输入备注" v-model="remarkForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button size="small" type="primary" @click="handleSubmit(1)">提 交</el-button>
        <el-button size="small" @click="dialogTableVisible1 = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加备注END -->


    <!-- 编辑备注 -->
    <el-dialog width="550px" title="备注编辑" 
      :visible.sync="dialogTableVisible2"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <h5>备注明细</h5>
      <br>
      <m-table
        :data="tableDesc.list"
        :setting="tableDesc.setting"
        :loading="tableDesc.loading"
        :total="tableDesc.total"
        :pageNum="table.page"
        :pageSize="table.rows"
      >
        <el-table-column label="操作" width="90px" fixed="right">
          <template slot-scope="scope">
            <el-button @click="editDesc(scope.row)" type="text" size="small">修改</el-button>
            <el-button @click="deleteDesc(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </m-table>
    </el-dialog>
    <!-- 编辑备注END -->

    <!-- 修改备注 -->
    <el-dialog width="550px" title="修改备注" 
      :visible.sync="dialogTableVisible3"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false">
      <el-form label-width="0px" size="small" :inline="true">
        <el-form-item>
          <el-input style="width: 500px;" type="textarea" :rows="4" placeholder="请输入备注" v-model="remarkForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button size="small" type="primary" @click="handleSubmit(2)">提 交</el-button>
        <el-button size="small" @click="dialogTableVisible3 = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改备注END -->

  </div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'
import MCascader from "@/components/department/mcascader";
import {
  buildingFindAll
} from "@/api/org-house";
import { 
  getAgencyCostByPage, 
  payConfirm, 
  brokerAudit,
  shopownerAudit,
  managerAudit,
  financialAudit,
  remarkSave,
  remarkUpdate,
  remarkListById,
  remarkDeleteById, abolition } from "@/api/org-agencyCostDetail";

import { findFlowDetailPage } from "@/api/org-tempAccount";

export default {
  components: {
    MTable,
    MCascader
  },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.table.parms.prepaidEndDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.prepaidStartDate;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      pickerOptionsStart1: {
        disabledDate: time => {
          let endDateVal = this.table.parms.acturalEndDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd2: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.acturalStartDate;
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
        allStatus: false,
        isFlow: 0,// 0是没有流水凭证，1是有
      },
      table: {
        loading:false,
        list: [],
        setting: [
          {
            label: "台账编号",
            value: "accountNo"
          },
          {
            label: "合同编号",
            value: "agencyNo"
          },
          {
            label: "合同状态",
            value: "agencyStatus",
            formatter(row, column, cellValue, index) {
              return cellValue === 0 ? '作废' : '有效';
            }
          },
          {
            label: "预付状态",
            value: "isAbolition",
            formatter(row, column, cellValue, index) {
              return cellValue === 0 ? '作废' : '有效';
            }
          },
          {
            label: "分类",
            value: "classification"
          },
          {
            label: "台账门店",
            value: "storeName",
            width: 120
          },
          {
            label: "台账经济人",
            value: "masterBroker"
          },
          {
            label: "房源地址",
            value: "address",
            width: 200
          },
          {
            label: "预付日期",
            value: "prepaidDate",
            width: 120
          },
          {
            label: "预付金额",
            value: "prepaidAmount"
          },
          {
            label: "备注",
            value: "remarks",
            width: 300
          },
          {
            label: "付款状态",
            value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue == 1 ? '已付款' : '未付款';
            }
          },
          {
            label: "ID",
            value: "agencyCostDetailId"
          },
          {
            label: "类型",
            value: "type",
            formatter(row, column, cellValue, index) {
              return cellValue == 1 ? '收入' : '支出';
            }
          },
          {
            label: "业主姓名",
            value: "name"
          },
          {
            label: "业主手机号",
            value: "phoneNo",
            width: 120
          },
          {
            label: "业主电话",
            value: "telephone",
            width: 120
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
            label: "房租日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return `${row.startTime}至${row.endTime}`;
            },
            width: 200
          },
          {
            label: "实付日期",
            value: "acturalDate",
            width: 120
          },
          {
            label: "实付金额",
            value: "acturalAmount"
          },
          {
            label: "作废人",
            value: "abolition"
          },
          {
            label: "作废时间",
            value: "abolitionTime"
          }
        ],
        parms: {
          familyId: "",
          buildingId: "",
          buildingName: "",
          companyId: "",
          storeId: "",
          accountNo: "",
          acturalEndDate: "",
          acturalStartDate: "",
          agencyNo: "",
          agencyStatus: 1,//合同状态
          isAbolition: 1,//预付状态
          masterBroker: "",
          name: "",
          prepaidEndDate: "",
          prepaidStartDate: "",
          status: 0
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
      tableDesc: {
        loading:false,
        list: [],
        setting: [
          {
            label: "留言人",
            value: "createUser"
          },
          {
            label: "留言内容",
            value: "remark"
          },
          {
            label: "留言时间",
            value: "createTime"
          }
        ],
        parms: {
          
        },
        total: 10,
        page: 1,
        rows: 10
      },
      tableAudit: {
        list: [],
        setting: [
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
          }
        ]
      },
      remarkForm:{
        agencyCostDetailId: "",
        id: "",
        remark: ""
      },
      contractStatuses: [{ value: "", label: "全部" }, { value: 1, label: "有效" }, { value: 0, label: "作废" }],
      statusOptions: [{ value: "", label: "全部" }, { value: 1, label: "已付款" }, { value: 0, label: "未付款" }],
      buildings: [{ name: "所有项", id: "" , address: ""}],
      detailsDic: {},
      dialogTableVisible: false,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      currentRow: '',
      notChangeRow: false
    };
  },
  watch: {
    "table.parms.prepaidStartDate"(val) {
      if (val) {
        this.table.parms.prepaidStartDate = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.prepaidStartDate = ""
      }
    },
    "table.parms.prepaidEndDate"(val) {
      if (val) {
        this.table.parms.prepaidEndDate = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.prepaidEndDate = ""
      }
    },
    "table.parms.acturalStartDate"(val) {
      if (val) {
        this.table.parms.acturalStartDate = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.acturalStartDate = ""
      }
    },
    "table.parms.acturalEndDate"(val) {
      if (val) {
        this.table.parms.acturalEndDate = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.acturalEndDate = ""
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
      this.approve  ={
        isBroker: 5,
        isShopowner: 5,
        isManager: 5,
        isAudit: 5,
        isFlow: 0,
        allStatus: false
      }
      if (val || val === 0) {
        this.table.page = val;
      }
      if (totalNum || totalNum === 0) {
        this.table.rows = totalNum;
      }
      let { page, rows, parms } = this.table;
      getAgencyCostByPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          if (body.rows == undefined) {
            this.approve.status = undefined
          }
          if(body.rows != undefined) {
            this.table.list = body.rows
            this.table.total = body.total;
            this.$nextTick(() => {
              this.notChangeRow = true
              if (!this.currentRow)  {
                console.log('this.currentRow is null')
                return
              }
              this.$refs.mtable.setCurrentRow(this.table.list.find(d => d.agencyCostDetailId === this.currentRow.agencyCostDetailId))
            })
          }else {
            this.approve.isFlow = 1
            this.table.list = []
            this.table.total = 0;
          }
        }
      });
    },
    handleCurrentChange(val){ //单选
      if(!val) return
      this.approve = val
      this.approve.allStatus = true
      this.table2.parms = {
        companyId: val.companyId,
        storeId: val.storeId,
        budgetNo: val.agencyCostDetailNo
      }
      this.$nextTick(() => {
        this.flowDetails(1);
      })
      this.currentRow = val
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
                this.approve.isFlow = 0
              }
            })
          }else {
            this.approve.isFlow = 0
          }
          this.table2.total = body.total;
        }
      });
    },
    /**
     * 预览详情
    */
    toDetail(ele) {
      this.dialogTableVisible = true;
      this.detailsDic = { ...ele };
      this.tableAudit.list = [{ ...ele }];
    },
    /**
     * 添加备注
    */
    addDescClick(val) {
      this.tableDesc.list = [];
      this.dialogTableVisible1 = true
      this.remarkForm = {
        agencyCostDetailId: val.agencyCostDetailId,
        id: val.id,
        remark: val.remark
      }
    },
    /**
     * 提交备注
     * index 1 是添加备注（新增）
     * index 2 是修改备注（修改）
    */
    handleSubmit(index) {
      if (index === 1) {
        remarkSave(this.remarkForm).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              message: "备注成功",
              type: "success"
            });
            this.currentChange(1);
            this.dialogTableVisible1 = false;
          }else {
            this.$message({
              message: "备注失败",
              type: "error"
            });
          }
        }).catch(error => {
          this.$message({
            message: err,
            type: "error"
          });
        })
      }else {
        remarkUpdate(this.remarkForm).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              message: "修改备注成功",
              type: "success"
            });
            this.getRemarkList();
            this.dialogTableVisible3 = false;
          }else {
            this.$message({
              message: "修改备注失败",
              type: "error"
            });
          }
        }).catch(error => {
          this.$message({
            message: err,
            type: "error"
          });
        })
      }
    },
    /**
     * 修改备注
    */
    editDesc(val){
      this.dialogTableVisible3 = true
      this.remarkForm = {
        agencyCostDetailId: val.agencyCostDetailId,
        id: val.id,
        remark: val.remark
      }
    },
    /**
     * 删除备注
    */
    deleteDesc(val){
      remarkDeleteById(val.id).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.tableDesc.list = body;
          this.$message({
            message: "删除备注成功",
            type: "success"
          });
          this.getRemarkList();
        }else {
          this.$message({
            message: "删除备注失败",
            type: "error"
          });
        }
      })
    },
    /**
     * 打开(管理)备注汇总
    */
    openDesc() {
      this.dialogTableVisible2 = true
      this.getRemarkList()
    },
    /**
     * 查询备注列表 
    */
    getRemarkList() {
      remarkListById(this.remarkForm.agencyCostDetailId).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.tableDesc.list = body;
          this.$message({
            message: "查询备注成功",
            type: "success"
          });
        }else {
          this.$message({
            message: "查询备注失败",
            type: "error"
          });
        }
      })
    },
    /**
     * 确认付款
    */
    changeClick(val, status) {
      let params = {
        agencyCostDetailId : val.agencyCostDetailId,
        status: status,
        acturalAmount: status == 1 ? val.prepaidAmount : 0
      }
      if (this.approve.isFlow == 1 || val.agencyStatus == 0) {
        this.$message({
          type: "error",
          message: status == 1 ? "不能付款" : "不能撤销"
        });
      }else {
          payConfirm(params).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              type: "success",
              message: status == 1 ? "付款成功!" : "撤销成功!"
            });
            this.currentChange(1);
          }else {
            this.$message({
              type: "error",
              message: status == 1 ? "付款失败" : "撤销失败"
            });
          }
        })
      }
      
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
      if (!this.approve.allStatus) {
        this.$message({
          type: "error",
          message: "请先选择对应合同"
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
              const params1 = {
                isBroker: status ? 0 : 1,
                isAudit: this.approve.isAudit,
                isManager: this.approve.isManager,
                isShopowner: this.approve.isShopowner,
                agencyCostDetailIds: [this.approve.agencyCostDetailId]
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
                agencyCostDetailIds: [this.approve.agencyCostDetailId]
              };
              if (this.approve.isBroker !== 1) {
                this.$message({
                  type: "error",
                  message: "请先进行经纪人审核"
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
                agencyCostDetailIds: [this.approve.agencyCostDetailId]
              };
              if (this.approve.isShopowner !== 1) {
                this.$message({
                  type: "error",
                  message: "请先进行店长审核"
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
                agencyCostDetailIds: [this.approve.agencyCostDetailId]
              };
              if (this.approve.isShopowner !== 1) {
                this.$message({
                  type: "error",
                  message: "请先进行经理审核"
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
    },
    /**
     * 查询楼盘
    */
    buildingFind1(regionQs = "") {
      buildingFindAll({ regionQs }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          console.log("body=====",body)
          this.buildings = [
            { name: "所有项", id: "" },
            ...body.map(item => {
              return { ...item, id: Number(item.id), address: String(item.address) };
            })
          ];
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
    },
    /**
     * 预收作废
    */
    abolitionClick(val) {
      let param = {isAbolition: val.isAbolition == 0 ? 1 : 0, agencyCostDetailId: val.agencyCostDetailId}
      abolition(param).then(res => {
        let { code, body } = res
        if (code == 1000) {
          this.$message({
            message: val.isAbolition == 0 ? "撤销作废成功" : "预付作废成功",
            type: "success"
          });
          this.currentChange();
        }else {
          this.$message({
            message: val.isAbolition == 0 ? "撤销作废失败" : "预付作废失败",
            type: "error"
          });
        }
      })
    },
    /**
     * 求和
    */
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((c, index) => {
        if (index === 0) {
          sums[index] = '金额合计'
        } else if (index === 10) {
          let sum = 0
          data.forEach(d => {
            if (d.prepaidAmount != undefined) {
              sum += d.prepaidAmount
            }
          })
          sums[index] = sum
        } else if (index === 28) {
          let sum = 0
          data.forEach(d => {
            if (d.acturalAmount != undefined) {
              sum += d.acturalAmount
            }
          })
          sums[index] = sum
        }else {
          sums[index] = ''
        }
      })
      return sums
    }
  },
  mounted () {
    this.table.parms.prepaidStartDate = "2010-01-01";
    this.table.parms.prepaidEndDate = this.timeDefault(15);
    // this.prepaidDate = ["2010-01-01",this.timeDefault(15)];

    this.currentChange(1);
    this.buildingFind1();
    if (this.$store.getters.userinfo) {
      // 在不同的地方调用方法的时候，这个变量的的类型是不一样的，JSON.parse()里的参数只能是string类型
      const userinfo = typeof this.$store.getters.userinfo == 'string' ? JSON.parse(this.$store.getters.userinfo) : this.$store.getters.userinfo;
      /*
      * broker   经纪人    storeManager   店长    manager   经理    finance   财务
      */
      this.permissions = userinfo.permissions
    }
  },
};
</script>

<style>
.mContainer .el-table__body tr.current-row>td {
	background-color: #ffec8b !important;
}
</style>
<style scoped>
.contorl{
  padding: 20px 0;
  text-align: center;
}
h5{
  font-size: 16px;
  margin-bottom: 10px;
}
.bInput{
  width: 500px;
}
</style>
