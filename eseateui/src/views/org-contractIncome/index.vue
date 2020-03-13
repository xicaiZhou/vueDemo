<template>
  <div class="mContainer">
    <div class="contorl">
      <!-- 流水审核通过，所有按钮禁止点击 -->
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="approve.isFlow === 1 || approve.isAudit == 1 ? true : false" @click="changeAuditClick(approve.contractIncomeId, approve.isAudit)">财务确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="approve.isFlow === 1 || approve.isAudit != 1 ? true : false" @click="changeAuditClick(approve.contractIncomeId, approve.isAudit)">撤销财务确认</el-button>
    </div>
    <div class="mtools">
      <el-form label-width="90px" size="small" ref="searchForm" :inline="true">
        <el-form-item label="公 司">
          <el-select placeholder="请选择" v-model="searchForm.companyId">
            <el-option v-for="(item, i) in companys" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门 店" prop="storeId">
         <el-cascader 
            v-model="searchForm.storeId" 
            clearable
            :show-all-levels="false" 
            :options="storeOptions" 
            :disabled="(searchForm.companyId) ? false: true">
          </el-cascader>         
        </el-form-item>
        <el-form-item label="门牌号">
          <el-input v-model="searchForm.address" placeholder="请输入门牌号"></el-input>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input v-model="searchForm.accountNo" placeholder="请输入台账编号"></el-input>
        </el-form-item>
        <el-form-item label="收支编号">
          <el-input v-model="searchForm.contractIncomeNo" class="minput"></el-input>
        </el-form-item>
        <el-form-item label="录入人">
          <el-select placeholder="请选择" v-model="searchForm.createUser">
            <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收入日期">
          <el-date-picker
            v-model="searchForm.beginTime"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart">
          </el-date-picker>
          至
          <el-date-picker
            v-model="searchForm.endTime"
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
      :hasIndex="true"
      :hasPaginationSizes="true"
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageSize="table.pageSize"
      @currentChange="currentChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.isAudit === 1 ? true : false" @click="changeApplyClick(scope.$index, scope.row)" type="text" size="small">修改收入</el-button>
          <el-button type="text" :disabled="scope.row.isAudit === 1 ? true : false" @click="deleteTableData(scope.row)" size="small" style="color: red;">删除</el-button>
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

    <!-- 选择台账 -->
    <el-dialog title="选择台账" 
      :visible.sync="dialogTableVisible3" 
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="800px">
      <el-form label-width="90px" size="small" :inline="true">
        <el-form-item label="公 司">
          <el-select placeholder="请选择" v-model="ledger.parms.companyId">
            <el-option v-for="(item, i) in companys" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门 店" prop="storeId">
         <el-cascader 
            v-model="ledger.parms.storeId" 
            clearable
            :show-all-levels="false" 
            :options="storeOptions" 
            :disabled="(ledger.parms.companyId) ? false: true">
          </el-cascader>         
        </el-form-item>
        <el-form-item label="经纪人">
          <el-input class="minput" v-model="ledger.parms.masterBroker"></el-input>
        </el-form-item>
        <el-form-item label="楼 盘">
          <el-select placeholder="请选择" v-model="ledger.parms.buildingId">
            <el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台账地址">
          <el-input class="minput" v-model="ledger.parms.address"></el-input>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input class="minput" v-model="ledger.parms.accountNo"></el-input>
        </el-form-item>
        <el-form-item label="房间号">
          <el-input class="minput" v-model="ledger.parms.roomName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getContractListRequest(1)">查 询</el-button>
        </el-form-item>
        <el-form-item>
          <m-table
            :data="ledger.list"
            :setting="ledger.setting"
            :loading="ledger.loading"
            :total="ledger.total"
            :pageSize="ledger.pageSize"
          >
            <el-table-column label="操作" width="90px" fixed="right">
              <template slot-scope="scope">
                <el-button @click="sureSelectedLedger(scope.row)" type="text" size="small">选择此台账</el-button>
              </template>
            </el-table-column>
          </m-table>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 选择台账 END-->


    <!-- 新增/修改收入 -->
    <el-dialog 
      :title="selectedTitle" 
      :visible.sync="dialogTableVisible" 
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="1100px">
      <el-form label-width="90px" size="small" :inline="true">
        <el-form-item label="*台账编号" prop="accountNo">
          <el-input :disabled="true" v-model="newIncomForm.accountNo" class="minput" style="width: 300px"></el-input>
          <el-button type="primary" size="mini" @click="selectedTaiZhang()">选择</el-button>
        </el-form-item>
        <el-form-item label="门 店" prop="storeName">
          <el-input :disabled="true" v-model="newIncomForm.storeName" class="minput"></el-input>
        </el-form-item>
        <el-form-item label="经济人" prop="masterBroker">
          <el-input :disabled="true" v-model="newIncomForm.masterBroker" class="minput"></el-input>
        </el-form-item>
        <el-form-item label="房源地址" prop="address">
          <el-input :disabled="true" v-model="newIncomForm.address" class="minput"></el-input>
        </el-form-item>
        <!-- <el-form-item v-if="selectedTitle !== '新增收入'" label="收入明细">
          <p>
            <el-button  type="primary" size="mini" @click="newAddDetail(1)">新增明细</el-button>
            <el-button  type="danger" size="mini" @click="deleteAll()">删除明细</el-button>
          </p>
          <m-table
            :hasPagination="false"
            :data="table2.list"
            :setting="table2.setting"
            :hasSelection="true"
            :loading="table2.loading"
            :total="table2.total"
            :pageSize="table2.pageSize"
            @handleSelectionChange='handleSelectionChange'
          >
            <template slot="check" slot-scope="scope">
              {{scope.row}}
              <el-checkbox></el-checkbox>
            </template>
            <el-table-column label="操作" width="60px" fixed="right">
              <template slot-scope="scope">
                <el-button @click="changeClick(scope.row)" type="text" size="small">修改</el-button>
              </template>
            </el-table-column>
          </m-table>
        </el-form-item> -->
        <el-form-item label="*收入总计" prop="totalFee">
          <el-input v-model="newIncomForm.totalFee" class="minput"></el-input>
        </el-form-item>
        <!-- <el-form-item label="收入日期" prop="registerTime">
          <el-date-picker
            v-model="newIncomForm.registerTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="*收入方式" prop="type">
          <el-select placeholder="请选择"  v-model="newIncomForm.type">
            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item><br>
        <el-form-item label="*备注" prop="description">
          <el-input v-model="newIncomForm.description" type="textarea" :rows="5" size="small" style="width: 500px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="newIncomSubmit()" type="primary">提交</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增/修改收入 END -->

    <!-- 明细 -->
    <el-dialog 
      :title="selectedDetailTitle" 
      :visible.sync="dialogTableVisible2" 
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="700px">
      <el-form label-width="90px" v-model="detailForm" ref="detailForm" :inline="true" size="small">
        <el-form-item label="收入分类" prop="bigClassification">
          <el-select placeholder="请选择" v-model="detailForm.bigClassification">
            <el-option v-for="item in bigClassOptions" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收入小类" prop="smallClassification">
          <el-select placeholder="请选择" v-model="detailForm.smallClassification">
            <el-option v-for="item in smallClassTypes" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收入项目" prop="project">
          <el-select placeholder="请选择" v-model="detailForm.project">
            <el-option v-for="item in projectTypes" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单 价" prop="unitPrice">
          <el-input class="minput" v-model="detailForm.unitPrice"></el-input>
        </el-form-item>
        <el-form-item label="数 量" prop="quantity">
          <el-input class="minput" v-model="detailForm.quantity"></el-input>
        </el-form-item>
        <el-form-item label="单 位" prop="unit">
          <el-select placeholder="请选择" v-model="detailForm.unit">
            <el-option v-for="item in unitTypes" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装费" prop="installationFee">
          <el-input class="minput" v-model="detailForm.installationFee"></el-input>
        </el-form-item>
        <el-form-item label="运 费" prop="transportFee">
          <el-input class="minput" v-model="detailForm.transportFee"></el-input>
        </el-form-item>
        <el-form-item label="金额合计" prop="totalFee">
          <el-input class="minput" v-model="detailForm.totalFee"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="newAddDetail(2)" type="primary">提交</el-button>
        <el-button @click="dialogTableVisible2 = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'

import { 
  find,
  findAllId 
} from "@/api/org-dept";
import { FindByName } from "@/api/org-user";
import { buildingFindAll } from "@/api/org-house";
import {
  getContractList,
  getContractListById
} from "@/api/org-ledger";
import {
  getContractIncomeByPage,
  getContractIncomeList,
  findContractIncomeById,
  saveContractIncome,
  updateContractIncome,
  saveContractIncomeDetail,
  updateContractIncomeDetail,
  deleteContractIncome,
  deteleTableContractIncome,
  tableAudit
} from '@/api/org-contractIncome'
import { findFlowDetailPage } from "@/api/org-tempAccount";
import MDepartment from '@/components/department'
export default {
  components: {
    MTable,
    MDepartment
  },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.searchForm.endTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.searchForm.beginTime;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      selectedTitle: '',    //收入标题
      selectedDetailTitle: "",  // 明细标题
      searchForm:{
        companyId: "",
        storeId: "",
        createUser:'',
        endTime:'',
        beginTime:'',
        contractIncomeNo:'',
        address: "",
        accountNo: "",
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
            label: "收入日期",
            value: "registerTime",
            width: 120
          },
          {
            label: "收支编号",
            value: "contractIncomeNo",
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
            label: "收入金额",
            value: "totalFee"
          },
          {
            label: "收支方式",
            value: "type",
            formatter(row, column, cellValue, index) {
              let types = [
                { name: "现金", id: 1 },
                { name: "Pos机", id: 3 }
              ];
              let json = types.find(item => item.id == cellValue);
              return json ? json.name : cellValue;
            }
          },
          {
            label: "财务审核",
            value: "isAudit",
            formatter(row, column, cellValue, index) {
              if(cellValue === 0 || cellValue === 2){
                return "未审核";
              }else {
                return "已审核"
              }
            }
          },
          {
            label: "财务人员",
            value: "auditor"
          },
          {
            label: "录入时间",
            value: "createTime",
            width: 160
          },
          {
            label: "录入人",
            value: "createUser"
          }
        ],
        total: 10,
        pageNum: 1,
        pageSize: 10
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
        total: 10,
        pageNum: 1,
        pageSize: 10
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
          //   width: 200
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
      ledger: {
        loading: false,
        list: [],
        setting: [
          {
            label: "公司",
            value: "companyName"
          },
          {
            label: "门店",
            value: "storeName"
          },
          {
            label: "台账编号",
            value: "accountNo"
          },
          {
            label: "台账类型",
            value: "type",
            formatter(row, column, cellValue, index) {
              let types = [
                { name: "业主", id: 1 },
                { name: "代理", id: 2 },
                { name: "居间", id: 3 },
                { name: "买卖", id: 4 },
                { name: "其他", id: 5 },
                { name: "未知", id: 6 }
              ];
              let json = types.find(item => item.id == cellValue);
              return json ? json.name : cellValue;
            }
          },
          {
            label: "主经纪人",
            value: "masterBroker"
          },
          {
            label: "楼盘",
            value: "buildingName"
          },
          {
            label: "台账地址",
            value: "address"
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          status: '1',
          accountNo: "",
          address: "",
          buildingId: "",
          roomName: "",
          masterBroker: ""
        },
        total: 10,
        pageNum: 1,
        pageSize: 10
      },
      companys: [{ name: "所有项", id: "" }],
      createUsers: [{ name: "所有项", id: "" }],
      buildings: [{ name: "所有项", id: "" }],
      storeOptions:[],
      dialogTableVisible: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      newIncomForm: {
        accountNo: "",
        address: "",
        companyId: "",
        masterBroker: "",
        storeId: "",
        storeName: "",
        type: "",
        totalFee: "",
        registerTime: "",
        description: "",
        contractIncomeId: ""
      },
      detailForm:{
        bigClassification:'',
        installationFee:null,
        contractIncomeId:'',
        project:'',
        quantity:null,
        smallClassification:'',
        totalFee:null,
        transportFee:null,
        unit:'',
        unitPrice:null,
        id: null
      },
      payOptions: [
        {value: 1,label: '现金'},
        {value: 2,label: '转账'},
        {value: 3,label: 'Pos机'},
        {value: 4,label: '微信'},
        {value: 5,label: '支付宝'}   ],
      bigClassOptions: [ 
        {name: '房源类', smallClassOptions: [ 
          {name: '装修类', projectOptions: [ 
            {name: '门'}, {name: '橱柜'}, {name: '油烟机'}, {name: '灶具'}, {name: '地板'}, {name: '二开门'}, {name: '三开门柜子'}, {name: '分期利息'} ]}, 
          {name: '家具家电', projectOptions: [ 
            {name: '床'}, {name: '衣柜'}, {name: '写字台'}, {name: '沙发'}, {name: '电视'}, {name: '冰箱'}, {name: '洗衣机'}, {name: '空调'}, {name: '茶几'}, {name: '热水器'}, {name: '三开门柜子'}, {name: '餐桌'}, {name: '钥匙'}, {name: '门禁卡'} ]}, 
          {name: '信息类', projectOptions: [ 
            {name: '信息类'} ]}, 
          {name: '定金', projectOptions: [ 
            {name: '定金'} ]}, 
          {name: '保洁', projectOptions: [ 
            {name: '保洁'} ]}, 
          {name: '水费', projectOptions: [ 
            {name: '水费'} ]}, 
          {name: '电费', projectOptions: [ 
            {name: '电费'} ]}, 
          {name: '燃气费', projectOptions: [ 
            {name: '燃气费'} ]}, 
          {name: '取暖费', projectOptions: [ 
            {name: '取暖费'} ]}, 
          {name: '卫生费', projectOptions: [ 
            {name: '卫生费'} ]}, 
          {name: '电视费', projectOptions: [ 
            {name: '有线电视费'}, {name: '初装费'} ]}, 
          {name: '房租', projectOptions: [ 
            {name: '房租'}, {name: '附加房租'}, {name: '滞纳金'} ]}, 
          {name: '网费', projectOptions: [ 
            {name: '网费'} ]}, 
          {name: '转租费', projectOptions: [ 
            {name: '转租费'} ]}, 
          {name: '奖励', projectOptions: [ 
            {name: '奖励'} ]} ]}, 
        {name: '办公类', smallClassOptions: [ 
          {name: '消耗品', projectOptions: [ 
            {name: 'A4纸'}, {name: '笔'}, {name: '磨盒'}, {name: '墨粉'}, {name: '饮用水'}, {name: '其他'}, {name: '电费'}, {name: '水费'}, {name: '网费'} ]}, 
          {name: '固定资产类', projectOptions: [ 
            {name: '电脑'}, {name: '笔记本'}, {name: '打印机'}, {name: 'POS机'}, {name: '投影仪'}, {name: '其他'} ]}, 
          {name: '房屋', projectOptions: [ 
            {name: '税点'}, {name: '手续费'} ]} ]}, 
        {name: '押金类', smallClassOptions: [ 
          {name: '押金', projectOptions: [ 
            {name: '客户押金'}, {name: '业主押金'} ]} ]} ],
      smallClassTypes: [],
      projectTypes: [],
      unitTypes: [ {name: "个"}, {name: "台"}, {name: "件"}, {name: "米"} ],
      multipleSelection:[],
      permissions: {
        finance: false
      },
      approve: {
        isAudit: 0,
        isFlow: 0,// 0是没有流水凭证，1是有
        contractIncomeId: '' 
      }
    };
  },
  watch: {
    "searchForm.beginTime"(val) {
      if (val) {
        this.searchForm.beginTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.searchForm.beginTime = ""
      }
    },
    "searchForm.endTime"(val) {
      if (val) {
        this.searchForm.endTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.searchForm.endTime = ""
      }
    },
    "searchForm.companyId"(val) {
      let company = this.companys.find(item => item.id == val);
      this.searchForm.storeId = "";
      if(val) this.outlet(val,1)
    },
    "ledger.parms.companyId"(val) {
      let company = this.companys.find(item => item.id == val);
      this.ledger.parms.storeId = "";
      if(val) this.outlet(val,1)
    },
    "detailForm.bigClassification"(val) {
      let bigClass = this.bigClassOptions.find(item => item.name == val);
      this.smallClassTypes = bigClass ? bigClass.smallClassOptions : [];
      this.projectTypes = []
      if( this.smallClassTypes.length == 0 ||!this.smallClassTypes.find(item => item.name == this.detailForm.smallClassification)){
        this.detailForm.smallClassification = "";
      }
    },
    "detailForm.smallClassification"(val) {
        let smallClass = this.smallClassTypes.find(item => item.name == val);
        this.projectTypes = smallClass ? smallClass.projectOptions : [];
        if( this.projectTypes.length == 0 || !this.projectTypes.find(item => item.name == this.detailForm.project)){
          this.detailForm.project = "";
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
      this.table.pageNum = val;
      this.table.pageSize = totalNum
      this.getList()
    },
    handleCurrentChange(val){ //单选
      if(!val) return
      this.approve = val
      this.table3.parms = {
        companyId: val.companyId,
        storeId: val.storeId,
        budgetNo: val.contractIncomeNo
      }
      this.flowDetails(1);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    /*
    * 选择台账 按钮 事件
    */
    sureSelectedLedger (val) {
      console.log(val)
      this.dialogTableVisible3 = false;
      if (val) {
        this.newIncomForm = {
          accountNo: val.accountNo,
          address: val.address,
          companyId: val.companyId,
          masterBroker: val.masterBroker,
          storeId: val.storeId,
          storeName: val.storeName,
          type: "",
          totalFee: "",
          registerTime: "",
          description: "",
      },
        this.ledger.parms = {
          companyId: "",
          storeId: "",
          accountNo: "",
          address: "",
          buildingId: "",
          masterBroker: ""
        }
      }
    },
    /*
    * 新增收入
    */
    newAddClick() {
      this.selectedTitle = '新增收入';
      this.dialogTableVisible = true;
      this.newIncomForm = {
        accountNo: "",
        address: "",
        companyId: "",
        masterBroker: "",
        storeId: "",
        type: "",
        totalFee: "",
        registerTime: this.timeDefault,
        description: ""
      }
    },
    /*
    * 新增明细
    * index 1 弹框   2 新增明细网络请求
    */
    newAddDetail(index) {
      if (index === 1) {
        this.selectedDetailTitle = "新增明细";
        this.dialogTableVisible2 = true
      }else {
        if (this.selectedDetailTitle === '新增明细') {
          // 新增明细接口
          this.$delete(this.detailForm,'id')
          this.detailForm.contractIncomeId = this.newIncomForm.contractIncomeId
          saveContractIncomeDetail(this.detailForm).then(res => {
            let {code,body} = res
            if(code == 1000) {
              // 查询明细接口
              this.getDetailList(this.detailForm.contractIncomeId);
            }
          })
          this.dialogTableVisible2 = false
        } else {
          // 修改明细接口
          updateContractIncomeDetail(this.detailForm).then(res => {
            let {code, body} = res
            if (code == 1000) {
              // 查询明细接口
              this.getDetailList(this.detailForm.contractIncomeId);
            }
          })
          this.dialogTableVisible2 = false
        }
      }
    },
    //收入审核
    changeAuditClick(contractIncomeId, isAudit){
      if (!contractIncomeId) {
        this.$message.error('请选择审核收入')
        return;
      }
      // isAudit 0 未审核   1 已审核   2 撤销审核
      let params = {
        isAudit : isAudit === 1 ? 2 : 1,
        contractIncomeId: contractIncomeId
      }
      tableAudit(params).then(res=>{
        if(res.msg == '成功'){
          this.$message({
            type: "success",
            message: isAudit === 1 ? "撤销审核成功!" : "审核成功!"
          });
          this.currentChange()
        }else{
          this.$message.error(isAudit === 1 ? '撤销失败' : '审核失败');
        }
      }).catch(err=>{
        this.$message.error(err.msg);
      })
    },
    /*
    * 删除收入
    */
    deleteTableData({ contractIncomeId }) {
      this.$confirm("此操作将删除该合同收入, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deteleTableContractIncome({ id: contractIncomeId }).then(res => {
            console.log(res);
            let { code } = res;
            if (code == 1000) {
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
    /*
    * 删除明细
    */
    deleteAll(){

      this.$confirm("此操作将删除该合同收入明细, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {

          let params = {
          contractIncomeDetailIds: [],
          contractIncomeId: this.detailForm.contractIncomeId || this.newIncomForm.contractIncomeId　
        }
        for (let i = 0; i < this.multipleSelection.length; i++) {
          const ele = this.multipleSelection[i];
          params.contractIncomeDetailIds.push(ele.id);
        }
        deleteContractIncome(params).then(res=>{
          let {code, body} = res
          if(code == 1000){
            this.getDetailList(this.detailForm.contractIncomeId || this.newIncomForm.contractIncomeId)
          }else{
            this.$message.error('删除失败');
          }
          }).catch(err=>{
            this.$message.error(err.msg);
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /*
    * 修改收入
    */
    changeApplyClick(index, {contractIncomeId}) {
      this.selectedTitle = '修改收入';
      this.dialogTableVisible = true;
      // 查询明细接口
      this.getDetailList(contractIncomeId);
      findContractIncomeById({id:contractIncomeId}).then(res => {
        let {code,body} = res
        if(code == 1000) {
          this.newIncomForm = body
        }
      })
    },
    /*
    * 查询明细
    */
    getDetailList(contractIncomeId) {
      // 查询明细
      console.log(`===================查询明细====================`)
      console.log(contractIncomeId)
      getContractIncomeList({contractIncomeId:contractIncomeId}).then(res => {
        let {code,body} = res
        if(code == 1000) {
          this.table2.list = body
        }
      })
    },
    /*
    * 选择台账
    */
    selectedTaiZhang() {
      this.buildingFind();
      this.getContractListRequest(1);
      this.dialogTableVisible3 = true;
    },
    /*
    * 明细修改
    */
    changeClick (ele) {
      this.selectedDetailTitle = "修改明细";
      let detailForm = {...ele} 
      delete detailForm.createTime;
      delete detailForm.createUser;
      this.detailForm = detailForm
      this.dialogTableVisible2 = true;
    },
    /*
    * 通过父类id查询所有公司
    */
    findCompanyByParentId() {
      find({ parentId: 10000 }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.companys = [{ name: "所有项", id: "" }, ...body];
        }
      });
    },
    /*
    * 通过公司查找门店
    */
    outlet(id) {
      findAllId({parentId:id}).then(res=>{
        console.log(res.body)
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
    /*
    * 查询全部合同收入
    */
    getList(val){
      let params = JSON.parse(JSON.stringify(this.searchForm))
      if(params.storeId && params.storeId.length>0){
        params.storeId = params.storeId.join(".")
      }else{
        params.storeId =""
      }

      params.page= this.table.pageNum;
      params.rows=this.table.pageSize;

      getContractIncomeByPage(params).then(res=>{
        let { code, body } = res;
        if (code == 1000) {
          if (body.rows != undefined) {
            this.table.list = body.rows
            this.table.total = body.total;
          }else {
            this.table.list = []
            this.table.total = 0;
          }
        }else{
          this.$message.error('查询失败');
        }
      }).catch(err=>{
       this.$message.error(err.msg);
      })
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
    * 查询台账
    */
    getContractListRequest(val) {
      if (val || val === 0) {
        this.ledger.page = val;
      }

      let params = JSON.parse(JSON.stringify(this.ledger.parms))
      if(params.storeId && params.storeId.length>0){
         params.storeId = params.storeId.join(".")
      }else{
        params.storeId =""
      }
      this.ledger.page= this.ledger.pageNum;
      this.ledger.rows=this.ledger.pageSize;
      let { page, rows } = this.ledger;
      getContractList({ ...params, page, rows }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (body.rows) {
            this.ledger.list = body.rows.map(item => {
              return {
                ...item,
                edit: false
              };
            });
            this.ledger.total = body.total;
            console.log(this.ledger.total);
          }else {
            this.ledger.list = [];
          }
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
    /*
    * 新增收入提交接口
    */
    newIncomSubmit(){
      
      let params = {
        accountNo: this.newIncomForm.accountNo,
        address: this.newIncomForm.address,
        companyId: this.newIncomForm.companyId,
        masterBroker: this.newIncomForm.masterBroker,
        storeId: this.newIncomForm.storeId,
        type: this.newIncomForm.type,
        totalFee: this.newIncomForm.totalFee,
        registerTime: this.newIncomForm.registerTime,
        description: this.newIncomForm.description,
        id: this.newIncomForm.contractIncomeId
      }
      if (this.selectedTitle !== '新增收入') {
        if(!params.totalFee){
          this.$message.error('收入总计不能为空');
          return
        }else if(!params.type){
          this.$message.error('请选择收入方式');
          return
        }else if (!params.description) {
          this.$message({type: "error", message: "请填写备注，它很重要！"});
          return;
        }
        console.log(params);
        updateContractIncome(params).then(res=>{
        console.log(res);
        if(res.msg === '成功'){
          this.$message({
            message: "修改成功！",
            type: "success"
          });
          this.dialogTableVisible = false;
          this.getList();
        }else{
          this.$message.error('修改失败');
        }
        }).catch(err=>{
          this.$message.error(err.msg);
        })

      }else {
        
        if(!params.accountNo){
          this.$message.error('台账编号不能为空');
          return
        }else if(!params.totalFee){
          this.$message.error('收入总计不能为空');
          return
        }else if(!params.type){
          this.$message.error('请选择收入方式');
          return
        }else if (!params.description) {
          this.$message({type: "error", message: "请填写备注，它很重要！"});
          return;
        }
        saveContractIncome(params).then(res=>{
        console.log(res);
        if(res.msg === '成功'){
          this.$message({
            message: "新增成功！",
            type: "success"
          });
          this.dialogTableVisible = false;
          this.getList();
        }else{
          this.$message.error('新增失败');
        }
        }).catch(err=>{
          this.$message.error(err.msg);
        })
      }
    }
  },
  mounted () {
    this.currentChange(1)
    this.findCompanyByParentId();
    this.findUserByName();
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
