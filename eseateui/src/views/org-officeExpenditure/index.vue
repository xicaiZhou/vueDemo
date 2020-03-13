<template>
  <div class="mContainer">
    <div class="contorl">
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 1 || approve.isManager == 1 || approve.isAudit == 1) ? true  : false)" @click="auditor(2,0)">店长审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 0 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)" @click="auditor(2,1)">撤销店长审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.manager" :disabled="((approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)" @click="auditor(3,0)">经理审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.manager" :disabled="((approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 0 || approve.isAudit == 1) ?  true : false)" @click="auditor(3,1)">撤销经理审核</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 1) ?  true : false)" @click="auditor(4,0)">财务确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 0) ?  true : false)" @click="auditor(4,1)">撤销财务确认</el-button>
    </div>
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
        <el-form-item label="公 司">
          <el-select placeholder="请选择" v-model="table.parms.companyId">
            <el-option v-for="(item, i) in companys" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门 店">
          <el-cascader 
            v-model="table.parms.storeId" 
            clearable
            :show-all-levels="false" 
            :options="storeOptions" 
            :disabled="(table.parms.companyId) ? false: true"></el-cascader>
        </el-form-item>
        <el-form-item label="收支编号">
          <el-input class="minput" v-model="table.parms.officeExpenditureNo"></el-input>
        </el-form-item>
        <el-form-item label="录入人">
          <el-select placeholder="请选择" v-model="table.parms.createUser">
            <el-option v-for="(item, i) in createUsers" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支出日期">
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
        <el-form-item>
          <el-button type="primary" @click="getList(1)">查 询</el-button>
          <el-button type="primary" @click="newAddClick()">新 增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      ref="mtable"
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      :notChangeRow="notChangeRow"
      @currentChange="currentChange1"
      @handleCurrentChange="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange1"
    >
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="scope">
          <el-button :disabled="(scope.row.isShopowner !== 0) || (scope.row.isManager !== 0) || (scope.row.isAudit !== 0)" 
            @click="changeApplyClick(scope.$index, scope.row, 2)" 
            type="text" 
            size="small">修改支出</el-button>
          <el-button 
          type="text" 
          :disabled="(scope.row.isShopowner !== 0) || (scope.row.isManager !== 0) || (scope.row.isAudit !== 0)" 
          @click="deleteTableData(scope.row)" 
          size="small" 
          style="color: red;">删除</el-button>
        </template>
      </el-table-column>
    </m-table>
    <br>  
    <br>
    <h5>流水记录</h5>
    <m-table 
      :hasIndex="true" 
      :data="table3.list" 
      :setting="table3.setting"
      :total="table3.total"
      :pageNum="table3.page"
      :pageSize="table3.rows">
      </m-table>

    <!-- 办公支出新增与修改 -->
    <el-dialog 
      :title="selectedTitle" 
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :inline="true" width="1000px">
      <el-form label-width="90px" size="small" :model="dialogParms" ref="dialogParms" :inline="true">
        <el-form-item label="*支出公司"  prop="companyId">
          <el-select placeholder="请选择" v-model="dialogParms.companyId">
            <el-option v-for="(item, i) in companys" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="*支出门店"  prop="storeId">
          <el-cascader 
            v-model="dialogParms.storeId" 
            clearable
            :show-all-levels="false" 
            :options="storeOptions" 
            :disabled="(dialogParms.companyId) ? false: true"></el-cascader>
        </el-form-item>
        <el-form-item label="*支出总计" prop="totalFee">
          <el-input class="minput" v-model="dialogParms.totalFee"></el-input>
        </el-form-item>
        <!-- <el-form-item v-if=" this.selectedTitle === '修改支出'">
          <p>
            <el-button  type="primary" size="mini" @click="savaExpenditureDetailRequest(1)">新增明细</el-button>
            <el-button  type="danger" size="mini" @click="deleteExpenditureDetailRequest()">删除明细</el-button>
          </p>
          <m-table
            :hasPagination="false"
            :hasSelection="true"
            :hasIndex="true"
            :data="table2.list"
            :setting="table2.setting"
            :loading="table2.loading"
            @currentChange="currentChange"
            @handleSelectionChange="handleSelectionChange"
          >
            <el-table-column label="操作" width="60px" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="savaExpenditureDetailRequest(3,scope.row)">修改</el-button>
              </template>
            </el-table-column>
          </m-table>
        </el-form-item> -->
        <!-- <el-form-item label="登记日期" prop="registerTime"> 
          <el-date-picker
            v-model="dialogParms.registerTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="*支出方式" prop="type">
          <el-select placeholder="请选择" v-model="dialogParms.type">
            <el-option v-for="(item, i) in types" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="*备注" prop="description">
          <el-input type="textarea" style="width:500px" :rows="6" v-model="dialogParms.description"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="sumitAdd()" type="primary">提交</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增申请明细 -->
    <el-dialog 
      :title="selectedDetailTitle" 
      :visible.sync="dialogTableVisible3" 
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :inline="true"  width="700px">
      <el-form :model="dialogParms2" size="small" ref="dialogParms2"  label-width="90px" :inline="true">
        <el-form-item label="*支出分类" prop="bigClassification">
          <el-select placeholder="请选择" v-model="dialogParms2.bigClassification">
            <el-option v-for="(item, i) in bigOfficeTypes" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="smallClassification">
          <el-select placeholder="请选择"  v-model="dialogParms2.smallClassification">
            <el-option v-for="(item, i) in officeTypes" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="*支出项目" prop="project">
          <el-select placeholder="请选择" v-model="dialogParms2.project">
            <el-option v-for="(item, i) in smallOfficeTypes" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <el-input placeholder="请输入" v-model="dialogParms2.unitPrice"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input placeholder="请输入" v-model="dialogParms2.quantity"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select placeholder="请选择" v-model="dialogParms2.unit">
            <el-option v-for="(item, i) in unitTypes" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装费" prop="installationFee">
          <el-input placeholder="请输入" v-model="dialogParms2.installationFee"></el-input>
        </el-form-item>
        <el-form-item label="运费" prop="transportFee">
          <el-input placeholder="请输入" v-model="dialogParms2.transportFee"></el-input>
        </el-form-item>
        <el-form-item label="金额合计" prop="totalFee">
          <el-input placeholder="请输入" v-model="dialogParms2.totalFee"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="savaExpenditureDetailRequest(2)" type="primary">提交</el-button>
        <el-button @click="dialogTableVisible3 = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'

import {
  getOfficeExpenditure,
  saveOfficeExpenditure,
  updateOfficeExpenditure,
  getOfficeExpenditureDetail,
  saveOfficeExpenditureDetail,
  updateOfficeExpenditureDetail,
  deleteOfficeExpenditureDetail,
  saveOfficeExpenditureAudit,
  getOfficeExpenditureFindById,
  shopownerAudit,
  managerAudit,
  officeExpenditureDelete,
  officeExpenditureAudit
} from "@/api/org-office";
import { 
  findAll,
  findAllId
  } from "@/api/org-dept";
import { isNull } from 'util';
import { FindByName } from "@/api/org-user";
import { findFlowDetailPage } from "@/api/org-tempAccount";

export default {
  components: {
    MTable
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
      selectedTitle: "",
      selectedDetailTitle: "",
      approve:{
        isShopowner: 5,
        isManager: 5,
        isAudit: 5,
        allStatus: false,
        isFlow: 0,// 0是没有流水凭证，1是有
      },
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
            label: "收支编号",
            value: "officeExpenditureNo",
            width: 230
          },
          {
            label: "支出日期",
            value: "registerTime",
            width: 120
          },
          {
            label: "支出金额",
            value: "totalFee"
          },
          {
            label: "摘要",
            value: "description",
            width: 300
          },
          {
            label: "店长审核",
            value: "isShopowner",
            formatter(row, column, cellValue, index) {
              return cellValue === 0 ? "未审核" : (cellValue === 1 ? "已审核" : " 取消审核");
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
              return cellValue === 0 ? "未审核" : (cellValue === 1 ? "已审核" : " 取消审核");
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
              return cellValue === 0 ? "未审核" : (cellValue === 1 ? "已审核" : " 取消审核");
            }
          },
          {
            label: "财务",
            value: "auditor"
          },
          {
            label: "录入时间",
            value: "createTime",
            width: 170
          },
          {
            label: "录入人",
            value: "createUser"
          },
          {
            label: "是否审核",
            value: "isAudit",
            formatter(row, column, cellValue, index) {
              return cellValue === false ? "未审核" : "已审核";
            }
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          officeExpenditureNo: "",
          officeExpenditureId: "",
          beginTime: "",
          endTime: "",
          createUser: "",
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
            label: "分类大",
            value: "bigClassification"
          },
          {
            label: "分类小",
            value: "smallClassification"
          },
          {
            label: "项目",
            value: "project"
          },
          {
            label: "单位",
            value: "unit"
          },
          {
            label: "数量",
            value: "quantity"
          },
          {
            label: "单价",
            value: "unitPrice"
          },
          {
            label: "安装费",
            value: "installationFee"
          },
          {
            label: "运费",
            value: "transportFee"
          },
          {
            label: "总计",
            value: "totalFee"
          }
        ],
        parms: {
          officeExpenditureId: ""  
        }
      },
      table3: {
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
          // {
          //   label: "房源地址",
          //   value: "houseAddress",
          //   width: 170
          // },
          {
            label: "更新日期",
            value: "updateTime",
             width: 160
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
      dialogParms: {
          id: null,
          companyId: "",
          company: "",
          storeId: "",
          storeName: "",
          totalFee: "",
          type: 1,
          description: ""
      },
      dialogParms2:{
          bigClassification: "",
          id: null,
          installationFee: null,
          officeExpenditureId: null,
          project: "",
          quantity: null,
          smallClassification: "",
          totalFee: null,
          transportFee: null,
          unit: "",
          unitPrice: null
      },
      companys: [],
      createUsers: [{ name: "所有项", id: "" }],
      types: [
        { name: "现金", id: 1 },
        { name: "转账", id: 2 },
        { name: "POS机", id: 3 },
        { name: "微信", id: 4 },
        { name: "支付宝", id: 5 }
      ],
      bigOfficeTypes: [ {name: "办公类"} ],
      officeTypes: [
        { name: "消耗品", smallTypes:[{name: "A4纸"}, {name: "笔"},{name: "磨盒"},{name: "饮用水"},{name: "电费"},{name: "水费"},{name: "网费"},{name: "其他"}] },
        { name: "固定资产类", smallTypes:[{name: "电脑"}, {name: "笔记本"},{name: "打印机"},{name: "POS机"},{name: "投影仪"},{name: "其他"}] },
        { name: "房屋", smallTypes:[{name: "税点"}, {name: "手续费"}] }
      ],
      smallOfficeTypes: [],
      unitTypes: [ {name: "个"},{name: "台"},{name: "件"},{name: "米"} ],
      timeout: null,
      dialogTableVisible: false,
      dialogTableVisible3: false,
      deleteArray:[],
      storeOptions:[]
    };
  },
  watch: {
    "table.parms.beginTime"(val) {
      if (val) {
        this.table.parms.beginTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.beginTime = ""
      }
    },
    "table.parms.endTime"(val) {
      if (val) {
        this.table.parms.endTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.endTime = ""
      }
    },
    "table.parms.companyId"(val) {
      let company = this.companys.find(item => item.id == val);
      this.table.parms.storeId = "";
      if(val) this.outlet(val)
    },
    "dialogParms.companyId"(val) {
      let company = this.companys.find(item => item.id == val);
      if (this.selectedTitle !== '修改支出') {
        this.dialogParms.storeId = "";
      }
      if(val) this.outlet(val)
    },
    "dialogParms2.smallClassification"(val) {
      if (val) {
        let offices = this.officeTypes.find(item => item.name == val);
        this.dialogParms2.project = "";
        this.smallOfficeTypes = offices.smallTypes;
      }
    }
  },
  methods: {
    currentChange(val) {
      this.table.pageNum = val;
    },
    currentChange1(val) {
      this.table.pageNum = val;
      this.getList()
    },
    handleCurrentChange(val){ //单选
      if(!val) return
      this.approve = val
      this.approve.allStatus = true
      this.table3.parms = {
        companyId: val.companyId,
        storeId: val.storeId,
        budgetNo: val.officeExpenditureNo
      }
      this.flowDetails(1);
      this.currentRow = val
    },
    /**
		 * 默认查询分页流水明细
		*/
    flowDetails(val) {
      if (val || val === 0) {
        this.table3.page = val;
      }
      let { page, rows, parms } = this.table3;
      findFlowDetailPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.table3.list = body.rows
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
          this.table3.total = body.total;
        }
      });
    },
    auditor(val1,val2){ //审批
      switch (val1) {
        case 2: //店长
          if(!val2) this.open2('提交店长审核申请',val1,val2)
          else this.open2('撤销店长审核申请',val1,val2)
          break;
        case 3: //经理
          if(!val2) this.open2('提交经理审核申请',val1,val2)
          else this.open2('撤销经理审核申请',val1,val2)    
          break;
        case 4: //财务
          if(!val2) this.open2('提交财务审核申请',val1,val2)
          else this.open2('撤销财务审核申请',val1,val2)         
          break;     
        default:
          break;
      }
    },
      open2(msg,type,status) {
           if(!this.approve.allStatus) {
                this.$message({
                  type: 'error',
                  message: '请先选择对应门店'
                });
                return
           }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        type = type - 1
       switch (type) {
         case 1:
          const params = {
            isAudit: this.approve.isAudit,
            isManager: this.approve.isManager,
            isShopowner: status ? 0 : 1,
            officeExpenditureIds:[this.approve.officeExpenditureId]
          }
          
           shopownerAudit(params).then(res=>{
             this.getList()
                   this.$message({
                    type: 'success',
                    message: '成功!'
                  });
           })
           break;
         case 2:
           if (this.approve.isShopowner !== 1) {
              this.$message({
                type: "error",
                message: "请先进行店长审核"
              });
              return;
            }
          const params1 = {
            isAudit: this.approve.isAudit,
            isManager: status ? 0 : 1,
            isShopowner: this.approve.isShopowner,
            officeExpenditureIds:[this.approve.officeExpenditureId]
          }
           managerAudit(params1).then(res=>{
             this.getList()
                   this.$message({
                    type: 'success',
                    message: '成功!'
              });
           })
           break;  
         case 3:
          if (this.approve.isManager !== 1) {
            this.$message({
              type: "error",
              message: "请先进行经理审核"
            });
            return;
          }
          const params2 = {
            isAudit: status ? 0 : 1,
            isManager: this.approve.isManager,
            isShopowner: this.approve.isShopowner,
            officeExpenditureIds:[this.approve.officeExpenditureId]
          }
           officeExpenditureAudit(params2).then(res=>{
             this.getList()
                   this.$message({
                    type: 'success',
                    message: '成功!'
              });
           })
           break;      
         default:
           break;
       }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      },
    getList(val) {
      this.approve  ={
        isShopowner: 5,
        isManager: 5,
        isAudit: 5,
        allStatus: false
      }
      let params = JSON.parse(JSON.stringify(this.table.parms))
      if(params.storeId && params.storeId.length>0){
         params.storeId = params.storeId.join(".")
      }else{
        params.storeId =""
      }
      this.table.page= this.table.page;
      this.table.rows=this.table.rows;
      let { page, rows } = this.table;
      getOfficeExpenditure({ ...params, page, rows }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (body.rows != undefined) {
            this.table.list = body.rows;
            this.table.total = body.total;
            this.$nextTick(() => {
              this.notChangeRow = true
              if (!this.currentRow)  {
                console.log('this.currentRow is null')
                return
              }
              this.$refs.mtable.setCurrentRow(this.table.list.find(d => d.officeExpenditureNo === this.currentRow.officeExpenditureNo))
            })
          }else {
            this.approve.isFlow = 1
            this.table.list = body.rows;
            this.table.total = body.total;
          }
        }
      });
    },
    newAddClick() {
      this.selectedTitle = '新增支出';
      this.dialogTableVisible = true;
      this.dialogParms = {
        id: null,
        companyId: "",
        company: "",
        storeId: "",
        storeName: "",
        totalFee: "",
        type: 1,
        description: ""
      };
    },
    sumitAdd() {
      // 新增 或者 修改支出 ---- 提交按钮
      const companyName = this.companys.find((item) => item.id === this.dialogParms.companyId)
      this.dialogParms.company = companyName.name;

      let params = JSON.parse(JSON.stringify(this.dialogParms))
      if(params.storeId && params.storeId.length>0){
         params.storeId = params.storeId.join(".")
      }else{
        params.storeId =""
      }
      this.dialogParms.storeId = params.storeId

      this.dialogParms.totalFee = Number(this.dialogParms.totalFee);

      let parms  = this.dialogParms;

      if(!parms.companyId){
        this.$message.error('公司不能为空');
        return
      }else if(!parms.storeId){
        this.$message.error('门店不能为空');
        return
      }else if(!parms.type){
        this.$message.error('请选择支出方式');
        return
      }else if(!parms.description){
        this.$message.error('请填写备注，它很重要！');
        return
      }

      if (this.selectedTitle === '修改支出') {
        // 修改支出
        updateOfficeExpenditure (parms).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.getList(1);
            this.$refs['dialogParms'].resetFields();
            this.dialogTableVisible = false;
          } else {
            this.$message({
              type: "error",
              message: msg ? msg : "修改失败!"
            });
          }
        });
      }else {
        // 新增支出
        saveOfficeExpenditure(parms).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              type: "success",
              message: "新增成功!"
            });
            this.$refs['dialogParms'].resetFields();
            this.getList(1);
            this.dialogTableVisible = false;
          } else {
            this.$message({
              type: "error",
              message: msg ? msg : "新增失败!"
            });
          }
        });
      }
    },
    changeApplyClick(row, item, typeIndex) {
      // typeIndex 1 确认审核    2 修改收入   3 收入明细
      if (typeIndex === 1) {
        this.dialogParms = item;
        this.sureOfficeAuditRequest(item.officeExpenditureId);
      }else if (typeIndex === 2) {
        this.selectedTitle = '修改支出';
        this.dialogParms = item;
        // item.storeId = (item.storeId).split(".")

        this.findByID(item.officeExpenditureId);
        this.getExpenditureDetailRequest(item.officeExpenditureId);
      }else if (typeIndex === 3) {
        this.getExpenditureDetailRequest(item.officeExpenditureId);
        this.dialogParms = item;
      }
    },
    /*
    * 删除收入
    */
    deleteTableData({ officeExpenditureId }) {
      this.$confirm("此操作将删除该办公支出, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          officeExpenditureDelete({ id: officeExpenditureId }).then(res => {
            console.log(res);
            let { code } = res;
            if (code == 1000) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.currentChange1();
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
    sureOfficeAuditRequest(officeNo) {
      // 财务确认审核
      let params ={
        officeExpenditureDetailId:this.dialogParms.officeExpenditureId,
        officeExpenditureId: this.dialogParms.officeExpenditureId,
      }
      saveOfficeExpenditureAudit(params).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.getList();
        }else {

        }
      });
    },
    findByID(officeNo) {
      // 修改支出的时候，通过合同ID拿到详细数据
      getOfficeExpenditureFindById(officeNo).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.dialogParms = body;
        if(this.dialogParms.storeId || this.dialogParms.storeId.length>0){
          const oldStoreId = this.dialogParms.storeId.split(".")
          const newStoreId = []
          oldStoreId.map(o=>{
            newStoreId.push(Number(o))
          })
          this.dialogParms.storeId = newStoreId    
        }else{
          this.dialogParms.storeId =[]
        }
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.dialogTableVisible = true;
          }, 100); 
        }
      });
    },
    getExpenditureDetailRequest(officeNo) {
      // 通过支出ID 查询明细详情
      if (officeNo !== this.table2.parms.officeExpenditureId && officeNo !== '') {
        this.table2.parms.officeExpenditureId = Number(officeNo);
      }
      let parms  = this.table2.parms;
      getOfficeExpenditureDetail(parms).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.table2.list = body;
        }
      });
    },
    savaExpenditureDetailRequest(row,ele) {
      // 新增/修改支出明细
      this.dialogParms2.officeExpenditureId = this.dialogParms.id;
      if (row === 1) {
        // 仅仅打开弹框
        this.selectedDetailTitle = "新增支出明细";
        this.dialogTableVisible3 = true;

      }else if (row === 2) {
        if(this.selectedDetailTitle === "新增支出明细"){
        // 新增提交接口
        let parms = this.dialogParms2;
        saveOfficeExpenditureDetail(parms).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              type: "success",
              message: "新增明细成功!"
            });
            this.getExpenditureDetailRequest(this.dialogParms2.officeExpenditureId);
            this.dialogTableVisible3 = false;
             this.$refs['dialogParms2'].resetFields();
          } else {
            this.$message({
              type: "error",
              message: msg ? msg : "新增明细失败!"
            });
          }
        });
        }else{
          // 修改提交接口
          let params = this.dialogParms2;
          updateOfficeExpenditureDetail(params).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              type: "success",
              message: "修改明细成功!"
            });
            this.getExpenditureDetailRequest(this.dialogParms2.officeExpenditureId);
            this.dialogTableVisible3 = false;
            this.$refs['dialogParms2'].resetFields();
          } else {
            this.$message({
              type: "error",
              message: msg ? msg : "修改明细失败!"
            });
          }
        }).catch(err=>{
           this.$message.error(err.msg);
        });
        }
      }else if (row === 3) {
        this.selectedDetailTitle = "修改支出明细";
        this.dialogTableVisible3 = true;
        delete ele.createTime;
        delete ele.createUser;
        this.dialogParms2 = {...ele};
      }
    },
    handleSelectionChange1(val){
      this.deleteArray = val;
    },
    handleSelectionChange(val){
      this.deleteArray = val;
    },
    deleteExpenditureDetailRequest() {
      // 删除支出明细(支持批量删除)
      let params = {
        officeExpenditureDetailIds:[],
        officeExpenditureId:  this.dialogParms.officeExpenditureId || this.dialogParms.id,
      }
      for (let i = 0; i < this.deleteArray.length; i++) {
        const element = this.deleteArray[i];
        params.officeExpenditureDetailIds.push(element.id)
      }
      deleteOfficeExpenditureDetail(params).then(res=>{
        if(res.msg == '成功'){
          this.getExpenditureDetailRequest(params.officeExpenditureId);
        }else{
          this.$message.error('删除失败');
        }
      }).catch(err=>{
        this.$message.error(err.msg);
      })
    },
    outlet(id){
      findAllId({parentId:id}).then(res=>{
        this.storeOptions = []
        const newStoreOptions = []
        res.body.map(o=>{
          const storeParent = {
            value:o.id,
            label:o.name,
            children: []
          }
          
          o.children.map(j=>{
            const storeParentChild = {
              value:j.id,
              label:j.name
            }
            storeParent.children.push(storeParentChild)
          })
          this.storeOptions.push(storeParent)
        })
      })
    },
    findAll(){
      // 查询所有的公司
      findAll({ level: "2" }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.companys = [...body];
        }
      });
    },
    findUserByName() {
      FindByName({}).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.createUsers = [{ name: "所有项", id: "" }, ...body];
        }
      });
    },
  },
  created() {
    this.findAll();
    this.findUserByName();
    this.$nextTick(() => {
      this.getList(1);
    })
    if (this.$store.getters.userinfo) {
      
      // 在不同的地方调用方法的时候，这个变量的的类型是不一样的，JSON.parse()里的参数只能是string类型
      const userinfo = typeof this.$store.getters.userinfo == 'string' ? JSON.parse(this.$store.getters.userinfo) : this.$store.getters.userinfo;
      /*
      * broker   经纪人
      * storeManager   店长
      * manager   经理
      * finance   财务
      */
      this.permissions = userinfo.permissions
    }
  },
  computed: {
    timeDefault() {
      var date = new Date();
      var s1 = date.getFullYear() + "-" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "-" + (date.getDate() >= 10 ? date.getDate() : ("0" + date.getDate()));
      return s1;
    }
  }
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
h5 {
  font-size: 16px;
  margin-bottom: 10px;
}
.bInput {
  width: 500px;
}
</style>
