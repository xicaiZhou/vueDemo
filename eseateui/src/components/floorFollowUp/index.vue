<!-- 楼盘跟进 -->
<template>
  <div class="mtools">
    <el-form label-width="100px" size="small" :inline="true">
      <el-form-item label="楼盘名称">
        <el-select placeholder="请选择" v-model="table.parms.name">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼号">
        <el-select placeholder="请选择" v-model="table.parms.name">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单元">
        <el-select placeholder="请选择" v-model="table.parms.name">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼层">
        <el-select placeholder="请选择" v-model="table.parms.name">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门牌号">
        <el-select placeholder="请选择" v-model="table.parms.name">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否锁定">
        <el-select  placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
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
      :disabledPaginnation="true"
    >
      <el-table-column label="操作" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="lookInfo(scope.row)">锁定</el-button>
          <el-button type="text" @click="lookInfo(scope.row)">新增跟进</el-button>
          <el-button type="text" @click="lookInfo(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </m-table>
    <br>
    <br>
    <div> 
       <h5>跟进详情</h5>
       <el-form>
        <el-form-item label="是否隐藏">
           <el-select  placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房源状态">
           <el-select  placeholder="请选择">
            <el-option label="自助" :value="0"></el-option>
            <el-option label="出租中" :value="2"></el-option>
            <el-option label="空置" :value="3"></el-option>
            <el-option label="已租代售" :value="4"></el-option>
            <el-option label="公司代理" :value="5"></el-option>
            <el-option label="别公司签约" :value="6"></el-option>
          </el-select>
        </el-form-item>
        </el-form>
    </div>
   
    <m-table
      :hasPaginationSizes="false"
      :data="table2.list"
      :setting="table2.setting"
      :loading="table2.loading"
      :total="table2.total"
      :pageNum="table2.page"
      :pageSize="table2.rows"
      :disabledPaginnation="true"
      @currentChange="currentChange2"
      @handleSizeChange="handleSizeChange2"
    >
    </m-table>
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
      createUsers: [{ name: "所有项", id: "" }],
      table: {
        loading: false,
        list: [{}],
        setting: [
          {
            label: "城市",
            value: ""
          },
          {
            label: "区县",
            value: ""
          },
          {
            label: "片区",
            value: ""
          },
          {
            label: "楼盘名称",
            value: "storeName"
          },
          {
            label: "楼号",
            value: ""
          },
          {
            label: "单元",
            value: ""
          },
          {
            label: "楼层",
            value: ""
          },
          {
            label: "门牌号",
            value: ""
          },
          {
            label: "室",
            value: ""
          },
          {
            label: "厅",
            value: ""
          },
          {
            label: "卫",
            value: ""
          },
          {
            label: "阳台",
            value: ""
          },
          {
            label: "面积(m)",
            value: ""
          },
        ],
        parms: {
          
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
            label: "跟进日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2020-02-02 06:07:10'
            }
          },
          {
            label: "跟进人员",
            value: "",
          },
          {
            label: "房源状态",
            value: "",
          },{
            label: "到期日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2020-02-02 06:07:10'
            }
          },{
            label: "租金(元)",
            value: "",
          },{
            label: "备注",
            value: "",
          },{
            label: "展示人",
            value: "",
          },{
            label: "展示日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2020-02-02 06:07:10'
            }
          },{
            label: "展示房源",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2020-02-02 06:07:10'
            }
          },{
            label: "选择照片",
            value: "",
          },{
            label: "是否隐藏",
            value: "",
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
          this.currentChange2(1, val)
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