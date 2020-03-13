<template>
  <el-dialog
    title="成交人"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="665px"
  >
    <el-form label-width="50px" size="small" :inline="true">
      <el-form-item>
        <m-cascader
          :companyId.sync="table2.jobParams.companyId"
          :storeId.sync="table2.jobParams.storeId"
          @update:storeId="changeStore"
        ></m-cascader>
      </el-form-item>
      <el-form-item>
        <m-table
          :hasIndex="true"
          :data="table2.list"
          :setting="table2.setting"
          @currentChange="currentChangeTable2"
          style="width: 300px"
        >
          <el-table-column label="操作" width="90px" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="sureSelectedTrader(scope.row, 1)">选择此人员</el-button>
            </template>
          </el-table-column>
        </m-table>
      </el-form-item>
      <el-form-item>
        <m-table
          :hasIndex="true"
          :data="table3.list"
          :setting="table3.setting"
          style="width: 300px"
        >
          <el-table-column label="操作" width="90px" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="sureSelectedTrader(scope.row, 2)">选择此人员</el-button>
            </template>
          </el-table-column>
        </m-table>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import MTable from "@/components/Table";
import MCascader from "@/components/department/mcascader";
import { findTrader } from "@/api/org-agencyContract";
import { format } from "path";

export default {
  props: {
    storeId: {
      type: Number | String //根据门店获取主副经纪人 门店id
    }
  },
  components: {
    MTable,
    MCascader
  },
  data() {
    return {
      dialogVisible: false,
      table2: {
        list: [],
        setting: [
          {
            label: "在职人员",
            value: "name"
          }
        ],
        jobParams: {
          companyId: "",
          storeId: ""
        }
      },
      table3: {
        list: [],
        setting: [
          {
            label: "离职人员",
            value: "name"
          }
        ]
      }
    };
  },
  created() {
    // this.getTrader(10000);
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
    },
    getTrader(id) {
      //获取成交人
      findTrader(id).then(res => {
        this.table2.list = res.body.notLeave;
        this.table3.list = res.body.leave;
      });
    },
    sureSelectedTrader(data = {}) {
      this.$emit("choose", data);
      this.close();
    },
    handleSelectionChange(val) {},
    /*
     *  获取主/副成交人
     */
    currentChangeTable2() {},
    changeStore(val) {
      const arr = val.split('.')
      this.getTrader(arr[arr.length-1])
    }
  },
  mounted () {
    // this.getTrader(10000)
  }
};
</script>
