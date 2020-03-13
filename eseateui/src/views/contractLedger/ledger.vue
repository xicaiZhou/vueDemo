<!-- 选择台账 -->
<template>
  <div class>
		<el-form label-width="90px" size="small" :inline="true">
      <el-form-item label="代理停用">
				<el-radio-group v-model="table.parms.status">
            <el-radio label="">全部</el-radio>
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
			</el-form-item>
			<m-cascader :companyId.sync="table.parms.companyId" :storeId.sync="table.parms.storeId"></m-cascader>
			<el-form-item label="楼盘">
				<el-select placeholder="请选择" v-model="table.parms.buildingId">
					<el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="楼盘名称">
        <el-input class="minput" v-model="table.parms.buildingName" placeholder="请输入楼盘名称"></el-input>
      </el-form-item>
			<el-form-item label="台账类型">
				<el-select placeholder="请选择" v-model="table.parms.type">
					<el-option v-for="(item, i) in types" :key="i" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="台账编号">
				<el-input class="minput" v-model="table.parms.accountNo"></el-input>
			</el-form-item>
			<el-form-item label="店内编号">
				<el-input class="minput" v-model="table.parms.storeNo"></el-input>
			</el-form-item>
			<el-form-item label="经纪人">
				<el-select placeholder="请选择" v-model="table.parms.masterBroker">
					<el-option v-for="item in createUsers" :key="item.id" :label="item.name" :value="item.name"> </el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="currentChange(1)">查 询</el-button>
				<!-- <el-button type="primary" @click="entryWork()">录入业绩</el-button> -->
			</el-form-item>
		</el-form>
		<m-table
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      @currentChange="currentChange"
      @handleCurrentChange="handleCurrentChange"
    >
			<el-table-column label="操作" width="100px" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" @click="changeEdit(scope.row)">编辑备注</el-button>
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
        <el-form-item label="备注">
          <el-input v-model="formTable.description" type="textarea" :rows="8" size="small" style="width: 550px;"></el-input>
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
import MTable from "@/components/Table";
import MCascader from "@/components/department/mcascader";
import {
  getContractList,
  updateContract
} from "@/api/org-ledger";
import { buildingFindAll } from "@/api/org-house";
import { FindByName } from "@/api/org-user";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
		MTable,
    MCascader
	},
  data() {
    //这里存放数据
    return {
      chooseLedger: {},  // 选择的台账
			table: {
        loading: false,
        list: [],
        setting: [
          {
            label: "公司",
            value: "companyName",
            width: 120
          },
          {
            label: "门店",
            value: "storeName",
            width: 120
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
            label: "主经纪人",
            value: "masterBroker"
          },
          {
            label: "停用业绩",
            value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue === 1 ? "启用" : "停用";
            }
          },
          {
            label: "创建时间",
            value: "createTime",
            width: 160
          },
          {
            label: "质量",
            value: "quality"
          },
          {
            label: "备注",
            value: "description",
            width: 300
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          accountNo: "",
          buildingName: "",
          buildingId: "",
          storeNo: "",
          type: "",
          masterBroker: "",
          status: ""
        },
        total: 10,
        page: 1,
        rows: 10
      },
      formTable: {
        description: '',
        accountNo: ''
      },
			types: [
        { name: "所有项", id: "" },
        { name: "业主", id: "1" },
        { name: "代理", id: "2" },
        { name: "居间", id: "3" },
        { name: "买卖", id: "4" },
        { name: "其他", id: "5" },
        { name: "未知", id: "6" }
      ],
			buildings: [{ name: "所有项", id: "" , address: ""}],
      createUsers: [],
      dialogVisible: false
		};
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    /**
     * 查询台账
    */
    currentChange(val) {
      if (val || val === 0) {
        this.table.page = val;
      }
      let { page, rows, parms } = this.table;
      getContractList({ ...parms, page, rows }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (body.rows) {
            this.table.list = body.rows.map(item => {
              return {
                ...item
              };
            });
            this.table.total = body.total;
          } else {
            this.table.list = [];
          }
        }
      });
    },
    /**
     * 编辑备注
    */
    changeEdit(val) {
      this.dialogVisible = true
      this.formTable = { ...val }
    },
    /**
     * 提交备注
    */
    submitStop() {
      let parms = {
        accountNo: this.formTable.accountNo,
        description: this.formTable.description
      }
      updateContract(parms).then(res => {
        let { code, msg } = res;
        if (code == 1000) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.currentChange();
          this.dialogVisible = false;
        } else {
          this.$message({
            type: "error",
            message: msg ? msg : "修改失败!"
          });
        }
      });
    },
		/**
     * 查询楼盘
    */
    buildingFind1(regionQs = "") {
      buildingFindAll({ regionQs }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.buildings = [
            { name: "所有项", id: "" },
            ...body.map(item => {
              return { ...item, id: Number(item.id), address: String(item.address) };
            })
          ];
        }
      });
		},
		/*
    * 查询所有录入人
    */
    findUserByName() {
      FindByName({}).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.createUsers = [ ...body ];
        }
      });
    },
    handleCurrentChange(data) {
      this.chooseLedger = data
      this.$emit('changChoose', data)
    }
	},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.currentChange(1)
    this.buildingFind1()
    this.findUserByName()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>