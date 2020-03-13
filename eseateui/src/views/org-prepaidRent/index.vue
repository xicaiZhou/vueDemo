<template>
<!-- 预收房租模块 -->
  <div class="mContainer">
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
        <m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
        <el-form-item label="合同编号">
          <el-input class="minput" placeholder="请输入合同编号" v-model="table.parms.leaseNo"></el-input>
        </el-form-item>
        <el-form-item label="合同状态">
          <el-select placeholder="请选择" v-model="table.parms.leaseStatus">
            <el-option v-for="item in contractStatuses" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼盘名称">
          <el-input class="minput" v-model="table.parms.buildingName" placeholder="请输入楼盘名称"></el-input>
        </el-form-item>
         <el-form-item label="预收状态">
          <el-select placeholder="请选择" v-model="table.parms.isAbolition">
            <el-option v-for="item in contractStatuses" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
         </el-form-item>
        <el-form-item label="楼 盘">
          <el-select placeholder="请选择" v-model="table.parms.buildingId">
            <el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号">
          <el-input class="minput" placeholder="请输入门牌号" v-model="table.parms.familyId"></el-input>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input class="minput" placeholder="请输入台账编号" v-model="table.parms.accountNo"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input class="minput" placeholder="请输入客户姓名" v-model="table.parms.name"></el-input>
        </el-form-item>
        <el-form-item label="经济人">
          <el-input class="minput" placeholder="请输入客户姓名" v-model="table.parms.masterBroker"></el-input>
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input class="minput" placeholder="请输入客户姓名" v-model="table.parms.phoneNo"></el-input>
        </el-form-item>
        <el-form-item label="门锁类型">
          <el-select placeholder="请选择" v-model="table.parms.lockType">
            <el-option v-for="(item, i) in lockTypes" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预收日期">
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

        <el-form-item label="实收日期">
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
          <el-button type="primary" @click="currentChange(1)">查 询</el-button>
          <el-button v-if="flowDetailsData.status === 0 || flowDetailsData.status === 2" :disabled="isFlow==1?true:false" @click="changeClick(flowDetailsData, 1)" type="primary" size="small">确认收款</el-button>
          <el-button v-else-if="flowDetailsData.status === 1" @click="changeClick(flowDetailsData, 2)" :disabled="isFlow==1?true:false" type="primary" size="small">撤销收款</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      :hasPaginationSizes="true"
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      :showSummary="true"
      :summaryMethod="summaryMethod"
      @currentChange="currentChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-table-column label="操作" width="220px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="toDetail(scope.row)" size="small">预收详情</el-button>
          <el-button @click="addDescClick(scope.row)" type="text" size="small">添加备注</el-button>
          <el-button v-if="scope.row.isAbolition == 1" @click="abolitionClick(scope.row)" :disabled="(scope.row.status == 1 || scope.row.leaseStatus == 0) ? true : false" type="text" size="small">预收作废</el-button>
          <el-button v-else @click="abolitionClick(scope.row)" :disabled="(scope.row.status == 1 || scope.row.leaseStatus == 0) ? true : false" type="text" size="small">撤销作废</el-button>
        </template>
      </el-table-column>
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

    <el-dialog
      title="预收详情"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="850px">
        <el-form label-width="90px" :inline="true" size="small" :disabled="true">
          <h5>
            房源及合同 收入
          </h5>
          <el-form-item label="房源编号">
            <el-input class="minput"></el-input>
          </el-form-item>
          <el-form-item label="房源地址">
            <el-input class="minput" :value="detailsDic.address" style="width: 600px"></el-input>
          </el-form-item>
          <el-form-item label="所属分店">
            <el-input class="minput" :value="detailsDic.storeName"></el-input>
          </el-form-item>
          <el-form-item label="门店电话" :inline="true">
            <el-input class="minput" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="所属经纪人" :inline="true">
            <el-input class="minput" :value="detailsDic.masterBroker"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" :inline="true">
            <el-input class="minput" :value="detailsDic.masterBroker" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="收入类型">
            <el-input class="minput" :value="detailsDic.classification"></el-input>
          </el-form-item>
          <el-form-item label="合同编号">
            <el-input class="minput" :value="detailsDic.leaseNo" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="合同日期">
            <el-input class="minput" :value="detailsDic.startTime"></el-input> 至
            <el-input class="minput" :value="detailsDic.endTime"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="合同协议">
            <m-table
              :hasIndex="true"
              :hasPagination="false"
              :data="datailsTable.list"
              :setting="datailsTable.setting"
            ></m-table>
          </el-form-item>
          <h5>预收及客户</h5>
          <el-form-item label="预收日期">
            <el-input class="minput" :value="detailsDic.prepaidDate"></el-input>
          </el-form-item>
          <el-form-item label="房租日期">
            <el-input class="minput" :value="detailsDic.startTime"></el-input> 至
            <el-input class="minput" :value="detailsDic.endTime"></el-input>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input class="minput" :value="detailsDic.name"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input class="minput" :value="detailsDic.phoneNo"></el-input>
          </el-form-item>
          <el-form-item label="预收金额">
            <el-input class="minput" :value="detailsDic.prepaidAmount"></el-input>
          </el-form-item>
          <el-form-item label="摘要">
            <el-input class="bInput" type="textarea" :value="detailsDic.remarks"></el-input>
          </el-form-item>
        </el-form>
    </el-dialog>

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
        :pageNum="tableDesc.page"
        :pageSize="tableDesc.rows"
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
  getDiffYmdBetweenDateStyle
} from '@/common/common.js';
import { 
  getLeaseCostByPage, 
  getCostDetailFindById,
  payConfirm,
  remarkSave,
  remarkUpdate,
  remarkListById,
  remarkDeleteById, abolition } from "@/api/org-leaseCostDetail";
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
            value: "leaseNo"
          },
          {
            label: "合同状态",
            value: "leaseStatus",
            formatter(row, column, cellValue, index) {
              return cellValue === 0 ? '作废' : '有效';
            }
          },
          {
            label: "预收状态",
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
            label: "门店",
            value: "storeName",
            width: 120
          },
          {
            label: "主经济人",
            value: "masterBroker"
          },
          {
            label: "主成交人",
            value: "masterDealer"
          },
          {
            label: "合同地址",
            value: "address",
            width: 200
          },
          {
            label: "预收日期",
            value: "prepaidDate",
            width: 120
          },
          {
            label: "预收金额",
            value: "prepaidAmount"
          },
          {
            label: "收款状态",
            value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue === 1 ? '已收款' : '未收款';
            }
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
            label: "备注",
            value: "remarks",
            width: 300
          },
          {
            label: "费用详情ID",
            value: "leaseCostDetailId",
            width: 120
          },
          {
            label: "付款协议ID",
            value: "leasePaymentAgreementId",
            width: 120
          },
          {
            label: "类型",
            value: "type",
            formatter(row, column, cellValue, index) {
              return cellValue === 1 ? '收入' : '支出';
            }
          },
          {
            label: "公司",
            value: "company",
            width: 120
          },
          {
            label: "台账地址",
            value: "address"
          },
          {
            label: "实收日期",
            value: "acturalDate",
            width: 120
          },
          {
            label: "实收金额",
            value: "acturalAmount"
          },
          {
            label: "客户名称",
            value: "name"
          },
          {
            label: "客户手机号",
            value: "phoneNo",
            width: 120
          },
          {
            label: "客户电话",
            value: "telephone",
            width: 120
          },
          {
            label: "副经纪人",
            value: "slaveBroker"
          },
          {
            label: "副成交人",
            value: "slaveDealer"
          },
          {
            label: "门锁类型",
            value: "lockType",
            formatter(row, column, cellValue, index) {
              let lockTypes = [
                { name: "普通锁", id: 1 },
                { name: "智能锁", id: 2 },
                { name: "刷卡", id: 3 }
              ];
              let json = lockTypes.find(item => item.id == cellValue);
              return json ? json.name : cellValue;
            }
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
          leaseNo: "",// 合同编号
          buildingId: "",// 楼盘ID
          buildingName: "",
          familyId: "",// 门牌ID
          accountNo: "",// 台账编号
          leaseStatus: 1,//合同状态
          isAbolition: 1,//预收状态
          name: "",// 客户姓名
          companyId: "",
          storeId: "",
          masterBroker: "",// 主经纪人
          phoneNo: "",
          lockType: "",// 门锁类型
          prepaidStartDate: "",
          prepaidEndDate: "",
          acturalStartDate: "",
          acturalEndDate: "",
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
      flowDetailsData: {},
      detailsDic: {},
      datailsTable: {
        list: [],
        setting: [
          {
            label: "年次",
            value: "",
            formatter(row, column, cellValue, index) {
              return index + 1;
            }
          },
          {
            label: "开始日期",
            value: "startTime"
          },
          {
            label: "结束日期",
            value: "endTime"
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
            label: "提前天数",
            value: "advancePaymentDays"
          },
          {
            label: "租金合计",
            value: "rentTotal"
          },
          {
            label: "期限",
            value: "",
            formatter(row, column, cellValue, index) {
              let { year, month, day } = getDiffYmdBetweenDateStyle(row.startTime, row.endTime)
              return `${year}年${month}月${day}天`
            }
          }
        ]
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
      remarkForm:{
        leaseCostDetailId: "",
        id: "",
        remark: ""
      },
      contractStatuses: [{ value: "", label: "全部" }, { value: 1, label: "有效" }, { value: 0, label: "作废" }],
      statusOptions: [{ value: "", label: "全部" }, { value: 1, label: "已收款" }, { value: 0, label: "未收款" }],
      buildings: [{ name: "所有项", id: "" , address: ""}],
      lockTypes: [
        { name: "所有项", id: "" },
        { name: "普通锁", id: "1" },
        { name: "智能锁", id: "2" },
        { name: "刷卡", id: "3" }
      ],
      dialogTableVisible: false,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      isFlow: 0,// 0是没有流水凭证，1是有
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
      if (val || val === 0) {
        this.table.page = val;
      }
      if (totalNum || totalNum === 0) {
        this.table.rows = totalNum;
      }
      let { page, rows, parms } = this.table;
      getLeaseCostByPage({ ...parms, page, rows }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (body.rows != undefined) {
            this.table.list = body.rows
            this.table.total = body.total;
          }else {
            this.table.list = []
            this.table.total = 0
            this.flowDetailsData.status = undefined
          }
        }
      });
    },
    handleCurrentChange(val){ //单选
      if(!val) return
      this.flowDetailsData = val
      this.table2.parms = {
        companyId: val.companyId,
        storeId: val.storeId,
        budgetNo: val.leaseCostDetailNo
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
                return true;
              }else {
                this.isFlow = 0
              }
            })
          }else {
            this.isFlow = 0
          }
          this.table2.total = body.total;
        }
      });
    },
    /*
    * 预收详情
    */
    toDetail(val) {
      getCostDetailFindById(val.leaseCostDetailId).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.detailsDic = body
          this.datailsTable.list = [ body.leasePaymentAgreementVO ]
          this.dialogTableVisible = true;
        }else {
          this.$message({
            message: "查询失败",
            type: "error"
          });
        }
      }).catch(error => {
        this.$message({
          message: err,
          type: "error"
        });
      })
      
    },
    /**
     * 确认/撤销收款
    */
    changeClick(val, status) {
      let params = {
        leaseCostDetailId : val.leaseCostDetailId,
        status: status,
        acturalAmount: status == 1 ? val.prepaidAmount : 0
      }
      payConfirm(params).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.$message({
            type: "success",
            message: status == 1 ? "收款成功!" : "撤销成功!"
          });
          this.currentChange(1);
        }else {
          this.$message({
            type: "error",
            message: status == 1 ? "收款失败" : "撤销失败"
          });
        }
      })
    },
    /**
     * 添加备注
    */
    addDescClick(val) {
      this.tableDesc.list = [];
      this.dialogTableVisible1 = true
      this.remarkForm = {
        leaseCostDetailId: val.leaseCostDetailId,
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
        leaseCostDetailId: val.leaseCostDetailId,
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
      remarkListById(this.remarkForm.leaseCostDetailId).then(res => {
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
     * 查询楼盘
    */
    buildingFind1(regionQs = "") {
      buildingFindAll({ regionQs }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
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
     * 预收作废
    */
    abolitionClick(val) {
      let param = {isAbolition: val.isAbolition == 0 ? 1 : 0, leaseCostDetailId: val.leaseCostDetailId}
      abolition(param).then(res => {
        let { code, body } = res
        if (code == 1000) {
          this.$message({
            message: val.isAbolition == 0 ? "撤销作废成功" : "预收作废成功",
            type: "success"
          });
          this.currentChange();
        }else {
          this.$message({
            message: val.isAbolition == 0 ? "撤销作废失败" : "预收作废失败",
            type: "error"
          });
        }
      }) 
    },
    toEnable() {
      this.$confirm("此操作将启用该台账, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "启用成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用"
          });
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
     * 求和
    */
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((c, index) => {
        if (index === 0) {
          sums[index] = '金额合计'
        } else if (index === 11) {
          let sum = 0
          data.forEach(d => {
            if (d.prepaidAmount != undefined) {
              sum += d.prepaidAmount
            }
          })
          sums[index] = sum
        } else if (index === 21) {
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
    },
  },
  mounted () {

    this.table.parms.prepaidStartDate = "2010-01-01";
    this.table.parms.prepaidEndDate = this.timeDefault(15);
    // this.prepaidDate = ["2010-01-01",this.timeDefault(15)];
    this.currentChange(1);
    this.buildingFind1();
    
  }
};
</script>

<style scoped>
h5{
  font-size: 16px;
  margin-bottom: 10px;
}
.bInput{
  width: 500px;
}
</style>
