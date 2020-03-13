<template>
  <div class="mContainer">
    <div class="contorl">
      <!-- 流水审核通过，所有按钮禁止点击 -->
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="approve.isFlow === 1 || approve.isAudit == 1 ? true : false" @click="changeAuditClick(approve.officeIncomeId, approve.isAudit)">财务确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="approve.isFlow === 1 || approve.isAudit != 1 ? true : false" @click="changeAuditClick(approve.officeIncomeId, approve.isAudit)">撤销财务确认</el-button>
    </div>
    <div class="mtools">
      <el-form label-width="90px" :model="searchForm" ref="searchForm" size="small" :inline="true">
        <el-form-item label="公 司">
          <el-select  v-model="searchForm.companyId" placeholder="请选择">
            <el-option v-for="item in companys" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门 店">
          <el-cascader 
            v-model="searchForm.storeId" 
            clearable
            :show-all-levels="false" 
            :options="storeOptions" 
            :disabled="(searchForm.companyId) ? false: true"></el-cascader>
        </el-form-item>
        <el-form-item label="收支编号">
          <el-input class="minput" v-model="searchForm.officeIncomeNo"></el-input>
        </el-form-item>
        <el-form-item label="录入人"  >
          <el-select placeholder="请选择" v-model="searchForm.createUser"> 
            <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收入日期" >
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
          <el-button type="primary" @click="docreate()">新 增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      :hasIndex="true"
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      @currentChange="currentChange"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="scope">
           <el-button type="text" :disabled="scope.row.isAudit == 1 ? true : false" @click="docreate(scope.row)" size="small">修改收入</el-button>
           <el-button type="text" :disabled="scope.row.isAudit == 1 ? true : false" @click="deleteTableData(scope.row)" size="small" style="color: red;">删除</el-button>
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

    <el-dialog 
      title="支出明细" 
      :visible.sync="dialogTableVisible4"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="1000px">
      <el-form label-width="90px" size="small" :inline="true">
        <m-table
          :hasPagination="false"
          :data="table2.list"
          :setting="table2.setting"
        ></m-table>
      </el-form>
    </el-dialog>
    <el-dialog 
      :title="dialogTableVisibleTitle" 
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="1000px">
      <el-form label-width="90px" :model="projectForm" ref="projectForm" :inline="true" size="small">
        <el-form-item label="收入公司" prop="companyId">
          <el-select placeholder="请选择" v-model="projectForm.companyId" :label="projectForm.company">
            <el-option v-for="(item, i) in companys" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收入门店" prop="storeId">
          <el-cascader v-model="projectForm.storeId" clearable :show-all-levels="false" :options="storeOptions" :disabled="(projectForm.companyId) ? false: true"></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="支出明细" v-if='editTitle'>
          <p>
            <el-button  type="primary" size="mini" @click="dialogTable()">新增明细</el-button>
            <el-button  type="danger" size="mini" @click="deleteAll()">删除明细</el-button>
          </p>
          <m-table
            :hasPagination="false"
            :data="table2.list"
            :setting="table2.setting"
            :hasSelection="true"
            @currentChange="currentChange"
            @handleSelectionChange='handleSelectionChange'
          >
          <el-table-column label="操作" width="60px" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="dialogTable(scope)">修改</el-button>
            </template>
          </el-table-column>
          </m-table>
        </el-form-item> -->
        <el-form-item label="收入总计" prop='totalFee'>
          <el-input type="number" class="minput" v-model="projectForm.totalFee" ></el-input>
        </el-form-item>
        <!-- <el-form-item label="登记日期" prop="registerTime">
          <el-date-picker
            v-model="projectForm.registerTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="收入方式" prop="type">
          <el-select placeholder="请选择"  v-model="projectForm.type">
             <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="*备注"  prop="description">
          <el-input type="textarea" :rows="6" v-model="projectForm.description" style="width:500px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="doSave()" type="primary">提交</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 明细 -->
    <el-dialog 
      :title="ruleFromTilte"  
      :visible.sync="dialogTableVisible2"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="700px">
      <el-form label-width="90px" :model="ruleForm" ref="ruleForm" :inline="true" size="small">
        <el-form-item prop="bigClassification" label="收入分类">
          <el-select v-model="ruleForm.bigClassification" placeholder="请选择"> 
            <el-option v-for="item in projectOptions" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="project" label="收入项目">
          <el-select placeholder="请选择" v-model="ruleForm.project"> 
            <el-option v-for="item in peopleOptions" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="unitPrice" label="单价">
          <el-input type="number" v-model="ruleForm.unitPrice"></el-input>
        </el-form-item>
        <el-form-item prop="quantity" label="数量">
          <el-input type="number" v-model="ruleForm.quantity"></el-input>
        </el-form-item>
        <el-form-item prop="unit" label="单位">
          <el-select   v-model="ruleForm.unit" placeholder="请选择"> 
            <el-option v-for="item in unitTypes" :key="item.name" :label="item.name" :value="item.name"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="installationFee" label="安装费">
          <el-input  type="number"  v-model="ruleForm.installationFee"></el-input>
        </el-form-item>
        <el-form-item prop="transportFee" label="运费">
          <el-input type="number"   v-model="ruleForm.transportFee"></el-input>
        </el-form-item>
        <el-form-item prop="totalFee" label="金额合计">
          <el-input type="number"  v-model="ruleForm.totalFee"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="detailedAdd()" type="primary">提交</el-button>
        <el-button @click="dialogTableVisible2 = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'

import { 
  findAll,
  find,
  findAllId } from "@/api/org-dept";
import { FindByName } from "@/api/org-user";
import { 
  officeIncomeSave,
  officeIncomeDelete,
  getOfficeIncomeFind,
  detailAudit,
  detailUpdate,
  detailDelete, 
  officeIncomeUpdate,
  getOfficeIncomeList,
  detailSave,
  detailList } from '@/api/org-officeIncome'
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
      newProps:{
       checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          let form = {
            parentId: null
          }
          if (node.data && node.data.id) form.parentId = node.data.id
          find(form).then(res => {
            if (res && res.body && res.body.length > 0) {
              let data = []
              res.body.forEach(element => {
                data.push({
                  id: element.id,
                  value: element.id,
                  label: element.name,
                  leaf: element.leaf
                })
              })
              resolve(data)
            }
          })
          return
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
            label: "收支编号",
            value: "officeIncomeNo",
            width: 230
          },
          {
            label: "收入日期",
            value: "registerTime",
            width: 120
          },
          {
            label: "收入金额",
            value: "",
            formatter(row, column, cellValue, index) {
              if(!row.totalFee){
                return 0.00;
              }
              return row.totalFee
            }
          },
          {
            label: "摘要",
            value: "description",
            width: 300
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
            label: "审核人员",
            value: "auditor"
          },
          {
            label: "录入时间",
            value: "createTime",
            width: 160
          },
          {
            label: "录入人",
            value: "",
            formatter(row, column, cellValue, index) {
              return row.createUser
            }
          }
        ],
        total: 10,
        page: 1,
        rows: 10
      },
      createUsers: [{ name: "所有项", id: "" }],
      projectForm:{
        id:'',
        companyId:'',
        storeName:'',
        company:'',
        officeIncomeId:'',
        storeId:'',
        type:1,
        remake:'',
        detail:[],
        paytotal:null
      },
      dialogTableVisibleTitle:'',
      editTitle:false,
      ruleFromTilte:'',
      table2: {
        list: [{}],
        applyDate: '',
        setting: [
          {
            label: "收入分类",
            value: "",
            formatter(row, column, cellValue, index) {
                return "办公类";
            }
          },
          {
            label: "项目",
            value: "",
            formatter(row, column, cellValue, index) {
              if(row.project === '4'){
                return "饮用水";
              }else if(row.project === '1'){
                return "A4纸";
              }else if(row.project === '2'){
                return "笔";
              }else if(row.project === '3'){
                return "磨盒";
              }else if(row.project === '5'){
                return "电费";
              }else if(row.project === '6'){
                return "水费";
              }else if(row.project === '7'){
                return "网费";
              }else if(row.project === '8'){
                return "墨粉";
              }else if(row.project === '9'){
                return "其他";
              }
              return '其他'
            }
          },
          {
            label: "单位",
            value: "",
            formatter(row, column, cellValue, index) {
              if(row.unit === '4'){
                return "米";
              }else if(row.unit === '1'){
                return "个";
              }else if(row.unit === '2'){
                return "台";
              }else if(row.unit === '3'){
                return "件";
              }
              return '无'
            }
          },
          {
            label: "数量",
            value: "",
            formatter(row, column, cellValue, index) {
              if(!row.quantity){
                return "0";
              }
              return row.quantity
            }
          },
          {
            label: "单价",
            value: "",
            formatter(row, column, cellValue, index) {
              if(!row.unitPrice){
                return "0.00";
              }
              return row.unitPrice
            }
          },
          {
            label: "安装费",
            value: "",
            formatter(row, column, cellValue, index) {
              if(!row.installationFee){
                return "0.00";
              }
              return row.installationFee
            }
          },
          {
            label: "运费",
            value: "",
            formatter(row, column, cellValue, index) {
              if(!row.transportFee){
                return "0.00";
              }
              return row.transportFee
            }
          },
          {
            label: "总计",
            value: "",
            formatter(row, column, cellValue, index) {
              if(!row.totalFee){
                return "0.00";
              }
              return row.totalFee
            }
          },]
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
      ruleForm:{
        bigClassification:'',
        id:'',
        installationFee:'',
        officeIncomeId:'',
        project:'',
        quantity:'',
        smallClassification:'',
        totalFee:'',
        transportFee:'',
        unit:'',
        unitPrice:'',
      },
      searchForm:{
        beginTime:'',
        createUser:'',
        companyId:'',
        endTime:'',
        officeIncomeNo:'',
        storeId:'',
      },
      payOptions:[{
          value: 1,
          label: '现金'
      },{
          value: 2,
          label: '转账'
      },{
          value: 3,
          label: 'Pos机'
      },{
          value: 4,
          label: '微信'
      },{
          value: 5,
          label: '支付宝'
      }],
      projectOptions:[{
          name: '办公类'      
      }],
      peopleOptions:[
        {name: "A4纸"}, 
        {name: "笔"},
        {name: "磨盒"},
        {name: "饮用水"},
        {name: "电费"},
        {name: "水费"},
        {name: "网费"},
        {name: "墨粉"},
        {name: "其他"}],
      unitTypes: [ 
        {name: "个"},
        {name: "台"},
        {name: "件"},
        {name: "米"} ],
      companys: [],
      doorAddOptions: [{ name: "所有项", id: "" }],      
      dialogTableVisible: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisible4: false,
      multipleSelection:[],
      storeOptions:[],
      permissions: {
        finance: false
      },
      approve: {
        isAudit: 0,
        isFlow: 0,// 0是没有流水凭证，1是有
        officeIncomeId: '' 
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
    "projectForm.companyId"(val) {
      if(val) this.outlet(val)
    },
  },
  methods: {
    loadNode(node, resolve) {
      const _this = this
      // 加载一级部门
      if (node.level === 0) {
        _this.findParent(callBack => {
          resolve(callBack)
        })
        return
      }
      // 加载子部门
      if (node.data && node.data.id) {
        _this.findData(node.data.id, callBack => {
          resolve(callBack)
        })
      }
    },
    findParent(callBack) {
      //查询父数据
      let _this = this
      find().then(res => {
        if (res.body && res.body.length) {
          let dataArr = res.body.map(i => {
            i.statusFlag = i.status ? '启用' : '停用'
            return i
          })
        }
        callBack(res.body)
      })
    },
    findData(parentId, callBack) {
      //查询子数据
      const _this = this
      find({ parentId: parentId }).then(res => {
        if (res.body && res.body.length) {
          let dataArr = res.body.map(i => {
            i.statusFlag = i.status ? '启用' : '停用'
            return i
          })
        }
        callBack(res.body)
      })
    },
    currentChange(val) {
      this.table.pageNum = val;
      this.getList()
    },
    handleCurrentChange(val){ //单选
      if(!val) return
      this.approve = val
      this.table3.parms = {
        companyId: val.companyId,
        storeId: val.storeId,
        budgetNo: val.officeIncomeNo
      }
      this.flowDetails(1);
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
    dialogTable(e){
      // 新增申请明细
      if(!e){
        this.ruleFromTilte = '新增申请明细';
      }else{
        this.ruleFromTilte = '修改申请明细';
        this.ruleForm = {...e.row};
      }
      this.dialogTableVisible2= true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 收入修改弹窗
    docreate(e){
      this.dialogTableVisible = true;
      if(!e){
        this.dialogTableVisibleTitle = '新增办公收入';
        this.editTitle = false;
        console.log(this.timeDefault)
        this.projectForm = {
          id:'',
          companyId:'',
          storeName:'',
          company:'',
          officeIncomeId:'',
          storeId:'',
          type:1,
          remake:'',
          detail:[],
          paytotal:null
        }
      }else{
        this.editTitle = true;
        this.dialogTableVisibleTitle = '编辑办公收入';
        this.projectForm = e;
        this.getDetailList();

        let params = {
          id:e.officeIncomeId
        }
        getOfficeIncomeFind(params).then(res=>{
          if(res.msg === '成功'){
            this.projectForm = res.body;
            this.projectForm.officeIncomeId = res.body.officeIncomeId;
            let newStoreId = []
            if(this.projectForm.storeId){
              this.projectForm.storeId = this.projectForm.storeId.split(".")
              
              this.projectForm.storeId.map(o=>{
                newStoreId.push(Number(o))
              })
            }
            this.projectForm.storeId = newStoreId
          }
        }).catch(err=>{
           this.$message.error(err.msg);
        })
      }
    },
    findUserByName() {
      FindByName({}).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.createUsers = [{ name: "所有项", id: "" }, ...body];
        }
      });
    },
    /*
    * 删除收入
    */
    deleteTableData({ officeIncomeId }) {
      this.$confirm("此操作将删除该办公收入, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          officeIncomeDelete({ id: officeIncomeId }).then(res => {
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
    doSave(){
      if (this.projectForm.companyId === '') {
        this.$message({
          type: "error",
          message: "请选择公司"
        });
        return;
      }
      
      this.projectForm.company = this.companys.find((item) => item.id === this.projectForm.companyId).name;

      let params = JSON.parse(JSON.stringify(this.projectForm))
      if(params.storeId && params.storeId.length>0){
         params.storeId = params.storeId.join(".")
      }else{
        params.storeId =""
      }
      this.projectForm.storeId = params.storeId

      if (this.projectForm.storeId === '') {
        this.$message({
          type: "error",
          message: "请选择门店"
        });
        return;
      }
      if (this.projectForm.description === '') {
        this.$message({
          type: "error",
          message: "请填写备注，它很重要！"
        });
        return;
      }

      if(this.editTitle){
        officeIncomeUpdate(this.projectForm).then(res=>{
          if(res.msg === '成功'){
            this.getList(1);
            this.$nextTick(()=>{
              this.$refs['projectForm'].resetFields();
            })
          }else{
            this.$message.error('更新失败');
          }
          this.dialogTableVisible = false;
        }).catch(err=>{
          this.$message.error(err.msg);
        })
      }else{
        officeIncomeSave(this.projectForm).then(res=>{
          if(res.msg === '成功'){
            this.getList(1);
             this.$nextTick(()=>{
              this.$refs['projectForm'].resetFields();
            })
          }else{
            this.$message.error('新增失败');
          }
          this.dialogTableVisible = false
        }).catch(err=>{
         this.$message.error(err.msg);
        })
      }
    },
    deleteAll(){
      let params = {
        officeIncomeDetailIds: [],
        officeIncomeId: this.projectForm.officeIncomeId ||　this.projectForm.id　
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const ele = this.multipleSelection[i];
        params.officeIncomeDetailIds.push(ele.id);
      }
      detailDelete(params).then(res=>{
        if(res.msg == '成功'){
          this.getDetailList()
        }else{
          this.$message.error('删除失败');
        }
      }).catch(err=>{
        this.$message.error(err.msg);
      })
    },
    find() {
      findAll({ level: "2" }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.companys = [ ...body ];
        }
      });
    },
    getList(val){
      let params = JSON.parse(JSON.stringify(this.searchForm))
      if(params.storeId && params.storeId.length>0){
         params.storeId = params.storeId.join(".")
      }else{
        params.storeId =""
      }
      params.page= this.table.page;
      params.rows=this.table.rows;

      getOfficeIncomeList(params).then(res=>{
        if(res.msg === '成功'){
          this.table.list = res.body.rows;
          this.table.total = res.body.total;
        }else{
          this.$message.error('查询失败');
        }
        
      }).catch(err=>{
       this.$message.error(err.msg);
      })
    },
    // 新增或者修改明细
    detailedAdd(){
      this.ruleForm.officeIncomeId = this.projectForm.id;
      if(this.ruleFromTilte == '新增申请明细'){
        detailSave(this.ruleForm).then(res=>{
          if(res.msg === '成功'){
            this.getDetailList();
          }else{
            this.$message.error('新增失败')
          }
          this.$refs['ruleForm'].resetFields();
          this.dialogTableVisible2 = false;
        }).catch(err=>{
          this.$message.error(err.msg)
        })
      }else{
        detailUpdate(this.ruleForm).then(res=>{
          if(res.msg === '成功'){
            this.getDetailList();
          }else{
            this.$message.error('修改失败')
          }
         this.$refs['ruleForm'].resetFields();
          this.dialogTableVisible2 = false;
        }).catch(err=>{
          this.$message.error(err.msg)
        })
      }
    },
    // 查询明细
    getDetailList(e){
      let params={}
      if(e){
         params.officeIncomeId = e;
      }else{
         params.officeIncomeId=this.projectForm.officeIncomeId || this.projectForm.id;
        
      }
      detailList(params).then(res=>{
        if(res.msg === '成功'){
          this.table2.list = res.body;

        }else{
          this.$message.error('查询失败');
        }
      }).catch(err=>{
       this.$message.error(err.msg)
      })
    },
    //收入审核
    changeAuditClick(officeIncomeId, isAudit){
      if (!officeIncomeId) {
        this.$message.error('请选择审核收入')
        return;
      }
      // isAudit 0 未审核   1 已审核   2 撤销审核
      let params = {
        isAudit : isAudit === 1 ? 2 : 1,
        officeIncomeId: officeIncomeId
      }
      detailAudit(params).then(res=>{
        if(res.msg == '成功'){
          this.$message({
            type: "success",
            message: isAudit === 1 ? "撤销审核成功!" : "审核成功!"
          });
          this.getList()
        }else{
          this.$message.error(isAudit === 1 ? '撤销失败' : '审核失败');
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
    }
  },
  mounted(){
    this.findUserByName();
    this.find();
    this.getList();
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
