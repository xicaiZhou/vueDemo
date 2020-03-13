<!--  -->
<template>
  <div class>
		<el-container>
			<el-aside width="300px">
				<div>
					<span>公司：</span>
					<el-select placeholder="请选择" size="mini" v-model="table5.parms.companyId">
						<el-option v-for="(item, i) in companys" :key="i" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</div>
				<br>
				<div>
					<span>年份：</span>
					<el-date-picker 
            v-model="table5.parms.date"
            size="mini" 
						style="width: 135px"
            type="date" 
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions0"
            ></el-date-picker>
						<el-button type="primary" style="width: 50px" size="mini" @click="querybyDate()">查询</el-button>
						<br>
						<br>
						<m-table
							:data="table5.list"
							:setting="table5.setting"
							:loading="table5.loading"
							:total="table5.total"
							:pageNum="table5.page"
							:pageSize="table5.rows"
              @dblhandleCurrentChange="dblhandleCurrentChange">
						</m-table>
				</div>
			</el-aside>
			<el-main>
				<el-button type="primary" size="small" @click="countingOperation()">盘点操作</el-button>
				<br>
				<br>
				<m-table
					:hasIndex="false"
					:hasPagination="false" 
					:data="table.list"
					:setting="table.setting"
					:loading="table.loading">
				</m-table>
				<br>
				<div>
          <h5 style="display: inline;">现金</h5>
          <!-- <el-button style="margin-left: 10px;" type="primary" size="small" @click="changeCash()">新增</el-button> -->
        </div>
        <br>
        <m-table
          :hasPagination="false" 
          :data="table2.list"
          :setting="table2.setting"
          :loading="table2.loading">
          <el-table-column label="操作" width="70px" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="changeCash(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </m-table>
				<br>
				<div>
					<h5 style="display: inline;">账户</h5>
					<el-button style="margin-left: 10px;" type="primary" size="small" @click="acccoutManage()">账户管理</el-button>
					<span class="leftMarg">账本总计(元)：</span>
					<span class="colorRed">{{parseFloat(Number(cashTotal) + Number(addSumsTotal)).toFixed(1)}}</span>
					<span class="leftMarg">现金总计(元)：</span>
					<span>{{parseFloat(Number(cashTotal)).toFixed(1)}}</span>
					<span class="leftMarg">账户总计(元)：</span>
					<span class="colorRed">{{parseFloat(Number(addSumsTotal)).toFixed(1)}}</span>
				</div>
				<br>
				<m-table
					:hasPagination="false" 
					:data="table3.list"
					:setting="table3.setting"
					:loading="table3.loading"
          :showSummary="true"
          :summaryMethod="summaryMethod">
					<el-table-column label="操作" width="70px" fixed="right">
						<template slot-scope="scope">
							<el-button type="text" @click="changeAccount(scope.row)">修改</el-button>
						</template>
					</el-table-column>
				</m-table>
				<br>
				<h5>流水帐</h5>
				<m-table
					:hasIndex="true" 
          :data="table6.list" 
          :setting="table6.setting"
          :total="table6.total"
          :pageNum="table6.page"
          :pageSize="table6.rows">
				</m-table>
			</el-main>
		</el-container>

		<!-- 修改现金弹框 -->
		<el-dialog width="400px" title="修改现金"
			:center="true"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false">
      <el-form label-width="90px" size="mini">
        <el-form-item label="百元">
          <el-input placeholder="请输入" v-model.number="table2.parms.hundredYuanNum" style="width: 200px;"></el-input><span class="leftM">张</span>
        </el-form-item>
				<el-form-item label="五十元">
          <el-input placeholder="请输入" v-model.number="table2.parms.fiftyYuanNum" style="width: 200px;"></el-input><span class="leftM">张</span>
        </el-form-item>
				<el-form-item label="二十元">
          <el-input placeholder="请输入" v-model.number="table2.parms.twentyYuanNum" style="width: 200px;"></el-input><span class="leftM">张</span>
        </el-form-item>
				<el-form-item label="十元">
          <el-input placeholder="请输入" v-model.number="table2.parms.tenYuanNum" style="width: 200px;"></el-input><span class="leftM">张</span>
        </el-form-item>
				<el-form-item label="五元">
          <el-input placeholder="请输入" v-model.number="table2.parms.fiveYuanNum" style="width: 200px;"></el-input><span class="leftM">张</span>
        </el-form-item>
				<el-form-item label="一元">
          <el-input placeholder="请输入" v-model.number="table2.parms.oneYuanNum" style="width: 200px;"></el-input><span class="leftM">张</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="handleSubmit" type="primary" size="mini">确 定</el-button>
        <el-button @click="dialogTableVisible = false" size="mini">取 消</el-button>
      </div>
    </el-dialog>
		<!-- 修改现金弹框END -->

    <!-- 查询卡号管理弹框 -->
		<el-dialog width="1000px" title="卡号管理"
      :visible.sync="dialogTableVisible1"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose">
      <el-form label-width="90px" size="mini" :inline="true">
        <el-form-item label="银行卡号">
          <el-input v-model="table4.parms.bankCardNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="addBankNo()">新增</el-button>
          <el-button size="mini" type="primary" @click="searchBankNo()">查询</el-button>
        </el-form-item>
      </el-form>
      <m-table
        :data="table4.list"
        :setting="table4.setting"
        :loading="table4.loading"
      >
        <el-table-column label="操作" width="160px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteBankNo(scope.row)">删除</el-button>
            <el-button type="text" @click="changeBankNo(scope.row)">修改</el-button>
            <el-button type="text" @click="stopBankNo(scope.row)" v-if="scope.row.status===1">停用</el-button>
            <el-button type="text" @click="stopBankNo(scope.row)" v-else>启用</el-button>
          </template>
        </el-table-column>
      </m-table>
    </el-dialog>
		<!-- 查询卡号管理弹框END -->

    <!-- 新增/修改卡号 -->
    <el-dialog
      title="新增卡号"
      :visible.sync="dialogTableVisible2"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <el-form label-width="80px" size="small" v-model="formCard">
        <el-form-item label="公司">
          <el-select placeholder="请选择" v-model="formCard.companyId" style="width: 350px">
            <el-option v-for="item in companys" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户银行">
          <el-input v-model="formCard.bankName" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="账户名称">
          <el-input v-model="formCard.bankUserName" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="*银行卡号">
          <el-input v-model="formCard.bankCardNo" style="width: 350px"></el-input>
        </el-form-item>
         <el-form-item label="*初始金额">
          <el-input class="minput" v-model="formCard.initialAmount" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formCard.remark" type="textarea" :rows="6" size="small" style="width: 450px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" type="primary" @click="submitStop(1)">确 定</el-button>
        <el-button size="mini" @click="dialogTableVisible2=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增/修改卡号END -->

    <!-- 修改卡号 -->
    <el-dialog
      title="修改卡号"
      :visible.sync="dialogTableVisible4"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <el-form label-width="80px" size="small" v-model="changeFormCard">
        <el-form-item label="公司">
          <el-select placeholder="请选择" v-model="changeFormCard.companyId" :disabled="true" style="width: 350px">
            <el-option v-for="item in companys" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开户银行">
          <el-input v-model="changeFormCard.bankName" :disabled="true" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="账户名称">
          <el-input v-model="changeFormCard.bankUserName" :disabled="true" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="*银行卡号">
          <el-input v-model="changeFormCard.bankCardNo" :disabled="true" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="changeFormCard.remark" type="textarea" :rows="6" size="small" style="width: 450px;"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="账户记录">
          <m-table
            :hasPagination="false" 
            :data="changeFormCard.companyCardVOList">
            <el-table-column label="公司" width="130">
              <template slot-scope="scope">
                <el-input v-model="scope.row.company" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="日期" width="130">
              <template slot-scope="scope">
                <el-input v-model="scope.row.date" :disabled="true"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="surplusAmount" label="账户余额" width="100">
              <template slot-scope="scope">
                <el-input placeholder="请输入" v-model="scope.row.surplusAmount"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70px">
              <template slot-scope="scope">
                <!-- <el-button type="text" v-if="scope.row.edit === 1" @click="toSave(scope)">编辑</el-button> -->
                <el-button type="text" @click="toSave(scope)">保存</el-button>
              </template>
            </el-table-column>
          </m-table>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改卡号END -->


    <!-- 修改账户 -->
    <el-dialog title="修改账户"
      :visible.sync="dialogTableVisible3"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="600px"
    >
      <el-form label-width="80px" size="small" v-model="table4.parms1">
        <el-form-item label="记录日期">
          <el-input v-model="table4.parms1.date" style="width: 350px" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="table4.parms1.bankCardNo" style="width: 350px" :disabled="true"></el-input>
        </el-form-item>
         <el-form-item label="*记录金额">
          <el-input class="minput" v-model="table4.parms1.surplusAmount" style="width: 350px"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="table4.parms1.remark" type="textarea" :rows="6" size="small" style="width: 450px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" type="primary" @click="submitAccountChange()">保 存</el-button>
        <el-button size="mini" @click="dialogTableVisible3=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改账户END -->

	</div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'
import { 
  getCompanyCardtByPage, 
  saveCompanyCard, 
  updateCompanyCard,
  cardDeleteById,
  cardFindyId,
  findFlowCash,
  updateFlowCash,
  findFlowCompanyCard,
  updateFlowCompanyCard,
  flowDetailByDay,
  flowGenerateFlowByDay } from "@/api/org-tempAccount";
import { findAll } from "@/api/org-dept";
import { log } from 'util';
import { findFlowDetailPage } from "@/api/org-tempAccount";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
		MTable
	},
  data() {
    //这里存放数据
    return {
      cashTotal: 0,
      addSumsTotal: 0,
      companys: [],
      dateAndCompany: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;//如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
			table: {// 五个金额
        loading:false,
        list: [],
        setting: [
          {
            label: "初始金额",
            value: "initAmount"
          },
          {
            label: "进账金额",
            value: "inAmount"
					},
					{
            label: "出账金额",
            value: "outAmount"
          },
          {
            label: "日结金额",
            value: "dayTotalAmount"
          },
          {
            label: "临时帐",
            value: "tempAmount"
          },
          {
            label: "合计金额",
            value: "totalAmount"
          }
        ]
			},
			table2: {// 现金
        loading:false,
        list: [{}],
        setting: [
          {
            label: "百元",
            value: "hundredYuanNum"
          },
          {
            label: "五十元",
            value: "fiftyYuanNum"
					},
					{
            label: "二十元",
            value: "twentyYuanNum"
          },
          {
            label: "十元",
            value: "tenYuanNum"
					},
					{
            label: "五元",
            value: "fiveYuanNum"
					},
					{
            label: "一元",
            value: "oneYuanNum"
          },
          {
            label: "现金合计",
            value: "total"
          }
        ],
        parms: {}
			},
			table3: {
        loading:false,
        list: [],
        setting: [
          {
            label: "公司",
            value: "company"
          },
          {
            label: "日期",
            value: "date"
					},
					{
            label: "开户银行",
            value: "bankName"
          },
          {
            label: "账户名称",
            value: "bankUserName"
					},
					{
            label: "银行卡号",
            value: "bankCardNo"
					},
					{
            label: "余额",
            value: "surplusAmount"
          }
        ]
      },
      table4: {
        loading:false,
        list: [],
        setting: [
          {
            label: "公司",
            value: "company"
          },
					{
            label: "开户银行",
            value: "bankName"
          },
          {
            label: "账户名称",
            value: "bankUserName"
					},
					{
            label: "银行卡号",
            value: "bankCardNo"
					},
					{
            label: "起始额",
            value: "initialAmount"
          },
					{
            label: "备注",
            value: "remark"
          },
					{
            label: "状态",
            value: "status",
						formatter(row, column, cellValue, index) {
							return cellValue === 1 ? "启用" : "停用";
            }
          },
					{
            label: "录入人",
            value: "createUser"
          },
					{
            label: "录入时间",
            value: "createTime"
          },
          {
            label: "修改人员",
            value: "updateUser"
          },
					{
            label: "修改时间",
            value: "updateTime"
          }
        ],
        parms: {
          bankCardNo: ""
        },
        parms1: {
          companyId: "",
          date: "",
          flowId: "",
          id: "",
          remark: "",
          bankCardNo: "",
          surplusAmount: ""
        }
      },
      formCard: {
        companyId: "",
        bankName: "",
        bankUserName: "",
        bankCardNo: "",
        initialAmount: "",
        remark: "",
        company: "",
        id: ""
      },
      changeFormCard: {},
      accountSurplusAmount: "",
      table5: {
        loading:false,
        list: [],
        setting: [
          {
            label: "公司",
            value: "company"
          },
          {
            label: "日期",
            value: "date"
					}
        ],
        parms: {
          companyId: "",
          date: "",
        },
				total: 20,
        page: 1,
        rows: 20
			},
			table6: {
        loading:false,
        list: [],
        setting: [
          {
            label: "类型",
            value: "budgetType"
          },
          {
            label: "凭证",
            value: "confirmNo"
					},
					{
            label: "房源地址",
            value: "houseAddress"
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
            label: "金额",
            value: "budgetAmount"
          },
          {
            label: "余额",
            value: "balance"
          },
          {
            label: "摘要",
            value: "description"
          },
          {
            label: "入账人员",
            value: "entryUserName"
          },
          {
            label: "更新人员",
            value: "updateUserName"
          }
        ],
        parms: {
          companyId: "",
          entryDateBegin: "",
          entryDateEnd: ""
        },
        total: 10,
        page: 1,
        rows: 10
      },
			dialogTableVisible: false,
      dialogTableVisible1: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisible4: false
		};
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {
    "table5.parms.companyId"(val) {
      if (val) {
        this.queryAllYearByCompany(val)
      }
    }
  },
  //方法集合
  methods: {
    /**
     * 通过公司日期查询
    */
    querybyDate() {
      this.queryAllYearByCompany(this.table5.parms.companyId);
    },
    /**
     * 双击日期查看当天的数据
    */
    dblhandleCurrentChange(ele){
      this.table5.parms = {
        companyId: this.table5.parms.companyId,
        date: ele.date
      }
      this.countingOperation();
    },
    /**
     * 盘点操作（查询）
    */
    countingOperation() {
      let param = {
        companyId: this.table5.parms.companyId
      }
      flowGenerateFlowByDay(param).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.$message({
            type: "success",
            message: "盘点成功!"
          })
          this.queryFlowByDay();
          this.queryCachByCompanyAndDate();
          this.queryByAccount();
          this.flowDetails(1);
        }else {
          this.$message({
            type: "error",
            message: "盘点失败!"
          })
        }
      }).catch(error => {
        this.$message({
          type: "error",
          message: error
        })
      })
    },
    /**
     * 四个金额查询（按照公司&日期）
    */
    queryFlowByDay() {
      flowDetailByDay(this.table5.parms).then(res => {
        let { code, body } = res;
        if (code == 1000 && body != undefined) {
          this.table.list = [ body ];
        }else {
          this.table.list = [];
        }
      }).catch(() => {
        this.table.list = [];
      })
    },
    /**
     * 现金查询（按照公司&日期）
    */
    queryCachByCompanyAndDate() {
      findFlowCash(this.table5.parms).then(res => {
        let { code, body } = res;
        if (code == 1000 && body != undefined) {
          this.cashTotal = body.total;
          this.table2.list = [ body ];
        }else {
          this.table2.list = [{}];
          this.cashTotal = 0;
        }
      }).catch(() => {
        this.table2.list = [{}];
        this.cashTotal = 0;
      })
    },
    /**
     * 账户查询
    */
    queryByAccount() {
      findFlowCompanyCard(this.table5.parms).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.table3.list = body;
        }else {
          this.table3.list = [];
        }
      })
    },
    handleClose(done) {
      this.queryByAccount();
      done();
    },
    /**
     * 现金新增/修改
    */
    changeCash(val) {
      this.dialogTableVisible = true;
      this.table2.parms = { ...val };
    },
    /**
     * 现金新增/修改提交按钮
    */
    handleSubmit() {
      delete this.table2.parms.total
      this.table2.parms.company = this.companys.find(item => item.id == this.table5.parms.companyId).name
      this.table2.parms.companyId = this.table5.parms.companyId
      this.table2.parms.date = this.table5.parms.date
      updateFlowCash(this.table2.parms).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.$message({
            type: "success",
            message: "修改成功!"
          })
          this.dialogTableVisible = false;
          this.queryCachByCompanyAndDate();
        }else {
          this.$message({
            type: "error",
            message: "修改失败!"
          })
        }
      })
    },
    /**
     * 账户管理
    */
    acccoutManage() {
      this.dialogTableVisible1 = true;
      this.searchBankNo();
    },
    /**
     * 账户修改卡号余额
    */
    changeAccount(val) {
      this.dialogTableVisible3 = true;
      this.table4.parms1 = {
        companyId: val.companyId,
        date: val.date,
        flowId: val.flowId,
        bankCardNo: val.bankCardNo,
        id: val.id,
        remark: val.remark,
        surplusAmount: val.surplusAmount
      }
    },
    /**
     * 修改账户提交接口
    */
    submitAccountChange() {
      if (this.table4.parms1.surplusAmount === '' || this.table4.parms1.surplusAmount === undefined) {
        this.$message({
          type: "error",
          message: "记录余额不能为空!"
        });
        return;
      }
      updateFlowCompanyCard(this.table4.parms1).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.dialogTableVisible3 = false;
          this.queryByAccount();
        }else {
          this.$message({
            type: "error",
            message: "修改失败!"
          });
        }
      })
    },
    /**
     * 账户余额求累加和
    */
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((c, index) => {
        if (index === 0) {
          sums[index] = '余额合计'
        } else if (index === 6) {
          let sum = 0
          data.forEach(d => {
            sum += d.surplusAmount
          })
          sums[index] = sum
        } else {
          sums[index] = ''
        }
      })
      this.addSumsTotal = sums[6];
      return sums
    },
    /**
     * 新增卡号
    */
    addBankNo() {
      this.dialogTableVisible2 = true;
      this.formCard = {
        companyId: "",
        bankName: "",
        bankUserName: "",
        bankCardNo: "",
        initialAmount: "",
        remark: "",
        company: "",
        id: ""
      }
    },
    /**
     * 新增/修改卡号确定提交按钮
    */
    submitStop(index) {
      if (index === 1) {
        if (this.formCard.bankCardNo === '' || this.formCard.bankCardNo === undefined) {
          this.$message({
            type: "error",
            message: "银行卡号不能为空!"
          });
          return;
        }
        if (this.formCard.initialAmount === '' || this.formCard.initialAmount === undefined) {
          this.$message({
            type: "error",
            message: "初始金额不能为空!"
          });
          return;
        }
        delete this.formCard.id
        this.formCard.company = this.companys.find(item => item.id === this.formCard.companyId).name
        saveCompanyCard(this.formCard).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              type: "success",
              message: "新增成功!"
            });
            this.dialogTableVisible2 = false;
            this.searchBankNo();
          }
        })
      }else {

        let params = {
          bankName: this.changeFormCard.bankName,
          bankUserName: this.changeFormCard.bankUserName,
          bankCardNo: this.changeFormCard.bankCardNo,
          companyCardUpdateRequests: this.changeFormCard.companyCardVOList,
          remark: this.changeFormCard.remark,
          id: this.changeFormCard.id
        }
        updateCompanyCard(params).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.dialogTableVisible4 = false;
            this.searchBankNo();
            this.queryByAccount();
          }
        })
      }
    },
    //更新保存 请求接口
    toSave({ row, $index }) {
      this.changeFormCard.companyCardVOList[$index].id = row.id
      this.changeFormCard.companyCardVOList[$index].surplusAmount = row.surplusAmount
      this.submitStop(2);
    },
    /**
     * 查询卡号(根据银行卡号)
    */
    searchBankNo() {
      getCompanyCardtByPage(this.table4.parms).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.table4.list = body;
        }
      })
    },
    /**
     * 删除卡号
    */
    deleteBankNo(val) {
      this.$confirm("此操作将删除该卡号,不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          cardDeleteById(val.id).then(res => {
            let { code } = res;
            if (code == 1000) {
              this.$message({
              type: "success",
              message: "删除成功!"
            });

            this.searchBankNo();
            }
          })
        })
    },
    /**
     * 修改卡号
    */
    changeBankNo(val) {
      this.cardTitle = "修改卡号";
      this.dialogTableVisible4 = true;
      
      cardFindyId(val.id).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.changeFormCard.companyCardVOList = body.companyCardVOList;
          this.changeFormCard = body;
        }
      })
    },
    /**
     * 停用/启用卡号
    */
    stopBankNo(val) {
      updateCompanyCard({status: val.status === 1 ? 0 : 1, id: val.id}).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              type: "success",
              message: val.status === 1 ? "停用成功!" : "启用成功!"
            });
            this.dialogTableVisible2 = false;
            this.searchBankNo();
          }
        })
    },
    /**
     * 相应公司的流水查询
    */
    flowDetails(val) {
      if (val || val === 0) {
        this.table3.page = val;
      }
      this.table6.parms.companyId = this.table5.parms.companyId
      this.table6.parms.entryDateBegin = this.table5.parms.date
      this.table6.parms.entryDateEnd = this.table5.parms.date

      let { page, rows, parms } = this.table6;
      findFlowDetailPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.table6.list = body.rows
          this.table6.total = body.total;
        }
      });
    },
    /**
     * 根据公司查询全年的日期
    */
    queryAllYearByCompany(companyId) {
      let companyName = this.companys.find(item => item.id == companyId).name
      let arr = [];
      let param = {};
      let sTime = moment(this.table5.parms.date).format("YYYY-MM-DD");
      let eTime = moment(Date.now()).format("YYYY-MM-DD");
      let days = this.getdiffdate(sTime, eTime);
      
      for (let i = 0; i < days.length; i++) {
        param = {
          company: companyName,
          date: days[i]
        }
        arr.unshift(param);
      }
      this.table5.list = arr;
    },
    /*
    * 查询所有的公司
    */
    findAllCompany(callBackId){
      findAll({ level: "2" }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.companys = [...body];
          callBackId(this.companys[0].id)
        }
      });
    },
    /**
     * 获取当前日期
    */
    timeDefault() {
      var date = new Date();
      var s1 = date.getFullYear() + "-" + ((date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ("0" + (date.getMonth() + 1))) + "-" + (date.getDate() >= 10 ? date.getDate() : ("0" + date.getDate()));
      return s1;
    },
    /**
     * 指定日期到当前日期到天数
    */
    dateDiff(sDate) {
      var date2 = new Date();
      var s1 = sDate;
      var date1 = new Date(Date.parse(s1.replace(/-/g,   "/")));
      var iDays = parseInt(Math.abs(date2.getTime()- date1.getTime()) /1000/60/60/24);
      return iDays;
    },
    /**
     * 获取两日期之间日期列表函数
    */
    getdiffdate(stime,etime) {
      //初始化日期列表，数组
      var diffdate = new Array();
      var i=0;
      //开始日期小于等于结束日期,并循环
      while(stime<=etime){
        diffdate[i] = stime;
        
        //获取开始日期时间戳
        var stime_ts = new Date(stime).getTime();
        // console.log('当前日期：'+stime   +'当前时间戳：'+stime_ts);
        
        //增加一天时间戳后的日期
        var next_date = stime_ts + (24*60*60*1000);
        
        //拼接年月日，这里的月份会返回（0-11），所以要+1
        var next_dates_y = new Date(next_date).getFullYear()+'-';
        var next_dates_m = (new Date(next_date).getMonth()+1 < 10)?'0'+(new Date(next_date).getMonth()+1)+'-':(new Date(next_date).getMonth()+1)+'-';
        var next_dates_d = (new Date(next_date).getDate() < 10)?'0'+new Date(next_date).getDate():new Date(next_date).getDate();

        stime = next_dates_y+next_dates_m+next_dates_d;
        
        //增加数组key
        i++;
      }
      return diffdate;
    }
	},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    
    this.findAllCompany((callBackId => {
      this.table5.parms.date = this.timeDefault();
      this.table5.parms.companyId = callBackId;
      this.countingOperation();

    }));

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style>
.mContainer .el-table__body tr.current-row > td {
  background-color: #ffec8b !important;
}
</style>
<style lang='scss' scoped>
.el-aside {
  margin-top: 20px;
}
.leftMarg {
	margin-left: 80px;
	font-size: 15px;
}
.leftM {
	margin-left: 10px;
}
.colorRed {
	margin-left: 10px;
	font-size: 16px;
	color: red;
	font-weight: bold;
}
h5 {
  font-size: 16px;
  margin-bottom: 10px;
}
</style>