<!-- 楼盘跟进查询 -->
<template>
  <div class="mtools">
    <el-form label-width="100px" size="small" :inline="true">
      <m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
      <m-cityselect :cityId.sync="table.parms.cityId" :zoneId.sync="table.parms.zoneId" :piceId.sync="table.parms.piceId"></m-cityselect>
			<el-form-item label="楼盘名称">
        <el-input class="minput" placeholder="请输入楼盘名称"></el-input>
      </el-form-item>
			<el-form-item label="经纪人">
        <el-select placeholder="请选择">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="房间类型">
        <el-select placeholder="请选择">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="室">
        <el-select placeholder="请选择">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="厅">
        <el-select placeholder="请选择">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="卫">
        <el-select placeholder="请选择">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="朝向">
        <el-select placeholder="请选择">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="卧室数量">
        <el-select placeholder="请选择">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="台账编号">
        <el-input class="minput" placeholder="请输入楼盘名称"></el-input>
      </el-form-item>
			<el-form-item label="电话">
        <el-input class="minput" placeholder="请输入楼盘名称"></el-input>
      </el-form-item>
      <el-form-item label="合同截止日期">
        <el-date-picker
          type="date"
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
			<el-form-item label="空置日期">
        <el-date-picker
          type="date"
          placeholder="选择日期时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="合作价格">
        <el-select placeholder="请选择">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自租价格">
        <el-select placeholder="请选择">
          <el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="mini" @click="currentChange(1)">查询</el-button>
    </el-form>
		<br>
		<h5>房源详情展示</h5>
		<el-form label-width="150px" size="small" :inline="true">
			<el-button type="primary" size="mini">导出</el-button>
			<el-form-item label="选择导出类型：">
				<el-checkbox-group v-model="checkList">
					<el-checkbox label="整租"></el-checkbox>
					<el-checkbox label="合租"></el-checkbox>
					<el-checkbox label="代理"></el-checkbox>
					<el-checkbox label="业主"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
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
      <el-table-column label="图片" width="70px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="lookInfo(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </m-table>
  </div>
</template>

<script>
import MTable from "@/components/Table";
import moment from 'moment'
import MCascader from "@/components/department/mcascader";
import MCityselect from "@/components/department/mcityselect";
import { FindByName } from "@/api/org-user";

export default {
  components: {
    MTable,
    MCascader,
    MCityselect
  },
  data() {
    return {
			checkList: [],
      createUsers: [{ name: "所有项", id: "" }],
      table: {
        loading: false,
        list: [{}],
        setting: [
          {
            label: "商圈",
            value: "",
            formatter(row, column, cellValue, index) {
              return '其实就是片区'
            }
					},
					{
            label: "楼盘名称",
            value: "",
            formatter(row, column, cellValue, index) {
              return '万年花城'
            }
          },
					{
            label: "部门",
            value: "",
            formatter(row, column, cellValue, index) {
              return '张伟小组'
            }
          },
					{
            label: "房源类型",
            value: "",
            formatter(row, column, cellValue, index) {
              return '代理'
            }
          },
					{
            label: "出租类型",
            value: "",
            formatter(row, column, cellValue, index) {
              return '整租'
            }
          },
					{
            label: "室",
            value: "",
            formatter(row, column, cellValue, index) {
              return '3'
            }
          },
					{
            label: "卫",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2'
            }
          },
					{
            label: "朝向",
            value: "",
            formatter(row, column, cellValue, index) {
              return '东北'
            }
          },
					{
            label: "合作价格",
            value: "",
            formatter(row, column, cellValue, index) {
              return '1000'
            }
          },
					{
            label: "自租价格",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2000'
            }
          },
					{
            label: "短租价格",
            value: "",
            formatter(row, column, cellValue, index) {
              return '200'
            }
          },
					{
            label: "合同截止日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2020-02-01'
            }
          },
					{
            label: "空置日期",
            value: "",
            formatter(row, column, cellValue, index) {
              return '2020-10-01'
            }
          },
					{
            label: "经纪人",
            value: "",
            formatter(row, column, cellValue, index) {
              return '雷'
            }
          },
					{
            label: "电话",
            value: "",
            formatter(row, column, cellValue, index) {
              return '110'
            }
          },
					{
            label: "密码",
            value: "",
            formatter(row, column, cellValue, index) {
              return '你猜'
            }
          },
					{
            label: "ID编号",
            value: "",
            formatter(row, column, cellValue, index) {
              return '万年花城'
            }
          },
					{
            label: "城市",
            value: "",
            formatter(row, column, cellValue, index) {
              return '北京'
            }
          },
					{
            label: "区/县",
            value: "",
            formatter(row, column, cellValue, index) {
              return '丰台'
            }
          },
					{
            label: "台账编号",
            value: "",
            formatter(row, column, cellValue, index) {
              return '1001'
            }
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          cityId: "",
          zoneId: "",
          piceId: ""
        },
        total: 10,
        page: 1,
        rows: 10
      }
    };
  },
  computed: {},
  watch: {
    // "table.parms.beginDate"(val) {
    //   if (val) {
    //     this.table.parms.beginDate = moment(val).format("YYYY-MM-DD");
    //   }else {
    //     this.table.parms.beginDate = ""
    //   }
    // },
    // "table.parms.endDate"(val) {
    //   if (val) {
    //     this.table.parms.endDate = moment(val).format("YYYY-MM-DD");
    //   }else {
    //     this.table.parms.endDate = ""
    //   }
    // },
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

      console.log("this.table.parms==========",this.table.parms);
      
      let { page, rows, parms } = this.table;
      // getTempAccountByPage({ ...parms, page, rows }).then(res => {
			// 	let { code, body } = res;
      //   if (code == 1000) {
      //     this.table.list = body.rows
      //     this.table.total = body.total;
      //   }
			// });
    }

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