<template>
  <div>
    <div class="table_margin">
      <br>
			<el-form label-width="90px" size="small" :inline="true">
				<el-button type="primary" size="small" @click="entryWork()">录入业绩</el-button>
			</el-form>
			<br>
			<!-- 新增/修改实际业绩 -->
			<el-dialog width="750px" :title="workTitle==='add'?'新增实际业绩':'修改实际业绩'" 
				:visible.sync="dialogTableVisible"
				:close-on-click-modal="false"
				:show-close="false"
				:close-on-press-escape="false">
				<el-form label-width="90px" size="small" :inline="true" ref="form">
					<el-form-item v-if="workTitle!=='add'" label="*录入编号" class="redItem">
						<el-input style="width: 200px;" class="minput" v-model="dialogForm.id" :disabled="true"></el-input>
					</el-form-item>
					<br>
					<el-form-item label="*选择台账" class="redItem">
						<el-input v-model="dialogForm.accountNo" :disabled="true" class="minput"></el-input>
						<!-- <el-button type="primary" size="small" @click="showChooseLedger()">选 择</el-button> -->
					</el-form-item>
					<br>
					<el-form-item label="房源地址">
						<el-input style="width: 585px;" v-model="dialogForm.address" :disabled="true" class="minput"></el-input>
					</el-form-item>
					<br>
					<br>
					<el-form-item label="*分配人员" class="redItem">
						<el-input :disabled="true" class="minput" v-model="dialogForm.assignee"></el-input>
						<el-button type="primary" size="small" @click="selectedPeople()">选 择</el-button>
					</el-form-item>
          
					<m-cascader :companyId.sync="dialogForm.companyId" :storeId.sync="dialogForm.storeId"></m-cascader>

					<br>
					<el-form-item label="*业绩日期" class="redItem">
						<el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.performanceDate" :disabled="true"></el-date-picker>
					</el-form-item>
					<br>
					<el-form-item label="*新业绩" class="redItem">
						<el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.newPerformance"></el-input>
					</el-form-item>
					<el-form-item label="*老业绩" class="redItem">
						<el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.oldPerformance"></el-input>
					</el-form-item>
					<el-form-item label="*所属月份" class="redItem">
						<el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.month"></el-date-picker>
					</el-form-item>
					<br>
					<el-form-item label="*预计业绩" class="redItem">
						<el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.estimatePerformance" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="*历史录入" class="redItem">
						<el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.historyPerformance"></el-input>
					</el-form-item>
					<el-form-item label="剩余业绩">
						<el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.surplusPerformance" :disabled="true"></el-input>
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
			<!-- 新增/修改实际业绩 -->

			<!-- 主/副成交人 -->
			<trader ref="trader" @choose="chooseTrader"></trader>
			<!-- 主/副成交人 -->
    </div>

    <!--业绩明细-->
		<h3>业绩明细</h3>
		<div class="table_margin">
			<el-form label-width="90px" size="small" :inline="true">
				<el-form-item label="预计业绩金额" label-width="96px">
					<el-input class="minput" disabled :value="prePerformanceAmount"></el-input>
				</el-form-item>
				<el-form-item label="已录业绩合计" label-width="96px">
					<el-input class="minput" disabled :value="info.newOldPerformanceAmount"></el-input>
				</el-form-item>
				<el-form-item label="剩余业绩">
					<el-input class="minput" disabled :value="surplusPerformanceAmount"></el-input>
				</el-form-item>		
			</el-form>
			<m-table
			:hasIndex="true"
			:data="list"
			:setting="setting"
			:loading="loading"
			:hasPagination="false">
        <el-table-column label="操作" width="90px" fixed="right">
					<template slot-scope="scope">
						<el-button 
							type="text" 
							@click="changeWork(scope.row)" 
							:disabled="scope.row.isShopowner == 1"
							size="small"
							>修改</el-button>
						<el-button 
							type="text" 
							@click="deleteWork(scope.row)" 
							:disabled="scope.row.isShopowner == 1"
							size="small"
							style="color:red"
							>删除</el-button>
						<!-- <el-button 
							type="text" 
							@click="stopWork(scope.row)" 
							:disabled="scope.row.isShopowner == 1"
							size="small"
							>停用</el-button> -->
					</template>
				</el-table-column>
			</m-table>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import MTable from "@/components/Table";
import MCascader from "@/components/department/mcascader";
import Ledger from "@/views/org-agencyContract/ledger";
import Trader from "@/views/org-agencyContract/trader"; //分配人员
import { FindByName } from "@/api/org-user";
import { 
  getActual,
  saveActualPerformance,
  updateActualPerformance,
  removeActualPerformance,
  actualPerformanceFindbyId } from "@/api/org-actualPerformance";

export default {
  components: {
    MTable,
    Ledger,
		Trader,
		MCascader
  },
  props: {
    accountNo: {
      type: String,
      default: ''
		},
		actualDate: {
			type: String,
      default: ''
    },
    address: {
			type: String,
      default: ''
    },
    prePerformanceAmount: {
      type: String | Number,
      default: ''
    }
  },
  data() {
    return  {
      info: {},
      loading: false,
      setting: [
        {
          label: "录入月份",
          value: "month",
          formatter(row, column, cellValue, index) {
            return cellValue == "Invalid date" ? "" : cellValue;
          }
        },
        {
          label: "分配人员",
          value: "assignee"
        },
        {
          label: "截止日期",
          value: "actualDate"  
        },
        {
          label: "预计业绩",
          value: "estimatePerformance"
        },
        {
          label: "新业绩",
          value: "newPerformance"
        },{
          label: "老业绩",
          value: "oldPerformance"
        },{
          label: "剩余业绩",
          value: "surplusPerformance"
        },{
          label: "操作人",
          value: "createUser"
        },{
          label: "店长审核人",
          value: "shopowner"
        },{
          label: "财务审核人",
          value: "auditor"
        },{
          label: "操作时间",
          value: "createTime"   
        },{
          label: "备 注",
          value: "description"
        }
      ],
      dialogForm: {
        accountNo: '',
        assignee: '',
				address: '',
				companyId: '',
        storeId: '',
        id: '',
        description: '',
        month: '',
        performanceDate: '',
        newPerformance: 0.0,
        oldPerformance: 0.0,
        estimatePerformance: 0.0,
        historyPerformance: 0.0,
        surplusPerformance: 0.0
      },
			workTitle: 'add',
			createUsers: [{ name: "所有项", id: "" }],
			dialogTableVisible: false,
      approve:{
        isShopowner: 5,
        isAudit: 5,
        allStatus: false,
      }
    }
  },
  watch: {
    "dialogForm.newPerformance"(val) {
      // 新业绩
      this.dialogForm.surplusPerformance = this.dialogForm.estimatePerformance-val-this.dialogForm.oldPerformance-this.dialogForm.historyPerformance
    },
    "dialogForm.oldPerformance"(val) {
      // 老业绩
      this.dialogForm.surplusPerformance = this.dialogForm.estimatePerformance-val-this.dialogForm.newPerformance-this.dialogForm.historyPerformance
    },
    "dialogForm.historyPerformance"(val) {
      // 历史录入
      this.dialogForm.surplusPerformance = this.dialogForm.estimatePerformance-val-this.dialogForm.newPerformance-this.dialogForm.oldPerformance
    }
  },
  //监听属性 类似于data概念
  computed: {
    list() {
      return this.info.actualPerformanceVOS || []
    },
    form() {
      return {
        accountNo: this.dialogForm.accountNo,
        assignee: this.dialogForm.assignee,
        address: this.dialogForm.address,
        companyId: this.dialogForm.companyId,
        storeId: this.dialogForm.storeId,
        id: this.dialogForm.id,
        description: this.dialogForm.description,
        month: this.dialogForm.month,
        performanceDate: this.dialogForm.performanceDate,
        newPerformance: this.dialogForm.newPerformance,
        oldPerformance: this.dialogForm.oldPerformance,
        estimatePerformance: this.dialogForm.estimatePerformance,
        historyPerformance: this.dialogForm.historyPerformance,
        surplusPerformance: this.dialogForm.surplusPerformance
      };
    },
    surplusPerformanceAmount() {
      return Number(Number(this.prePerformanceAmount) - Number(this.info.newOldPerformanceAmount)).toFixed(2)
    }
  },
  methods: {
    initData() {
      this.findUserByName().then(() => {
        this.getData()
      })
    },
    /**
     * 获取录入业绩数据
    */
    getData() {
			const form = {
				accountNo: this.accountNo,
				actualDate: this.actualDate
			}
      getActual(form).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.info.actualPerformanceVOS = body.actualPerformanceVOS.map(j => {
            j.assignee = this.createUsers.find(item => item.id == j.assignee).name
          })
					this.info = body || {}
        }
      }).catch(err => {
				console.error(err)
			});
		},
		handleCurrentChange(val){ //单选
      if(!val) return
      this.approve = val
		},
		/**
		 * 新增实际业绩（触发弹窗）
		*/
		entryWork() {
			this.dialogForm = {
        accountNo: this.accountNo,
        assignee: '',
				address: this.address,
				companyId: '',
        storeId: '',
        id: '',
        description: '',
        month: '',
        performanceDate: this.actualDate,
        newPerformance: 0.0,
        oldPerformance: 0.0,
        estimatePerformance: this.prePerformanceAmount,
        historyPerformance: 0.0,
        surplusPerformance: 0.0
      };
      this.workTitle = 'add'
      this.dialogTableVisible = true
		},
		/**
		 * 修改实际业绩（触发弹窗）
		*/
		changeWork(val) {
			this.workTitle = 'edit'
      actualPerformanceFindbyId(val.id).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.dialogForm = { ...body }
          this.dialogForm.assignee = this.createUsers.find(item => item.id == this.dialogForm.assignee).name
          this.dialogTableVisible = true
        }else {
          this.$message({
            message: '查询失败',
            type: "error"
          });
        }
      })
		},
		/**
		 * 删除实际业绩
		*/
		deleteWork({id}) {
      removeActualPerformance({ id: id}).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getData();
          this.dialogTableVisible = false
        }else {
          this.$message({
            message: '删除失败',
            type: "error"
          });
        }
      })
		},
		/**
		 * 新增/修改实际业绩
		*/
		handleSubmit() {
      delete this.form.companyId
      delete this.form.storeId
      
			if (this.form.assignee == "" || this.form.assignee == undefined) {
				this.$message({
					type: "error",
					message: "请先选择分配人员"
				});
				return
      }

      if (this.form.month == "" || this.form.month == undefined) {
				this.$message({
					type: "error",
					message: "请选择月份"
				});
				return
      }

      if (this.form.description == "" || this.form.description == undefined) {
				this.$message({
					type: "error",
					message: "请填写备注"
				});
				return
      }

      if (this.dialogForm.month != undefined || this.dialogForm.month != '') {
        this.form.month = moment(this.dialogForm.month).format(
					"YYYY-MM-DD"
				);
			}

			this.form.assignee = this.createUsers.find(item => item.name == this.dialogForm.assignee).id
			
			this.form.performanceDate = moment(this.dialogForm.performanceDate).format(
				"YYYY-MM-DD"
			);
      
      if (this.workTitle==='add') {
        delete this.form.id
        saveActualPerformance(this.form).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.getData();
            this.dialogTableVisible = false
          }else {
            this.$message({
              message: '新增失败',
              type: "error"
            });
          }
        })
      }else {
        updateActualPerformance(this.form).then(res => {
          let { code, body } = res;
          if (code == 1000) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getData();
            this.dialogTableVisible = false
          }else {
            this.$message({
              message: '修改失败',
              type: "error"
            });
          }
        })
      }
		},
		/**
		 * 选择分配人员
		*/
		selectedPeople() {
			this.$refs.trader.show();
		},
		/**
		 * 获取被选中的分配人员信息
		*/
    chooseTrader(data) {
      this.$nextTick(() => {
        this.dialogForm.assignee = data.name
        this.dialogForm.companyId = data.companyId
        this.dialogForm.storeId = data.storeId
      })
    },
		/*
    * 查询所有录入人
    */
    findUserByName() {
      return FindByName({}).then(res => {
        let { code, body } = res;
        // debugger
        if (code == 1000) {
          this.createUsers = [{ name: "所有项", id: "" }, ...body];
        }
      });
    }
  }
}
</script>

