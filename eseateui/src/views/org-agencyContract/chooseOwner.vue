<template>
  <div>
    <el-dialog
      title="选择业主"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="720px"
    >
      <el-form label-width="100px" size="small" :inline="true">
        <el-form-item label="身份证号">
          <el-input class="minput" v-model="owner.parms.identity"></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input class="minput" v-model="owner.parms.name"></el-input>
        </el-form-item>
        <el-form-item label="联系手机">
          <el-input class="minput" v-model="owner.parms.phoneNo"></el-input>
        </el-form-item>
        <el-button type="primary" size="mini" @click="handleClickSearch">查询</el-button>
        <el-button type="primary" size="mini" @click="showAddOwner">新建</el-button>
      </el-form>
      <m-table
        :data="owner.list"
        :setting="owner.setting"
        :loading="owner.loading"
        :total="owner.total"
        :pageNum="owner.page"
        :pageSize="owner.rows"
        @currentChange="currentChange"
      >
        <el-table-column label="操作" width="90px" fixed="right">
          <template slot-scope="scope">
            <el-button @click="sureSelectedOwner(scope.row)" type="text" size="small">选择此人员</el-button>
          </template>
        </el-table-column>
      </m-table>
    </el-dialog>
    <owner ref="owner" :sure="handClickOwnerSure" :cancel="handClickOwnerCancel"></owner>
  </div>
</template>
<script>
import MTable from "@/components/Table";
import Owner from "./owner";
import { findMemberPager } from "@/api/org-member";
import EventHub from "@/scripts/eventHub";

export default {
  props: {},
  components: {
    MTable,
    Owner
  },
  data() {
    return {
      dialogVisible: false,
      owner: {
        loading: false,
        list: [],
        setting: [
					{
						label: "客户编号",
						value: "memberId"
					},
					{
						label: "客户分类",
						value: "classification",
						formatter(row, column, cellValue, index) {
							return cellValue === 1
								? "个人"
								: cellValue === 2
								? "单位"
								: " 国外";
						}
					},
					{
						label: "客户名称",
						value: "name"
					},
					{
						label: "性别",
						value: "gender"
					},
					{
						label: "民族",
						value: "nation"
					},
					{
						label: "身份证号",
						value: "identity"
					},
					{
						label: "手机号A",
						value: "phoneNo"
					},
					{
						label: "电话",
						value: "telephone"
					}
				],
				parms: {
					identity: "",
					name: "",
					phoneNo: ""
				},
        total: 10,
        page: 1,
        rows: 10
			}
    };
  },
  created() {
    this.currentChange(1);
    EventHub.$on("changeChooseOwnerPage", (data = {}) => {
      this.currentChange(1);
    });
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
    },
    //获取业主信息
    currentChange(val) {
			if (val || val === 0) {
        this.owner.page = val;
      }
      let { page, rows, parms } = this.owner;
      findMemberPager({ ...parms, page, rows }).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.owner.list = body.rows
          this.owner.total = body.total;
        }
			});
		},
    //选择此人员
    sureSelectedOwner(data = {}) {
      this.$emit("sureSelect", data);
      this.close();
    },
    handleClickSearch() {
      this.currentChange(1);
    },
    handClickOwnerSure() {
      this.$refs.owner.close();
    },
    handClickOwnerCancel() {
      this.$refs.owner.close();
    },
    showAddOwner() {
      this.$refs.owner.show()
    }
  }
};
</script>

