<!-- BUG反馈 -->
<template>
  <div class>
    <el-form label-width="100px" size="small" :inline="true" v-model="table.parms">
      <el-form-item label="反馈时间">
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="完成时间">
        <el-date-picker
          v-model="finishTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="处理进度">
        <el-select placeholder="请选择" v-model="table.parms.issueStatus">
          <el-option v-for="item in questionStatus" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="功能类型">
        <el-select placeholder="请选择" v-model="table.parms.issueType">
          <el-option v-for="item in questionTypes" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="问题等级">
        <el-select placeholder="请选择" v-model="table.parms.issueLevel">
          <el-option v-for="item in questionLevels" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="mini" @click="currentChange(0)">查询</el-button>
      <el-button type="primary" size="mini" @click="showAddOwner">反馈问题</el-button>
    </el-form>
    <m-table
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      @currentChange="currentChange"
    >
      <el-table-column label="操作" width="230px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" 
            style="color: red" 
            @click="toDelate(scope.row)"
            >删除反馈</el-button>
          <el-button 
            type="text" 
            @click="editContract(scope.row)"
            >修改问题</el-button>
          <el-button 
            type="text" 
            @click="showChangeContract(scope.row)"
            >完成确认</el-button>
        </template>
      </el-table-column>
    </m-table>

    <!-- 新增/修改bug反馈弹框 -->
    <el-dialog
      title="反馈问题"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="700px"
    >
      <el-form label-width="70px" size="small" :inline="true">
        <el-form-item label="处理进度">
          <el-select placeholder="请选择" v-model="formTable.issueStatus" :disabled="type==='finsh'?true:false">
            <el-option v-for="item in questionStatus" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能类型">
          <el-select placeholder="请选择" v-model="formTable.issueType" :disabled="type==='finsh'?true:false">
            <el-option v-for="item in questionTypes" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题等级">
          <el-select placeholder="请选择" v-model="formTable.issueLevel" :disabled="type==='finsh'?true:false">
            <el-option v-for="item in questionLevels" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="formTable.name" placeholder="请输入模块或页面的名称" style="width: 550px" :disabled="type==='finsh'?true:false"></el-input>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input v-model="formTable.description" type="textarea" :rows="8" size="small" style="width: 550px;" :disabled="type==='finsh'?true:false"></el-input>
        </el-form-item>
        <el-form-item label="实际时间" v-if="type==='finsh'">
          <el-date-picker 
            v-model="formTable.actualTime" 
            type="date" 
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            ></el-date-picker>
        </el-form-item>
        <el-form-item label="预计时间" v-else>
          <el-date-picker 
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="formTable.expectedTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" type="primary" @click="submitStop">确 定</el-button>
        <el-button size="mini" @click="dialogVisible=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import MTable from "@/components/Table";
import { 
  getIssueFindByPage, 
  issueSaveByPage, 
  issueUpdateByPage,
  issueRemoveByPage,
  issueFindByIdByPage } from "@/api/org-bugFix";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    MTable,
    moment
  },
  data() {
    return {
      dialogVisible: false,
      type: 'add',
      finishTime: '',
      time: '',
      table: {
        loading: false,
        list: [],
        setting: [
          {
            label: "问题",
            value: "name",
            width: 300
          },
          {
            label: "问题描述",
            value: "description",
            width: 300
          },
          {
            label: "反馈时间",
            value: "createTime",
            width: 160
          },
          {
            label: "反馈人员",
            value: "createUser"
          },
          {
            label: "处理进度",
            value: "issueStatus",
            formatter(row, column, cellValue, index) {
              if (cellValue === 'STATUS1_OPEN') {
                return '待处理';
              }else if (cellValue === 'STATUS2_PROCESSING') {
                return '处理中'
              }else if (cellValue === 'STATUS3_RESOLVED') {
                return '已解决'
              }else if (cellValue === 'STATUS4_REOPENED') {
                return '未解决'
              }else if (cellValue === 'STATUS5_CLOSED') {
                return '已关闭'
              }else {
                return '其他'
              }
            }
          },
          {
            label: "功能类型",
            value: "issueType",
            formatter(row, column, cellValue, index) {
              if (cellValue === 'TYPE1_BUG') {
                return 'Bug';
              }else if (cellValue === 'TYPE2_DEMAND') {
                return '新需求'
              }else if (cellValue === 'TYPE3_DEMAND_CHANGE') {
                return '需求变更'
              }else if (cellValue === 'TYPE4_IMPROVEMENT') {
                return '优化'
              }else {
                return '其他'
              }
            }
          },
          {
            label: "问题等级",
            value: "issueLevel",
            formatter(row, column, cellValue, index) {
              if (cellValue === 'LEVEL1_BLOCK') {
                return '运行异常';
              }else if (cellValue === 'LEVEL2_CRITICAL') {
                return '紧急'
              }else if (cellValue === 'LEVEL3_MAJOR') {
                return '重要'
              }else if (cellValue === 'LEVEL4_MINOR') {
                return '一般'
              }else {
                return '其他'
              }
            }
          },
          {
            label: "预计完成时间",
            value: "expectedTime",
            width: 100
          },
          {
            label: "实际完成时间",
            value: "actualTime",
            width: 100
          }
        ],
        parms: {
          createTimeBegin: "",
          createTimeEnd: "",
          finishTimeBegin: "",
          finishTimeEnd: "",
          handleUser: "",
          issueLevel: null,
          issueStatus: null,
          issueType: null,
          name: "",
        },
        total: 10,
        page: 1,
        rows: 10
      },
      formTable: {
        id: '',
        name: '',
        issueStatus: '',
        issueType: '',
        issueLevel: '',
        description: '',
        expectedTime: '',
        actualTime: ''
      },
      questionStatus: [
        { value: "STATUS1_OPEN", label: "待处理" }, 
        { value: "STATUS2_PROCESSING", label: "处理中" }, 
        { value: "STATUS3_RESOLVED", label: "已解决" }, 
        { value: "STATUS4_REOPENED", label: "未解决" }, 
        { value: "STATUS5_CLOSED", label: "已关闭" }
      ],
      questionTypes: [
        { value: "TYPE1_BUG", label: "Bug" }, 
        { value: "TYPE2_DEMAND", label: "新需求" }, 
        { value: "TYPE3_DEMAND_CHANGE", label: "需求变更" }, 
        { value: "TYPE4_IMPROVEMENT", label: "优化" }
      ],
      questionLevels: [
        { value: "LEVEL1_BLOCK", label: "运行异常" }, 
        { value: "LEVEL2_CRITICAL", label: "紧急" }, 
        { value: "LEVEL3_MAJOR", label: "重要" }, 
        { value: "LEVEL4_MINOR", label: "一般" }, 
        { value: "LEVEL5_TRIVIAL", label: "其他" }
      ],
    };
  },
  watch: {
    time(val) {
      if (val !== null) {
        let [beginTime, endTime] = val;
        this.table.parms.createTimeBegin = moment(beginTime).format("YYYY-MM-DD");
        this.table.parms.createTimeEnd = moment(endTime).format("YYYY-MM-DD");
      }else {
        this.table.parms.createTimeBegin = ""
        this.table.parms.createTimeEnd = ""
      }
    },
    finishTime(val) {
      if (val !== null) {
        let [beginTime, endTime] = val;
        this.table.parms.finishTimeBegin = moment(beginTime).format("YYYY-MM-DD");
        this.table.parms.finishTimeEnd = moment(endTime).format("YYYY-MM-DD");
      }else {
        this.table.parms.finishTimeBegin = "";
        this.table.parms.finishTimeEnd = ""
      }
    }
  },
  //方法集合
  methods: {
    currentChange(val) {
      if (val || val === 0) {
        this.table.page = val;
      }
      let { page, rows, parms } = this.table;
      getIssueFindByPage({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.table.list = body.rows
          this.table.total = body.total;
        }
			});
    },
    // 反馈问题
    showAddOwner() {
      this.dialogVisible = true;
      this.type = 'add';
      this.formTable = {
        issueStatus: '',
        issueType: '',
        issueLevel: '',
        description: '',
        expectedTime: this.timeDefault
      }
    },
    // 修改问题
    editContract(val) {
      this.type = 'edit';
      this.dialogVisible = true;
      this.formTable = { ...val };
    },
    // 删除问题
    toDelate({ id }) {
      this.$confirm("此操作将删除该反馈问题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          issueRemoveByPage({ id: id }).then(res => {
            console.log(res);
            let { code, body } = res;
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
    // 完成确认
    showChangeContract(val) {
      this.dialogVisible = true;
      this.type = 'finsh';
      this.formTable = { ...val };
    },
    // 提交bug
    submitStop() {
      if (this.type === 'add') {
        issueSaveByPage(this.formTable).then(res => {
          let { code, body } = res;
          this.dialogVisible = false;
          if (code == 1000) {
            this.$message({
              message: "新增成功",
              type: "success"
            });
            this.currentChange(1);
          }else {
            this.$message({
              message: "修改失败",
              type: "error"
            });
          }
        });
      }else if (this.type === 'edit'){
        delete this.formTable.createTime;
        delete this.formTable.createUser;
        issueUpdateByPage(this.formTable).then(res => {
          let { code, body } = res;
          this.dialogVisible = false;
          if (code == 1000) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.currentChange(1);
          }else {
            this.$message({
              message: "修改失败",
              type: "error"
            });
          }
        });
      }else {
        this.$confirm("此操作将确认反馈问题已完成, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: this.formTable.id,
            issueStatus: 'STATUS3_RESOLVED',
            issueType: this.formTable.issueType,
            issueLevel: this.formTable.issueLevel,
            description: this.formTable.description,
            expectedTime: this.formTable.expectedTime,
            actualTime: this.formTable.actualTime
          }
          issueUpdateByPage( params ).then(res => {
            this.dialogVisible = false;
            let { code, body } = res;
            if (code == 1000) {
              this.$message({
                type: "success",
                message: "确认成功!"
              });
              this.currentChange();
            } else {
              this.$message({
                type: "error",
                message: "确认失败!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消确认"
          });
        });
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.$nextTick(() => {
      this.currentChange(1);
    })
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