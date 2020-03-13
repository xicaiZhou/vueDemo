<!--  -->
<template>
  <div class="mContainer">
    <div class="contorl">
      <el-button type="primary" size="mini" :disabled="(((approve.isBottomFlow == 1 && approve.isFlow == 1) || approve.bottomGuardStatus == 1) ?  true : false)" @click="sendWage(1,1)">保底发放</el-button>
      <el-button type="primary" size="mini" :disabled="(((approve.isBottomFlow == 1 && approve.isFlow == 1) || approve.bottomGuardStatus !== 1) ?  true : false)" @click="sendWage(1,2)">撤销保底发放</el-button>
      <el-button type="primary" size="mini" style="margin-left: 50px;" :disabled="(((approve.isBottomFlow == 1 && approve.isFlow == 1) || approve.royaltyStatus == 1) ?  true : false)" @click="sendWage(2,1)">提成发放</el-button>
      <el-button type="primary" size="mini" :disabled="(((approve.isBottomFlow == 1 && approve.isFlow == 1) || approve.royaltyStatus !== 1) ?  true : false)" @click="sendWage(2,2)">撤销提成发放</el-button>
    </div>
		<div class="mtools">
			<el-form label-width="100px" size="small" :inline="true">
				<m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
				<el-form-item label="选择月份">
          <el-date-picker 
            v-model="table.parms.month" 
            type="month" 
            placeholder="选择日期"
            format="yyyy-MM"
            value-format="yyyy-MM"
          ></el-date-picker>
				</el-form-item>
				<el-form-item label="查看月份">
          <el-date-picker
            v-model="table.parms.beginDate"
            type="month"
            placeholder="选择日期时间"
            format="yyyy-MM"
            value-format="yyyy-MM"
            :picker-options="pickerOptionsStart">
          </el-date-picker>
          至
          <el-date-picker
            v-model="table.parms.endDate"
            type="month"
            placeholder="选择日期时间"
            format="yyyy-MM"
            value-format="yyyy-MM"
            :picker-options="pickerOptionsEnd">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="角色">
					<el-select placeholder="请选择" v-model="table.parms.roleId">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
				</el-form-item> -->
        <el-form-item label="姓名">
					<el-select placeholder="请选择" v-model="table.parms.name">
						<el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="员工ID">
					<el-input class="minput" placeholder="请输入员工ID" v-model="table.parms.userId"></el-input>
				</el-form-item>
        <br>
        <el-form-item label="在职状态">
          <el-radio-group v-model="table.parms.leave">
            <el-radio :label="1">在职</el-radio>
            <el-radio :label="0">离职</el-radio>
            <el-radio label="">全部</el-radio>
          </el-radio-group>
        </el-form-item>
				<el-form-item label="员工状态">
					<el-radio-group v-model="table.parms.userStatus">
            <el-radio :label="0">停用</el-radio>
            <el-radio :label="1">启用</el-radio>
            <el-radio label="">全部</el-radio>
          </el-radio-group>
				</el-form-item>
				<el-button type="primary" size="mini" @click="currentChange(1)">查询</el-button>
        <el-button type="success" size="mini" style="margin-left: 50px;" @click="reloadWage()">刷新业绩</el-button>
			</el-form>
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
        :showSummary="true"
        :summaryMethod="summaryMethod"
				@currentChange="currentChange"
        @handleSizeChange="handleSizeChange"
				@handleCurrentChange="handleCurrentChange"
			>
				<el-table-column label="操作" width="60px" fixed="right">
					<template slot-scope="scope">
						<el-button @click="editWage(scope.row)" type="text" :disabled="scope.row.bottomGuardStatus == 1 || scope.row.royaltyStatus == 1">编辑</el-button>
					</template>
				</el-table-column>
			</m-table>
      <br>
      <br>
      <h5>保底发放</h5>
      <m-table
        :hasPagination="false"
				:hasIndex="true"
				:data="table2.list"
				:setting="table2.setting"
				:loading="table2.loading"
			>
			</m-table>
      <br>
      <br>
      <h5>提成发放</h5>
      <m-table
        :hasPagination="false"
				:hasIndex="true"
				:data="table3.list"
				:setting="table3.setting"
				:loading="table3.loading"
			>
			</m-table>
		</div>

		<!-- 编辑/保存工资核算 -->
    <el-dialog width="1000px" title="编辑工资核算" 
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false">
      <el-form label-width="90px" size="small" :inline="true" ref="form">
        <el-form-item label="*保底" class="redItem">
          <el-input class="minput" style="width:120px" v-model="formUpdateData.bottomGuard"></el-input>
        </el-form-item>
        <el-form-item label="*保底奖惩" class="redItem">
          <el-input class="minput" style="width:120px" v-model="formUpdateData.bottomGuardRewardPenalty"></el-input>
        </el-form-item>
				<el-form-item label="*保底考勤" class="redItem">
          <el-input class="minput" style="width:120px" v-model="formUpdateData.bottomGuardAttendance"></el-input>
        </el-form-item>
				<el-form-item label="*保底广告" class="redItem">
          <el-input class="minput" style="width:120px" v-model="formUpdateData.bottomGuardAdvertising"></el-input>
        </el-form-item>
        <br>
        <br>
        <el-form-item label="*提成" class="redItem">
          <el-input class="minput" style="width:120px" v-model="formUpdateData.royalty"></el-input>
        </el-form-item>
        <el-form-item label="*提成奖惩" class="redItem">
          <el-input class="minput" style="width:120px" v-model="formUpdateData.royaltyRewardPenalty"></el-input>
        </el-form-item>
				<el-form-item label="*提成考勤" class="redItem">
          <el-input class="minput" style="width:120px" v-model="formUpdateData.royaltyAttendance"></el-input>
        </el-form-item>
				<el-form-item label="*提成广告" class="redItem">
          <el-input class="minput" style="width:120px" v-model="formUpdateData.royaltyAdvertising"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="备注">
          <el-input style="width: 795px;" type="textarea" :rows="6" placeholder="请输入备注" v-model="formUpdateData.wageAccountDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 编辑/保存工资核算END -->
	</div>
</template>

<script>
import MTable from "@/components/Table";
import { FindByName } from "@/api/org-user";
import { AllRole } from '@/api/org-role'
import { findFlowDetailPage } from "@/api/org-tempAccount";
import { getWageAccountByPage, wageAccountPerformance, wageAccountUpdate, wageAccountGrant } from "@/api/org-wageAccount";
import MCascader from "@/components/department/mcascader";
import moment from 'moment'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
		MTable,
    MCascader
	},
  data() {
    //这里存放数据
    return {
			pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.table.parms.endDate;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.beginDate;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      approve:{
        isBottomFlow: 0,// 保底 0是没有流水凭证，1是有
        isFlow: 0 // 提成 0是没有流水凭证，1是有
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
            label: "部门",
            value: "storeName",
						width: 120
          },
          {
            label: "姓名",
            value: "name"
          },
          {
            label: "工资合计",
            value: "wageAggregateFee",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "新业绩",
						value: "newPerformance",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "老业绩",
						value: "oldPerformance",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "业绩合计",
						value: "performance",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "奖惩",
						value: "bottomGuardRewardPenalty",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "广告费",
            value: "bottomGuardAdvertising",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "考勤",
						value: "bottomGuardAttendance",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "保底金额",
            value: "bottomGuard",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "发放状态",
						value: "bottomGuardStatus",
            formatter(row, column, cellValue, index) {
              return cellValue == '0' ? '未发' : '已发';
            }
          },
          {
            label: "奖惩",
						value: "royaltyRewardPenalty",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "广告费",
            value: "royaltyAdvertising",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "考勤",
						value: "royaltyAttendance",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "提成合计",
            value: "royalty",
            formatter(row, column, cellValue, index) {
              return !cellValue ? 0 : cellValue;
            }
          },
          {
            label: "发放状态",
						value: "royaltyStatus",
            formatter(row, column, cellValue, index) {
              return cellValue == '0' ? '未发' : '已发';
            }
          },
          {
            label: "离职日期",
						value: "quitTime",
            formatter(row, column, cellValue, index) {
              return row.leave == '0' ? cellValue : '';
            }
          },
          {
            label: "员工ID",
						value: "userId"
					},
          {
						label: "角色",
						value: "roleName"
          },
          {
            label: "所属月份",
						value: "month",
            formatter(row, column, cellValue, index) {
              return cellValue == "Invalid date" ? "" : cellValue;
            }
          },
          {
            label: "入职时间",
						value: "joinTime"
          },
          {
            label: "备注",
            value: "wageAccountDesc",
            width: 180
					}
        ],
        parms: {
          companyId: "",
          storeId: "",
          leave: 1,
          userStatus: 1,
          month: "",
          name: "",
          roleId: "",
          userId: "",
					beginDate: "",
					endDate: ""
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
            label: "类别",
            value: "",
            formatter(row, column, cellValue, index) {
              return '保底';
            }
          },
          {
            label: "发放状态",
            value: "",
            formatter(row, column, cellValue, index) {
              return '已发';
            }
          },
          {
            label: "发放人",
						value: "entryUserName"
          },
          {
            label: "发放日期",
						value: "entryDate"
          },
          {
            label: "发放金额",
						value: "budgetAmount"
          },
          {
            label: "发放编号",
						value: "id"
          },
          {
            label: "流水凭证",
						value: "confirmNo"
          },
          {
            label: "流水ID编号",
						value: "flowDetailId"
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          budgetNo: ""
        }
      },
      table3: {
        loading: false,
        list: [],
        setting: [
          {
            label: "类别",
            value: "",
            formatter(row, column, cellValue, index) {
              return '提成';
            }
          },
          {
            label: "发放状态",
            value: "",
            formatter(row, column, cellValue, index) {
              return '已发';
            }
          },
          {
            label: "发放人",
						value: "entryUserName"
          },
          {
            label: "发放日期",
						value: "entryDate"
          },
          {
            label: "发放金额",
						value: "budgetAmount"
          },
          {
            label: "发放编号",
						value: "id"
          },
          {
            label: "流水凭证",
						value: "confirmNo"
          },
          {
            label: "流水ID编号",
						value: "flowDetailId"
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          budgetNo: ""
        }
      },
      formUpdateData: {
        bottomGuard: "",
        bottomGuardRewardPenalty: "",
        bottomGuardAttendance: "",
        bottomGuardAdvertising: "",
        id: "",
        royalty: "",
        royaltyRewardPenalty: "",
        royaltyAttendance: "",
        royaltyAdvertising: "",
        wageAccountDesc: ""
      },
      createUsers: [{ name: "所有项", id: "" }],
      roleList: [{ name: "所有项", id: "" }],
			dialogTableVisible: false
		};
	},
	watch: {
    "table.parms.month"(val) {
      if (val) {
        this.table.parms.month = moment(val).format("YYYY-MM");
      }else {
        this.table.parms.month = "";
      }
    },
		"table.parms.beginDate"(val) {
      if (val) {
        this.table.parms.beginDate = moment(val).format("YYYY-MM");
      }else {
        this.table.parms.beginDate = "";
      }
    },
    "table.parms.endDate"(val) {
      if (val) {
        this.table.parms.endDate = moment(val).format("YYYY-MM");
      }else {
        this.table.parms.endDate = ""
      }
    }
	},
  //方法集合
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
      getWageAccountByPage({ ...parms, page, rows }).then(res => {
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
      this.formUpdateData = { ...val }
      // 保底
      if (val.bottomGuardNo != undefined) {
        this.table2.parms = {
          companyId: val.companyId,
          storeId: val.storeId,
          budgetNo: val.bottomGuardNo
        }
        this.flowBottomDetails(1);
      }else {
        this.table2.list = []
        this.approve.isBottomFlow = 5
      }
      // 提成
      if (val.royaltyNo != undefined) {
        this.table3.parms = {
          companyId: val.companyId,
          storeId: val.storeId,
          budgetNo: val.royaltyNo
        }
        this.flowRoyaltyDetails(1)
      }else {
        this.table3.list = []
        this.approve.isFlow = 5
      }

      this.currentRow = val
    },
    /**
		 * 默认查询分页流水明细
		*/
    flowBottomDetails(val) {
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
                this.approve.isBottomFlow = 1
                return true;
              }else {
                this.approve.isBottomFlow = 5
              }
            })
          }else {
            this.approve.isBottomFlow = 5
          }
          this.table2.total = body.total;
        }
      });
    },
    flowRoyaltyDetails(val) {
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
                this.approve.isFlow = 5
              }
            })
          }else {
            this.approve.isFlow = 5
          }
          this.table3.total = body.total;
        }
      });
    },
		/**
		 * 编辑按钮
		 */
		editWage() {
			this.dialogTableVisible = true
    },
    /** 
		 * 刷新业绩核算按钮接口 
		 */ 
    reloadWage() {
      let param = {userId: this.currentRow.userId, wageAccountId: this.currentRow.id}
      wageAccountPerformance(param).then(res => {
        let { code, body } = res
        if (code == 1000) {
          this.currentChange()
        }
      })
    },
		/** 
		 * 保存按钮接口 
		 */ 
		handleSubmit() {
      
      let param = {
        bottomGuard: this.formUpdateData.bottomGuard,
        bottomGuardRewardPenalty: this.formUpdateData.bottomGuardRewardPenalty,
        bottomGuardAttendance: this.formUpdateData.bottomGuardAttendance,
        bottomGuardAdvertising: this.formUpdateData.bottomGuardAdvertising,
        id: this.formUpdateData.id,
        royalty: this.formUpdateData.royalty,
        royaltyRewardPenalty: this.formUpdateData.royaltyRewardPenalty,
        royaltyAttendance: this.formUpdateData.royaltyAttendance,
        royaltyAdvertising: this.formUpdateData.royaltyAdvertising,
        wageAccountDesc: this.formUpdateData.wageAccountDesc
      }
      wageAccountUpdate(param).then(res => {
        let { code, body } = res
        if (code == 1000) {
          this.dialogTableVisible = false
          this.currentChange()
        }
      })
		},
		/**
		 * 发放与撤销（保底）
		 */
		sendWage(index, typeIndex) {
      // status   1:发放，2:撤销发放 
      // type     1:保底，2:提成
      let param = {
        amonut: this.approve.bottomGuard,
        budgetNo: index == 1 ? this.approve.bottomGuardNo : this.approve.royaltyNo,
        companyId: this.approve.companyId,
        status: typeIndex,
        storeId: this.approve.storeId,
        type: index,
        wageAccountDesc: this.approve.wageAccountDesc,
        wageAccountId: this.approve.id
      }
      wageAccountGrant(param).then(res => {
        let { code, body } = res
        if (code == 1000) {
          this.currentChange()
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
        } else if (index === 4) {
          let sum = 0
          data.forEach(d => {
            if (d.wageAggregateFee != undefined) {
              sum += d.wageAggregateFee
            }
          })
          sums[index] = sum
        } else if (index === 5) {
          let sum = 0
          data.forEach(d => {
            if (d.newPerformance != undefined) {
              sum += d.newPerformance
            }
          })
          sums[index] = sum
        } else if (index === 6) {
          let sum = 0
          data.forEach(d => {
            if (d.oldPerformance != undefined) {
              sum += d.oldPerformance
            }
          })
          sums[index] = sum
        }else if (index === 7) {
          let sum = 0
          data.forEach(d => {
            if (d.performance != undefined) {
              sum += d.performance
            }
          })
          sums[index] = sum
        }else if (index === 8) {
          let sum = 0
          data.forEach(d => {
            if (d.bottomGuardRewardPenalty != undefined) {
              sum += d.bottomGuardRewardPenalty
            }
          })
          sums[index] = sum
        }else if (index === 9) {
          let sum = 0
          data.forEach(d => {
            if (d.bottomGuardAdvertising != undefined) {
              sum += d.bottomGuardAdvertising
            }
          })
          sums[index] = sum
        }else if (index === 10) {
          let sum = 0
          data.forEach(d => {
            if (d.bottomGuardAttendance != undefined) {
              sum += d.bottomGuardAttendance
            }
          })
          sums[index] = sum
        }else if (index === 11) {
          let sum = 0
          data.forEach(d => {
            if (d.bottomGuard != undefined) {
              sum += d.bottomGuard
            }
          })
          sums[index] = sum
        }else if (index === 13) {
          let sum = 0
          data.forEach(d => {
            if (d.royaltyRewardPenalty != undefined) {
              sum += d.royaltyRewardPenalty
            }
          })
          sums[index] = sum
        }else if (index === 14) {
          let sum = 0
          data.forEach(d => {
            if (d.royaltyAdvertising != undefined) {
              sum += d.royaltyAdvertising
            }
          })
          sums[index] = sum
        }else if (index === 15) {
          let sum = 0
          data.forEach(d => {
            if (d.royaltyAttendance != undefined) {
              sum += d.royaltyAttendance
            }
          })
          sums[index] = sum
        }else if (index === 16) {
          let sum = 0
          data.forEach(d => {
            if (d.royalty != undefined) {
              sum += d.royalty
            }
          })
          sums[index] = sum
        }else {
          sums[index] = ''
        }
      })
      return sums
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
    // 角色
    getAllRole(name="",status="") {
      this.roleList = []
      AllRole({name,status})
        .then(res => {
          if (res && res.body && res.body.length > 0) {
            this.roleList = res.body
            this.roleList = this.roleList.map(i => {
              i.text = i.status ? '启用' : '禁用'
              return i
            })
          }
        })
        .catch(e => {
          this.$message.error('失败')
        })
    },
	},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.currentChange(1)
    this.findUserByName()
    this.getAllRole()
  }
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