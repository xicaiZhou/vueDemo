<!-- 楼盘跟进查询 -->
<template>
  <div class="mtools">
    <el-form label-width="100px" size="small" :inline="true">
      <m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
      <el-form-item label="跟进日期">
        <el-date-picker
          v-model="table.parms.beginDate"
          type="date"
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsStart">
        </el-date-picker>
        至
        <el-date-picker
          v-model="table.parms.endDate"
          type="date"
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptionsEnd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="姓名">
        <el-select placeholder="请选择" v-model="table.parms.name">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="员工ID">
        <el-input class="minput" placeholder="请输入员工ID" v-model="table.parms.userId"></el-input>
      </el-form-item>
      <el-form-item label="楼盘名称">
        <el-input class="minput" placeholder="请输入楼盘名称" v-model="table.parms.houseId"></el-input>
      </el-form-item>
      <el-form-item label="房间号">
        <el-input class="minput" placeholder="请输入房间号" v-model="table.parms.roomId"></el-input>
      </el-form-item>
      <el-button type="primary" size="mini" @click="currentChange(1)">查询</el-button>
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
    >
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="lookInfo(scope.row)">查看业主信息</el-button>
        </template>
      </el-table-column>
    </m-table>
    <br>
    <br>
    <h5>业主信息查看详情</h5>
    <m-table
      :hasPaginationSizes="true"
      :data="table2.list"
      :setting="table2.setting"
      :loading="table2.loading"
      :total="table2.total"
      :pageNum="table2.page"
      :pageSize="table2.rows"
      @currentChange="currentChange2"
      @handleSizeChange="handleSizeChange2"
    >
    </m-table>
    <!-- 查询卡号弹框 -->
    <el-dialog
      title="业主信息"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="350px"
    >
      <el-form label-width="80px" size="small" :inline="true">
        <el-form-item label="业主姓名1">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="业主电话1">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="业主姓名2">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="业主电话2">
          <el-input ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4" size="small" style="width: 200px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" type="primary" @click="dialogVisible=false">确定</el-button>
      </div>
    </el-dialog>
    <!-- 查询卡号弹框END -->
  </div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'
import MCascader from "@/components/department/mcascader";
import { FindByName } from "@/api/org-user";

export default {
  components: {
    MTable,
    MCascader
  },
  data() {
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
      createUsers: [{ name: "所有项", id: "" }],
      table: {
        loading: false,
        list: [{}],
        setting: [
          {
            label: "跟进时间",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2020-02-02'
            }
          },
          {
            label: "公司",
            value: "company"
          },
          {
            label: "门店",
            value: "storeName"
          },
          {
            label: "跟进人员",
            value: "",
            formatter(row, column, cellValue, index) {
              return ''
            }
          },
          {
            label: "员工ID",
            value: "",
            formatter(row, column, cellValue, index) {
              return ''
            }
          },
          {
            label: "房源地址",
            value: "",
            width: 300,
            formatter(row, column, cellValue, index) {
              return ''
            }
            
          },
          {
            label: "房源状态",
            value: "",
            formatter(row, column, cellValue, index) {
              return ''
            }
          },
          {
            label: "备注",
            value: "",
            width: 200,
            formatter(row, column, cellValue, index) {
              return ''
            }
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          beginDate: "",
          endDate: "",
          name: "",
          userId: "",
          houseId: "",
          roomId: ""
        },
        total: 10,
        page: 1,
        rows: 10
      },
      table2: {
        loading: false,
        list: [{}],
        setting: [
          {
            label: "查看日期",
            value: "",
            width: 200,
            formatter(row, column, cellValue, index) {
              return '2020-02-02 06:07:10'
            }
          },
          {
            label: "查看人",
            value: "",
            width: 120,
            formatter(row, column, cellValue, index) {
              return ''
            }
          },
          {
            label: "备注",
            value: "",
            formatter(row, column, cellValue, index) {
              return ''
            }
          }
        ],
        parms: {
          companyId: "",
          storeId: ""
        },
        total: 10,
        page: 1,
        rows: 10
      },
      dialogVisible: false
    };
  },
  computed: {},
  watch: {
    "table.parms.beginDate"(val) {
      if (val) {
        this.table.parms.beginDate = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.beginDate = ""
      }
    },
    "table.parms.endDate"(val) {
      if (val) {
        this.table.parms.endDate = moment(val).format("YYYY-MM-DD");
      }else {
        this.table.parms.endDate = ""
      }
    },
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
      if (val || val === 0) {
        this.table.page = val;
      }
      if (totalNum || totalNum === 0) {
        this.table.rows = totalNum;
      }
      let { page, rows, parms } = this.table;
      // getTempAccountByPage({ ...parms, page, rows }).then(res => {
			// 	let { code, body } = res;
      //   if (code == 1000) {
      //     this.table.list = body.rows
      //     this.table.total = body.total;
      //   }
			// });
    },
    /**
     * 获取业主信息
    */
    lookInfo(val) {
      this.$confirm("是否查看?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.currentChange2(1, this.table2.rows)
      })
    },
    // 设置显示页数
    handleSizeChange2(val) {
      this.currentChange2(1, val)
    },
		/**
     * 获取分页数据
    */
    currentChange2(val, totalNum) {
      if (val || val === 0) {
        this.table2.page = val;
      }
      if (totalNum || totalNum === 0) {
        this.table2.rows = totalNum;
      }
      let { page, rows, parms } = this.table2;
      this.dialogVisible = true
      // getTempAccountByPage({ ...parms, page, rows }).then(res => {
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
h5 {
  font-size: 16px;
  margin-bottom: 10px;
}
</style>