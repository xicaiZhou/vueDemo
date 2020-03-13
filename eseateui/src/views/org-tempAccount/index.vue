<!-- BUG反馈 -->
<template>
  <div class>
    <el-form label-width="100px" size="small" :inline="true" v-model="table.parms">
      <el-form-item label="公司">
        <el-select placeholder="请选择" v-model="table.parms.companyId">
          <el-option v-for="item in companys" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select placeholder="请选择" v-model="table.parms.status">
          <el-option v-for="item in accountStatus" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转入日期">
        <el-date-picker
          v-model="table.parms.transferBeginTime"
          type="date"
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsStart">
        </el-date-picker>
        至
        <el-date-picker
          v-model="table.parms.transferEndTime"
          type="date"
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsEnd">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="作废日期">
        <el-date-picker
          v-model="table.parms.updateBeginTime"
          type="date"
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsStart1">
        </el-date-picker>
        至
        <el-date-picker
          v-model="table.parms.updateEndTime"
          type="date"
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsEnd2">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="录入人">
        <el-select placeholder="请选择" v-model="table.parms.createUser">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="mini" @click="currentChange(1)">查询</el-button>
      <el-button type="primary" size="mini" @click="newAdd()">添加</el-button>
    </el-form>
    <m-table
      :hasPaginationSizes="true"
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      @currentChange="currentChange"
      @handleSizeChange="handleSizeChange"
      :showSummary="true"
      :summaryMethod="summaryMethod"
    >
      <el-table-column label="操作" width="80px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status == 1" @click="toDelate(scope.row)">作废</el-button>
        </template>
      </el-table-column>
    </m-table>

    <!-- 新增添加临时帐 -->
    <el-dialog
      title="添加操作"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="700px"
    >
      <el-form label-width="80px" size="small" :inline="true">
        <el-form-item label="*公司">
          <el-select placeholder="请选择" v-model="formTable.companyId">
            <el-option v-for="item in companys" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="转入卡号">
          <el-input v-model="formTable.bankCardNo" style="width: 450px" :disabled="true"></el-input>
          <el-button size="mini" type="primary" @click="searchBankNo(1)">搜索</el-button>
        </el-form-item>
         <el-form-item label="*转入金额">
          <el-input class="minput" v-model="formTable.amount"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formTable.remark" type="textarea" :rows="6" size="small" style="width: 550px;"></el-input>
        </el-form-item>
        <el-form-item label="*转入日期">
          <el-date-picker 
            v-model="formTable.transferDate" 
            type="date" 
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="转入时间">
          <el-time-picker 
            v-model="formTable.transferTime" 
            format="hh:mm:ss"
            value-format="hh:mm:ss"
            placeholder="选择时间"
            ></el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" type="primary" @click="submitStop">确 定</el-button>
        <el-button size="mini" @click="dialogVisible=false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增添加临时帐END -->

    <!-- 查询卡号弹框 -->
    <el-dialog
      title="选择卡号"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px"
    >
      <el-form label-width="70px" size="small" :inline="true">
        <el-form-item label="转入卡号">
          <el-input v-model="table2.parms.bankCardNo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="searchBankNo(2)">查询</el-button>
        </el-form-item>
      </el-form>
      <m-table
        :data="table2.list"
        :setting="table2.setting"
        :loading="table2.loading"
        :total="table2.total"
        :pageNum="table2.page"
        :pageSize="table2.rows"
      >
        <el-table-column label="操作" width="100px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="selectedBankNo(scope.row)">选择此卡号</el-button>
          </template>
        </el-table-column>
      </m-table>
    </el-dialog>
    <!-- 查询卡号弹框END -->

  </div>
</template>

<script>
import moment from 'moment'
import MTable from "@/components/Table";
import { FindByName } from "@/api/org-user";
import { 
  getTempAccountByPage, 
  saveTempAccountByPage, 
  updateTempAccountByPage,
  getCompanyCardtByPage } from "@/api/org-tempAccount";
import { findAll } from "@/api/org-dept";


export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    MTable,
    moment
  },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate: time => {
          let endDateVal = this.table.parms.transferEndTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.transferBeginTime;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      pickerOptionsStart1: {
        disabledDate: time => {
          let endDateVal = this.table.parms.updateEndTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          }
        }
      },
      pickerOptionsEnd2: {
        disabledDate: time => {
          let beginDateVal = this.table.parms.updateBeginTime;
          if (beginDateVal) {
            return (
              time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      },
      dialogVisible: false,
      dialogVisible2: false,
      companys: [],
      createUsers: [{ name: "所有项", id: "" }],
      accountStatus: [{ name: "有效", id: 1 }, { name: "作废", id: 0 }],
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
            label: "状态",
            value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue === 1 ? "有效" : "作废"
            }
          },
          {
            label: "转入日期",
            value: "transferDate",
            width: 120
          },
          {
            label: "转入时间",
            value: "transferTime",
            width: 120
          },
          {
            label: "转入卡号",
            value: "bankCardNo",
            width: 200
          },
          {
            label: "转入金额",
            value: "amount"
          },
          {
            label: "备注",
            value: "remark",
            width: 300
          },
          {
            label: "类型",
            value: "type"
          },
          {
            label: "作废人员",
            value: "updateUser"
          },
          {
            label: "作废时间",
            value: "updateTime",
            width: 170
          },
          {
            label: "录入时间",
            value: "createTime",
            width: 170
          },
          {
            label: "录入人",
            value: "createUser"
          }
        ],
        parms: {
          companyId: "",
          status: 1,
          transferBeginTime: "",
          transferEndTime: "",
          updateBeginTime: "",
          updateEndTime: "",
          createUser: ""
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
            label: "账户名称",
            value: "bankUserName"
          },{
            label: "开户银行",
            value: "bankName"
          },{
            label: "银行卡号",
            value: "bankCardNo"
          },
        ],
        parms: {
          bankCardNo: ""
        },
        total: 10,
        page: 1,
        rows: 10
      },
      formTable: {
        companyId: '',
        company: '',
        bankCardNo: '',
        amount: '',
        remark: '',
        type: '收入',
        transferDate: '',
        transferTime: ''
      },
    };
  },
  watch: {
    "table.parms.transferBeginTime"(val) {
      if (val) {
        this.table.parms.transferBeginTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.transferBeginTime = ""
      }
    },
    "table.parms.transferEndTime"(val) {
      if (val) {
        this.table.parms.transferEndTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.transferEndTime = ""
      }
    },
    "table.parms.updateBeginTime"(val) {
      if (val) {
        this.table.parms.updateBeginTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.updateBeginTime = "";
      }
    },
    "table.parms.updateEndTime"(val) {
      if (val) {
        this.table.parms.updateEndTime = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.updateEndTime = ""
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
      getTempAccountByPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.table.list = body.rows
          this.table.total = body.total;
        }
			});
    },
    /**
     * 账户余额求累加和
    */
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((c, index) => {
        console.log("C=====",c);
        
        if (index === 0) {
          sums[index] = '金额合计'
        } else if (index === 6) {
          let sum = 0
          data.forEach(d => {
            sum += d.amount
          })
          sums[index] = sum
        } else {
          sums[index] = ''
        }
      })
      return sums
    },
    /**
     * 添加
    */
    newAdd() {
      this.dialogVisible = true;
    },
    /**
     * 作废按钮触发方法
    */
    toDelate(val) {
      this.$confirm("此操作将作废该笔临时帐, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {

          let params = {
            id: val.id,
            status: 0
          }
          updateTempAccountByPage(params).then(res => {
            let { code, body } = res;
            if (code == 1000) {
              this.$message({
                type: "success",
                message: "作废成功!"
              });
              this.currentChange();
            }else {
              this.$message({
                type: "error",
                message: "作废失败!"
              });
            }
        })
      })
    },
    /**
     * 查询银行卡号
    */
    searchBankNo(index) {
      if(index === 1) {
        // 查询卡号
        this.dialogVisible2 = true; 
      }
      this.searchCard(1);
    },
    /**
     * 查询卡号
    */
    searchCard(val) {
      if (val || val === 0) {
        this.table2.page = val;
      }
      let { page, rows, parms } = this.table2;
      getCompanyCardtByPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.table2.list = body
        }
      });
    },
    /**
     * 选择此卡号
    */
    selectedBankNo(val) {
      this.formTable.bankCardNo = val.bankCardNo
    },
    /**
     * 添加请求
    */
    submitStop() {
      if (this.formTable.companyId === '' || this.formTable.companyId === undefined) {
        this.$message({
          type: "error",
          message: "选择添加公司"
        });
        return
      }
      this.formTable.company = this.companys.find(item => item.id === this.formTable.companyId).name
      if (this.formTable.amount === '' || this.formTable.amount === undefined) {
        this.$message({
          type: "error",
          message: "选择添加金额"
        });
        return
      }
      
      if (this.formTable.transferDate === '' || this.formTable.transferDate === undefined) {
        this.$message({
          type: "error",
          message: "选择添加日期"
        });
        return
      }
      saveTempAccountByPage(this.formTable).then(res => {
        let {code, body} = res;
        if (code == 1000) {
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.dialogVisible = false;
          this.currentChange();
        }else {
          this.$message({
            type: "error",
            message: "添加失败!"
          });
        }
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
    * 查询所有的公司
    */
    findAllCompany(){
      findAll({ level: "2" }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.companys = [...body];
        }
      });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.currentChange(1);
    this.findUserByName();
    this.findAllCompany();
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
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>