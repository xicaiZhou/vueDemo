<template>
  <el-dialog
    title="选择台账"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="720px"
  >
    <el-form label-width="100px" size="small" :inline="true">
      <m-cascader :companyId.sync="ledgerForm.companyId" :storeId.sync="ledgerForm.storeId"></m-cascader>
      <el-form-item label="经纪人">
        <el-input class="minput" v-model="ledgerForm.masterBroker"></el-input>
      </el-form-item>
      <el-form-item label="楼盘">
        <el-select v-model="ledgerForm.buildingId">
          <el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门牌号">
        <el-input class="minput" v-model="ledgerForm.familyId"></el-input>
      </el-form-item>
      <el-form-item label="台账编号">
        <el-input class="minput" v-model="ledgerForm.accountNo"></el-input>
      </el-form-item>
      <el-form-item label="店内编号">
        <el-input class="minput" v-model="ledgerForm.storeNo"></el-input>
      </el-form-item>
      <el-button type="primary" size="mini" @click="handleClickSearch">查询</el-button>
    </el-form>
    <m-table
      :data="pager.rows"
      :setting="setting"
      :loading="loading"
      :total="pager.total"
      :pageSize="pager.pageSize"
    >
      <el-table-column label="操作" width="90px" fixed="right">
        <template slot-scope="scope">
          <el-button @click="sureSelectedLedger(scope.row)" type="text" size="small">选择此台账</el-button>
        </template>
      </el-table-column>
    </m-table>
  </el-dialog>
</template>
<script>
import MTable from "@/components/Table";
import MCascader from "@/components/department/mcascader";
/**
 * getContractList 查询台账
 */
import { findLedger } from "@/api/org-member";
import {
  buildingFindAll
} from "@/api/org-house";

export default {
  props: {},
  components: {
    MTable,
    MCascader
  },
  data() {
    return {
      dialogVisible: false,
      pager: {
        rows: [],
        total: 0,
        page: 1,
        pageSize: 10
      },
      loading: false,
      setting: [
        {
          label: "公司",
          value: "companyName"
        },
        {
          label: "门店",
          value: "storeName"
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
          label: "经纪人",
          value: "masterBroker"
        },
        {
          label: "楼盘",
          value: "buildingName"
        },
        {
          label: "台账地址",
          value: "address"
        }
      ],
      ledgerForm: {
        companyId: "",
        storeId: "",
        masterBroker: "",
        buildingId: "",
        accountNo: "",
        storeNo: "",
        familyId: "",
        status: "1"
      },
      buildings: [{ name: "所有项", id: "" , address: ""}],
    };
  },
  created() {
    this.getLedgerPager();
    this.buildingFind1();
  },
  computed: {
    totalPage() {
      const { total, pageSize } = this.pager
      const a = total % pageSize > 0 ? 1 : 0
      return parseInt(total / pageSize, 10) + a
    }
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
    },
    getLedgerPager(opts = {} ) {
      console.log('getLedgerPager...', opts)
      const page = opts.page ? opts.page : 1
      const { total, pageSize} = this.pager
      if (page !==1 && page >= this.totalPage) {
        return
      }
      const form = {...this.ledgerForm, page, rows: pageSize, ...opts};
      findLedger(form).then(res => {
        this.pager.rows = res.body.rows; //接口有分页
        console.log("获取台账 res=====", this.pager.rows);
        this.pager.page = page
        this.pager.total = res.body.total
      });
    },
    sureSelectedLedger(data = {}) {
      this.$emit("sureSelect", data);
      this.close();
    },
    /**
     * 点击搜索
     */
    handleClickSearch() {
      this.getLedgerPager({ page: 1 })
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
  }
};
</script>
