<template>
  <div class="mContainer">
    <div class="contorl">
      <el-button
        type="primary"
        size="mini"
        v-if="permissions.storeManager"
        :disabled="((approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 1 || approve.isManager == 1 || approve.isAudit == 1) ? true  : false)"
        @click="auditor(2,0)"
      >店长审核</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="permissions.storeManager"
        :disabled="((approve.isFlow == 1 || approve.isShopowner == 5 || approve.isShopowner == 0 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)"
        @click="auditor(2,1)"
      >撤销店长审核</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="permissions.manager"
        :disabled="((approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 1 || approve.isAudit == 1) ? true : false)"
        @click="auditor(3,0)"
      >经理审核</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="permissions.manager"
        :disabled="((approve.isFlow == 1 || approve.isManager == 5 || approve.isManager == 0 || approve.isAudit == 1) ?  true : false)"
        @click="auditor(3,1)"
      >撤销经理审核</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="permissions.finance"
        :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 1) ?  true : false)"
        @click="auditor(4,0)"
      >财务确认</el-button>
      <el-button
        type="primary"
        size="mini"
        v-if="permissions.finance"
        :disabled="((approve.isFlow == 1 || approve.isAudit == 5 || approve.isAudit == 0) ?  true : false)"
        @click="auditor(4,1)"
      >撤销财务确认</el-button>
    </div>
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
        
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
        <el-form-item label="门牌号" prop="address">
          <el-input placeholder="请输入门牌号" v-model="searchForm.address"></el-input>
        </el-form-item>
        <el-form-item label="台账编号" prop="accountNo">
          <el-input placeholder="请输入台账编号" v-model="searchForm.accountNo"></el-input>
        </el-form-item>
        <el-form-item label="收支编号" prop="contractExpenditureNo">
          <el-input class="minput" v-model="searchForm.contractExpenditureNo"></el-input>
        </el-form-item>
        <el-form-item label="录入人" prop="createUser">
          <el-select placeholder="请选择" v-model="searchForm.createUser">
            <el-option v-for="(item, i) in createUsers" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支出日期">
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
      ref="mtable"
      :hasIndex="true"
      :hasPaginationSizes="true"
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageSize="table.pageSize"
      :notChangeRow="notChangeRow"
      @currentChange="currentChange"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="text"
            :disabled="(scope.row.isShopowner !== 0) || (scope.row.isManager !== 0) || (scope.row.isAudit !== 0)" 
            @click="changeApplyClick(scope.row)"
            size="small"
          >修改收入</el-button>
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

    <!-- 新增或者修改支出 -->
    <el-dialog 
      :title="selectedTitle" 
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisible" width="1050px">
      <el-form label-width="90px" size="small" :inline="true">
        <el-form-item label="*台账编号">
          <el-input v-model="newIncomForm.accountNo" :disabled="true" class="minput" style="width: 250px"></el-input>
          <el-button type="primary" size="mini" @click="selectedTaiZhang()">选择</el-button>
        </el-form-item>
        <el-form-item label="房源地址">
          <el-input v-model="newIncomForm.address" class="minput" :disabled="true"></el-input>
        </el-form-item>
        <!-- <el-form-item v-if="selectedTitle !== '新增支出'" label="支出明细">
          <p>
            <el-button type="primary" size="mini" @click="newAddDetail(1)">新增明细</el-button>
            <el-button type="danger" size="mini" @click="deleteAll()">删除明细</el-button>
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
        <el-form-item label="*支出总计">
          <el-input v-model="newIncomForm.totalFee" class="minput"></el-input>
        </el-form-item>
        <!-- <el-form-item label="支出日期">
          <el-date-picker v-model="newIncomForm.registerTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item> -->
        <el-form-item label="*支出方式">
          <el-select v-model="newIncomForm.type" placeholder="请选择">
            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <br />
        <el-form-item label="*备注">
          <el-input v-model="newIncomForm.description" type="textarea" :rows="5" size="small" style="width: 500px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="toSubmit">提交</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增或者修改支出 END -->

    <!-- 新增或者修改明细 -->
    <el-dialog 
      :title="selectedDetailTitle" 
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisible2" width="700px">
      <el-form label-width="90px" :inline="true">
        <el-form-item label="支出分类" prop="bigClassification">
          <el-select placeholder="请选择" v-model="detailForm.bigClassification">
            <el-option v-for="item in bigClassOptions" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支出小类" prop="smallClassification">
          <el-select placeholder="请选择" v-model="detailForm.smallClassification">
            <el-option v-for="item in smallClassTypes" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支出项目" prop="project">
          <el-select placeholder="请选择" v-model="detailForm.project">
            <el-option v-for="item in projectTypes" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单 价">
          <el-input v-model="detailForm.unitPrice" class="minput"></el-input>
        </el-form-item>
        <el-form-item label="数 量">
          <el-input v-model="detailForm.quantity" class="minput"></el-input>
        </el-form-item>
        <el-form-item label="单 位">
          <el-select v-model="detailForm.unit" placeholder="请选择">
            <el-option v-for="item in unitTypes" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装费">
          <el-input v-model="detailForm.installationFee" class="minput"></el-input>
        </el-form-item>
        <el-form-item label="运 费">
          <el-input v-model="detailForm.transportFee" class="minput"></el-input>
        </el-form-item>
        <el-form-item label="金额合计">
          <el-input v-model="detailForm.totalFee" class="minput"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="newAddDetail(2)" type="primary">提交</el-button>
        <el-button @click="dialogTableVisible2 = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 新增或者修改明细 END -->

    <!-- 选择台账 -->
    <el-dialog 
      title="选择台账" 
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="dialogTableVisible3" width="800px">
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
            :disabled="(ledger.parms.companyId) ? false: true"
          ></el-cascader>
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

  </div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'

import { 
  deleteContractExpenditureDetail,
  getContractExpenditureDetailList,
  saveContractExpenditureDetail,
  updateContractExpenditureDetail,
  findContractExpenditureById,
  getContractExpenditureByPage, 
  saveContractExpenditure,
  updateContractExpenditure,
  deleteContractExpenditure,
  shopownerAudit,
  managerAudit,
  contractExpenditureAudit,
  } from "@/api/org-contractExpenditure";
import { find, findAllId } from "@/api/org-dept";
import { FindByName } from "@/api/org-user";
import { buildingFindAll } from "@/api/org-house";
import { getContractList, getContractListById } from "@/api/org-ledger";
import { findFlowDetailPage } from "@/api/org-tempAccount";

export default {
  components: {
    MTable
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
      detailForm:{
        contractExpenditureId: '',
        bigClassification: '',
        installationFee: '',
        project: '',
        quantity: '',
        smallClassification: '',
        totalFee: '',
        transportFee: '',
        unit: '',
        unitPrice: ''
      },
      searchForm:{
        endTime:'',
        beginTime:'',
        address: '',
        accountNo: '',
        companyId: '',
        createUser: '',
        storeId: '',
        contractExpenditureNo: '',
        page: 1,
        rows: 10
      },
      newIncomForm: {
        accountNo: "",
        address: "",
        companyId: "",
        description: "",
        id: "",
        isAudit: 0,
        isManager: 0,
        isShopowner: 0,
        storeId: "",
        totalFee: "",
        type: ""
      },
      permissions: {
        broker: false,
        storeManager: false,
        finance: false,
        manager: false
      },
      approve: {
        isShopowner: 5,
        isManager: 5,
        isAudit: 5,
        allStatus: false,
        isFlow: 0,// 0是没有流水凭证，1是有
      },
      selectedTitle: "",
      selectedDetailTitle: "",
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
            value: "contractExpenditureNo",
            width: 230
          },
          {
            label: "申请日期",
            value: "registerTime",
            width: 120
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
            label: "支出金额",
            value: "totalFee"
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
            width: 160
          },
          {
            label: "录入人",
            value: "createUser"
          },
          {
            label: "备注",
            value: "description",
            width: 300
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
          roomName: "",
          buildingId: "",
          masterBroker: ""
        },
        total: 10,
        pageNum: 1,
        pageSize: 10
      },
      payOptions: [{ value: 1, label: "现金" }, { value: 2, label: "转账" }, { value: 3, label: "Pos机" }, { value: 4, label: "微信" }, { value: 5, label: "支付宝" }],
      unitTypes: [ {name: "个"}, {name: "台"}, {name: "件"}, {name: "米"} ],
      buildings: [{ name: "所有项", id: "" }],
      companys: [{ name: "所有项", id: "" }],
      createUsers: [{ name: "所有项", id: "" }],
      storeOptions: [],
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
      multipleSelection:[],
      dialogTableVisible: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      currentRow: '',
      notChangeRow: false
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
      if (val) this.outlet(val, 1);
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
      this.getList(1)
    },
    /*
    * 默认选中的是第一行数据，选中数据赋值
    */ 
    handleCurrentChange(val){
      if(!val) return
      this.approve = val
      this.approve.allStatus = true
      this.table3.parms = {
        companyId: val.companyId,
        storeId: val.storeId,
        budgetNo: val.contractExpenditureNo
      }
      this.flowDetails(1);
      this.currentRow = val
    },
    /*
    * 默认多选的是第一行数据，选中数据赋值
    */ 
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
    * 分页查询合同支出Table数据
    */ 
    getList(val) {
      this.approve  ={
        isShopowner: 5,
        isManager: 5,
        isAudit: 5,
        allStatus: false
      }

      let params = JSON.parse(JSON.stringify(this.searchForm))
      if(params.storeId && params.storeId.length>0){
        params.storeId = params.storeId.join(".")
      }else{
        params.storeId =""
      }

      params.page= this.table.pageNum;
      params.rows=this.table.pageSize;
      
      getContractExpenditureByPage(params).then(res => {
        let { code, body } = res;
        if(code == 1000) {
          if (body.rows != undefined) {
            this.table.list = body.rows
            this.table.total = body.total;
            this.$nextTick(() => {
              this.notChangeRow = true
              if (!this.currentRow)  {
                console.log('this.currentRow is null')
                return
              }
              this.$refs.mtable.setCurrentRow(this.table.list.find(d => d.contractExpenditureNo === this.currentRow.contractExpenditureNo))
            })
          }else {
            this.approve.isFlow = 1
            this.table.list = []
            this.table.total = 0;
          }
        }else {
          this.$message({type: "error", message: "查询失败"});
        }
      });
    },
    /*
    * 新增或者修改明细按钮事件
    * index 1 弹框   2 新增明细网络请求
    */ 
    newAddDetail(index){
      if (index === 1) {
        this.selectedDetailTitle = "新增明细";
        this.dialogTableVisible2 = true
      }else {
        if (this.selectedDetailTitle === '新增明细') {
          // 新增明细接口
          this.$delete(this.detailForm,'id')
          this.detailForm.contractExpenditureId = this.newIncomForm.id
          saveContractExpenditureDetail(this.detailForm).then(res => {
            let {code,body} = res
            if(code == 1000) {
              // 查询明细接口
              this.getDetailList(this.detailForm.contractExpenditureId);
            }
          })
          this.dialogTableVisible2 = false
        } else {
          // 修改明细接口
          updateContractExpenditureDetail(this.detailForm).then(res => {
            let {code, body} = res
            if (code == 1000) {
              // 查询明细接口
              this.getDetailList(this.detailForm.contractExpenditureId);
            }
          })
          this.dialogTableVisible2 = false
        }
      }
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
            contractExpenditureDetailIds: [],
            contractExpenditureDetailId: this.detailForm.contractExpenditureDetailId || this.newIncomForm.id
          }
          for (let i = 0; i < this.multipleSelection.length; i++) {
            const ele = this.multipleSelection[i];
            params.contractExpenditureDetailIds.push(ele.id);
          }
          deleteContractExpenditureDetail(params).then(res=>{
            let {code, body} = res
            if(code == 1000){
              this.getDetailList(this.detailForm.contractExpenditureDetailId || this.newIncomForm.id)
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
    * 删除收入
    */
    deleteTableData({ contractExpenditureId }) {
      this.$confirm("此操作将删除该合同收入, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteContractExpenditure({ id: contractExpenditureId }).then(res => {
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
    * 新增或者修改支出按钮事件
    */ 
    toSubmit(){
      if (!this.newIncomForm.accountNo) {
        this.$message({type: "error", message: "请先选择台账编号"});
        return;
      }

      if (!this.newIncomForm.totalFee) {
        this.$message({type: "error", message: "请输入支出总计"});
        return;
      }

      if (!this.newIncomForm.type) {
        this.$message({type: "error", message: "请选择支出方式"});
        return;
      }

      if (!this.newIncomForm.description) {
        this.$message({type: "error", message: "请填写备注，它很重要！"});
        return;
      }

      this.newIncomForm.totalFee = Number(this.newIncomForm.totalFee)
      
      if (this.selectedTitle === '新增支出') {
        saveContractExpenditure(this.newIncomForm).then(res => {
          console.log(res)
          let {code, body} = res
          if (code == 1000) {
            this.$message({type: "success", message: "新增成功"});
            this.dialogTableVisible = false
            this.currentChange()
          }else {
            this.$message({type: "error", message: "新增失败"});
          }
        }).catch(err=>{
          this.$message.error(err.msg);
        })
      }else {
        
        updateContractExpenditure(this.newIncomForm).then(res => {
          console.log(res)
          let {code, body} = res
          if (code == 1000) {
            this.$message({type: "success", message: "修改成功"});
            this.dialogTableVisible = false
            this.currentChange()
          }else {
            this.$message({type: "error", message: "修改失败"});
          }
        }).catch(err=>{
          this.$message.error(err.msg);
        })
      }
    },
    /*
    * 新增支出 dialog 
    */
    newAddClick() {
      this.selectedTitle = "新增支出";
      this.dialogTableVisible = true;
      this.newIncomForm = {
        accountNo: "",
        address: "",
        companyId: "",
        description: "",
        id: "",
        isAudit: 0,
        isManager: 0,
        isShopowner: 0,
        storeId: "",
        totalFee: "",
        type: ""
      };
    },
    /*
    * 修改收入 dialog 
    */
    changeApplyClick(val) {
      this.selectedTitle = "修改支出";
      this.dialogTableVisible = true;
      // 查询明细接口
      this.getDetailList(val.contractExpenditureId);
      findContractExpenditureById({id:val.contractExpenditureId}).then(res => {
        let {code,body} = res
        if(code == 1000) {
          this.newIncomForm = {
            accountNo: body.accountNo,
            address: body.address,
            companyId: body.companyId,
            description: body.description,
            id: body.contractExpenditureId,
            registerTime: body.registerTime,
            storeId: body.storeId,
            totalFee: body.totalFee,
            type: body.type
          } 
        }
      })
    },
    /*
    * 选择台账 dialog 
    */
    selectedTaiZhang() {
      this.buildingFind();
      this.getContractListRequest(1);
      this.dialogTableVisible3 = true;
    },
    /*
     * 选择台账 按钮 事件
     */
    sureSelectedLedger(val) {
      console.log(val);
      this.dialogTableVisible3 = false;
      if (val) {
        (this.newIncomForm = {
          accountNo: val.accountNo,
          address: val.address,
          companyId: val.companyId,
          description: "",
          registerTime: "",
          storeId: val.storeId,
          totalFee: "",
          type: ""
        }),
          (this.ledger.parms = {
            companyId: "",
            storeId: "",
            accountNo: "",
            address: "",
            buildingId: "",
            masterBroker: ""
          });
      }
    },
    /*
    * 查询明细
    */
    getDetailList(contractExpenditureId) {
      // 查询明细
      // console.log(`===================查询明细====================`)
      // console.log(contractExpenditureId)
      getContractExpenditureDetailList({contractExpenditureId:contractExpenditureId}).then(res => {
        let {code,body} = res
        if(code == 1000) {
          this.table2.list = body
        }
      })
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
    * 店长，经理，财务三级审核
    */
    auditor(val1, val2) {
      //审批
      switch (val1) {
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
          message: "请先选择对应门店"
        });
        return;
      }
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          type = type - 1;
          switch (type) {
            case 1:
              const params = {
                isAudit: this.approve.isAudit,
                isManager: this.approve.isManager,
                isShopowner: status ? 0 : 1,
                contractExpenditureIds: [this.approve.contractExpenditureId]
              };
              // 请使用合同支出的审核接口（下同）
              shopownerAudit(params).then(res => {
                this.getList();
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              });
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
                contractExpenditureIds: [this.approve.contractExpenditureId]
              };
              managerAudit(params1).then(res => {
                this.getList();
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              });
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
                contractExpenditureIds: [this.approve.contractExpenditureId]
              };
              contractExpenditureAudit(params2).then(res => {
                this.getList();
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
    this.findUserByName();
    this.findCompanyByParentId();
    if (this.$store.getters.userinfo) {
      // 在不同的地方调用方法的时候，这个变量的的类型是不一样的，JSON.parse()里的参数只能是string类型
      const userinfo =
        typeof this.$store.getters.userinfo == "string"
          ? JSON.parse(this.$store.getters.userinfo)
          : this.$store.getters.userinfo;
      /*
       * broker   经纪人
       * storeManager   店长
       * manager   经理
       * finance   财务
       */
      this.permissions = userinfo.permissions;
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
