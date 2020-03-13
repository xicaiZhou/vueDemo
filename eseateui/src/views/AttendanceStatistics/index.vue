<!-- 考勤统计 -->
<template>
  <div class="mtools">
		<el-form label-width="90px" size="small" :inline="true">
			<m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
			<el-form-item label="在职状态">
				<el-select placeholder="请选择">
					<el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="员工状态">
				<el-select placeholder="请选择">
					<el-option v-for="item in contractStatuses" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="姓名">
				<el-select placeholder="请选择">
					<el-option v-for="item in contractStatuses" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="员工ID">
				<el-input class="minput" placeholder="请输入员工ID" v-model="table.parms.masterBroker"></el-input>
			</el-form-item>
			<el-form-item label="考勤日期">
				<el-date-picker
					v-model="table.parms.beginTime"
					type="date"
					placeholder="选择开始日期"
					format="yyyy-MM-dd"
					value-format="yyyy-MM-dd"
					:picker-options="pickerOptionsStart">
				</el-date-picker>
				至
				<el-date-picker
					v-model="table.parms.endTime"
					type="date"
					placeholder="选择结束日期"
					format="yyyy-MM-dd"
					value-format="yyyy-MM-dd"
					:picker-options="pickerOptionsEnd">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="currentChange(0)">查 询</el-button>
			</el-form-item>
		</el-form>
		<m-table
      :data="table.list"
      :hasPaginationSizes="true"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      @currentChange="currentChange"
      @handleSizeChange="handleSizeChange"
    >
    </m-table>
	</div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'
import MCascader from "@/components/department/mcascader";

export default {
  components: {
    MTable,
    MCascader
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
			table: {
        loading:false,
        list: [{}],
        setting: [
          {
            label: "公司",
            value: "",
            formatter(row, column, cellValue, index) {
              return '北分';
            }
					},
					{
            label: "部门",
            value: "",
            formatter(row, column, cellValue, index) {
              return '阿里狼';
            }
					},
					{
            label: "姓名",
            value: "",
            formatter(row, column, cellValue, index) {
              return '嘿嘿';
            }
					},
					{
            label: "岗位",
            value: "",
            formatter(row, column, cellValue, index) {
              return '老厉害啦';
            }
					},
					{
            label: "月份",
            value: "",
            formatter(row, column, cellValue, index) {
              return '每个月都会有考勤信息';
            }
					},
					{
            label: "迟到",
            value: "",
            formatter(row, column, cellValue, index) {
              return '1';
            }
					},
					{
            label: "早退",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2';
            }
					},
					{
            label: "旷工",
            value: "",
            formatter(row, column, cellValue, index) {
              return '3';
            }
					},
					{
            label: "半天",
            value: "",
            formatter(row, column, cellValue, index) {
              return '4';
            }
					},
					{
            label: "1/5天",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2';
            }
					},
					{
            label: "因公外出",
            value: "",
            formatter(row, column, cellValue, index) {
              return '哆啦A梦';
            }
					},
					{
            label: "休息",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2';
            }
					},
					{
            label: "正常",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2';
            }
					},
					{
            label: "员工ID",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2';
            }
					},
					{
            label: "入职日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2020-02-02';
            }
					},
					{
            label: "离职日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2020-02-10';
            }
					},
					{
            label: "状态",
            value: "",
            formatter(row, column, cellValue, index) {
              return '在职';
            }
					}
        ],
        parms: {
          companyId: "",
          storeId: "",
          endTime: "",
          beginTime: ""
        },
        total: 10,
        page: 1,
        rows: 10
      },
		};
  },
  computed: {},
  watch: {},
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
      // getAgencyCostByPage({ ...parms, page, rows }).then(res => {
			// 	let { code, body } = res;
      //   if (code == 1000) {
      //     this.table.list = body.rows
      //     this.table.total = body.total;
      //   }
      // });
    },
	},
  created() {},
  mounted() {}
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>