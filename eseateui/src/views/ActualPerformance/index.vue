<!-- 实际业绩 -->
<template>
	<div class="mContainer">
    <div class="contorl">
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.isShopowner == 5 || approve.isShopowner == 1 || approve.isAudit == 1) ? true  : false)" @click="auditor(2,0)">店长确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.storeManager" :disabled="((approve.isShopowner == 5 || approve.isShopowner == 0 || approve.isAudit == 1) ? true  : false)" @click="auditor(2,1)">撤销店长确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.isAudit == 5 || approve.isAudit == 1) ?  true : false)" @click="auditor(4,0)">财务确认</el-button>
      <el-button type="primary" size="mini" v-if="permissions.finance" :disabled="((approve.isAudit == 5 || approve.isAudit == 0) ?  true : false)" @click="auditor(4,1)">财务取消</el-button>
    </div>
		<div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
				<m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId" storeLabel="分配门店"></m-cascader>
        <el-form-item label="店内编号">
          <el-input class="minput" v-model="table.parms.storeNo"></el-input>
        </el-form-item>
        <el-form-item label="分配人员">
          <el-select placeholder="请选择" v-model="table.parms.assignee">
            <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员停用">
          <el-select placeholder="请选择" v-model="table.parms.userStatus">
            <el-option v-for="item in userStatuses" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员状态">
          <el-select placeholder="请选择" v-model="table.parms.leave">
            <el-option v-for="item in leaves" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input class="minput" v-model="table.parms.accountNo"></el-input>
        </el-form-item>
				<el-form-item label="所属月份">
          <el-date-picker
            v-model="table.parms.beginPerformanceDate"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart">
          </el-date-picker>
          至
          <el-date-picker
            v-model="table.parms.endPperformanceDate"
            type="date"
            placeholder="选择日期时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsEnd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="currentChange(1)">查 询</el-button>
					<!-- <el-button type="primary" @click="entryWork()">录入业绩</el-button> -->
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
      <el-table-column label="操作" width="95px" fixed="right">
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
        </template>
      </el-table-column>
    </m-table>
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
					<el-button type="primary" size="small" @click="showChooseLedger()">选 择</el-button>
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
          <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.performanceDate"></el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="*新业绩" class="redItem">
          <el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.newPerformance"></el-input>
        </el-form-item>
        <el-form-item label="*老业绩" class="redItem">
          <el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.oldPerformance"></el-input>
        </el-form-item>
        <el-form-item label="所属月份">
          <el-date-picker type="date" placeholder="选择日期" v-model="dialogForm.month"></el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="*预计业绩" class="redItem">
          <el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.estimatePerformance"></el-input>
        </el-form-item>
        <el-form-item label="*历史录入" class="redItem">
          <el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.historyPerformance"></el-input>
        </el-form-item>
				<el-form-item label="剩余业绩">
          <el-input class="minput" oninput="value=value.replace(/[^\d.]/g,'')" v-model="dialogForm.surplusPerformance"></el-input>
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

		<!-- 选择台账 -->
    <ledger ref="ledger" @sureSelect="sureSelectedLedger"></ledger>
    <!-- 选择台账END -->

		<!-- 主/副成交人 -->
    <trader ref="trader" @choose="chooseTrader"></trader>
    <!-- 主/副成交人 -->

	</div>
</template>

<script>
import { FindByName } from "@/api/org-user";
import MTable from "@/components/Table";
import MCascader from "@/components/department/mcascader";
import moment from 'moment'
import Ledger from "@/views/org-agencyContract/ledger";
import Trader from "@/views/org-agencyContract/trader"; //分配人员
import { 
  getActualPerformanceByPage,
  saveActualPerformance,
  updateActualPerformance,
  removeActualPerformance,
  actualPerformanceFindbyId,
  shopownerAudit,
  financialAudit } from "@/api/org-actualPerformance";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
		MTable,
		MCascader,
		Ledger,
		Trader
	},
  data() {
    //这里存放数据
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.table.parms.endPperformanceDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.beginPerformanceDate;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
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
            label: "所属月份",
						value: "month",
            formatter(row, column, cellValue, index) {
              return cellValue == "Invalid date" ? "" : cellValue;
            }
          },
          {
            label: "分配人员",
            value: "assignee",
            formatter(row, column, cellValue, index) {
              return cellValue;
            }
          },
          {
            label: "预计业绩",
            value: "estimatePerformance"
          },
          {
            label: "新业绩",
						value: "newPerformance"
					},
					{
            label: "老业绩",
						value: "oldPerformance"
					},
					{
            label: "历史业绩",
						value: "historyPerformance"
					},
					{
            label: "剩余业绩",
						value: "surplusPerformance"
          },
          {
            label: "台账编号",
            value: "accountNo"
          },
          {
            label: "店内编号",
						value: "storeNo"
          },
          {
            label: "房源地址",
            value: "address",
            width: 200
          },
          {
            label: "业绩日期",
						value: "performanceDate"
          },
          {
            label: "店长确认",
						value: "isShopowner",
						formatter(row, column, cellValue, index) {
              return cellValue == 1 ? "已审核" : "未审核";
            }
					},
					{
            label: "店长",
						value: "shopowner"
					},
					{
            label: "财务确认",
						value: "isAudit",
						formatter(row, column, cellValue, index) {
              return cellValue == 1 ? "已审核" : "未审核";
            }
					},
					{
            label: "财务",
						value: "auditor"
          },
          {
            label: "备注说明",
            value: "description",
						width: 300
          },
					{
            label: "录入时间",
						value: "createTime",
						width: 120
					},
					{
            label: "录入人",
						value: "createUser"
					},
        ],
        parms: {
          accountNo: "",
          companyId: "",
          assignee: "",
          storeId: "",
          userStatus: 1,
          leave: 1,
          beginPerformanceDate: "",
          endPperformanceDate: "",
          storeNo: ""
        },
        total: 10,
        page: 1,
        rows: 10
			},
			permissions: {
        broker: false,
        storeManager: false,
        finance: false,
        manager: false
      },
      approve:{
        isShopowner: 5,
        isAudit: 5,
        allStatus: false,
			},
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
      userStatuses: [{ name: "所有项", id: "" },{ name: "停用", id: 0 },{ name: "启用", id: 1 }],
      leaves: [{ name: "所有项", id: "" },{ name: "离职", id: 0 },{ name: "在职", id: 1 }],
			dialogTableVisible: false
		};
  },
  //监听属性 类似于data概念
  computed: {
    form() {
      return {
        accountNo: this.dialogForm.accountNo,
        assignee: this.dialogForm.assignee,
        address: this.dialogForm.address,
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
    }
  },
  //监控data中的数据变化
  watch: {
		"table.parms.beginPerformanceDate"(val) {
      if (val) {
        this.table.parms.beginPerformanceDate = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.beginPerformanceDate = "";
      }
    },
    "table.parms.endPperformanceDate"(val) {
      if (val) {
        this.table.parms.endPperformanceDate = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.endPperformanceDate = ""
      }
    }
	},
  //方法集合
  methods: {
		/**
     * 获取分页数据
    */
    currentChange(val) {
      if (val || val === 0) {
        this.table.page = val;
      }
      let { page, rows, parms } = this.table;
      getActualPerformanceByPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          if (body.rows != undefined) {
            this.table.list = body.rows.map(j => {
              j.assignee = this.createUsers.find(item => item.id == j.assignee).name
            })
            this.table.list = body.rows;
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
            this.table.list = [];
            this.table.total = body.total;
          }
        }
      });
    },
    handleCurrentChange(val){ //单选
      if(!val) return
      this.approve = val
      this.currentRow = val
    },
		/**
		 * 新增实际业绩（触发弹窗）
		*/
		entryWork() {
			this.dialogForm = {
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
      };
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
          this.currentChange(1);
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
      if (this.form.accountNo == "" || this.form.accountNo == undefined) {
				this.$message({
					type: "error",
					message: "请先选择台账"
				});
				return
			}
			if (this.form.assignee == "" || this.form.assignee == undefined) {
				this.$message({
					type: "error",
					message: "请先选择分配人员"
				});
				return
			}
      if (this.dialogForm.month != undefined || this.dialogForm.month != '') {
        this.form.month = moment(this.dialogForm.month).format(
					"YYYY-MM-DD"
				);
			}
			if (this.dialogForm.performanceDate == undefined || this.dialogForm.performanceDate == '') {
        this.$message({
					type: "error",
					message: "请先选择业绩日期"
				});
				return
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
            this.currentChange(1);
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
            this.currentChange(1);
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
		 * 选择台账编号
		*/
		showChooseLedger() {
      this.$refs.ledger.show();
		},
		/**
		 * 获取被选中的台账编号信息
		*/
    sureSelectedLedger(ledger) {
      let getLedger = { ...ledger }
      this.dialogForm.accountNo = getLedger.accountNo
      this.dialogForm.address = getLedger.address
      this.dialogForm.companyId = getLedger.companyId
      this.dialogForm.storeId = getLedger.storeId
			console.log("getLedger=====",getLedger);
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
      })
    },
    /*
    * 经纪人，店长，经理，财务四级审核
    */
    auditor(val1, val2) {
      //审批
      switch (val1) {
        case 2: //店长
          if (!val2) this.open2("提交店长审核申请", val1, val2);
          else this.open2("撤销店长审核申请", val1, val2);
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
            case 2:
              const params2 = {
                isAudit: this.approve.isAudit,
                isShopowner: status ? 0 : 1,
                ids: [this.approve.id]
              };
              // 请使用合同支出的审核接口（下同）
              shopownerAudit(params2).then(res => {
                this.currentChange(1);
                this.$message({
                  type: "success",
                  message: "成功!"
                });
              });
              break;
            case 4:
              if (this.approve.isShopowner != 1) {
                this.$message({
                  type: "error",
                  message: "请先进行店长审核!"
                });
                return;
              }
              const params4 = {
                isAudit: status ? 0 : 1,
                isShopowner: this.approve.isShopowner,
                ids: [this.approve.id]
              };
              financialAudit(params4).then(res => {
                this.currentChange(1);
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
	},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
		this.$nextTick(() => {
      this.findUserByName();
      this.currentChange(1);
		})
	},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
		if (this.$store.getters.userinfo) {
      // 在不同的地方调用方法的时候，这个变量的的类型是不一样的，JSON.parse()里的参数只能是string类型
      const userinfo = typeof this.$store.getters.userinfo == 'string' ? JSON.parse(this.$store.getters.userinfo) : this.$store.getters.userinfo;
      this.permissions = userinfo.permissions
    }
	},
};
</script>

<style>
.mContainer .el-table__body tr.current-row > td {
  background-color: #ffec8b !important;
}
.redItem .el-form-item__label {
	color: indianred;
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