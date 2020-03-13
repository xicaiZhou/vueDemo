<!-- 客户资料 -->
<template>
  <div class="mContainer">
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
			<el-form-item label="客户类型">
        <el-select v-model="owner.parms.type" placeholder="请选择">
          <el-option v-for="item in ownerTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户分类">
        <el-select v-model="owner.parms.classification" placeholder="请选择">
          <el-option
            v-for="item in classifications"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
			@handleCurrentChange="handleCurrentChange"
    >
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="scope">
					<el-button @click="deleteOwner(scope.row)" type="text" style="color:red;">删除</el-button>
          <el-button @click="editOwner(scope.row)" type="text">修改</el-button>
        </template>
      </el-table-column>
    </m-table>
		<br>
		
		<h5>签约记录</h5>
		<h6>租赁合同（{{leaseOwner.list !== undefined ? leaseOwner.list.length : 0}}）</h6>
		<m-table
			:hasPagination="false"
			:data="leaseOwner.list"
      :setting="leaseOwner.setting"
    >
      <el-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="scope">
          <el-button @click="changeOwner(scope.row, 1)" type="text">变更客户</el-button>
        </template>
      </el-table-column>
    </m-table>
		<br>
		<h6>代理合同（{{agencyOwner.list !== undefined ? agencyOwner.list.length : 0}}）</h6>
		<m-table
			:hasPagination="false"
			:data="agencyOwner.list"
      :setting="agencyOwner.setting"
    >
      <el-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="scope">
          <el-button @click="changeOwner(scope.row, 2)" type="text">变更客户</el-button>
        </template>
      </el-table-column>
    </m-table>


		<!-- 新建业主 -->
    <owner ref="owner" :type="typeTitle" :sure="handClickOwnerSure" :cancel="handClickOwnerCancel"></owner>
    <!-- 新建业主END -->

		<!-- 选择业主 -->
    <choose-owner ref="chooseOwner" :showAddOwner="showAddOwner" @sureSelect="sureSelectedOwner"></choose-owner>
    <!-- 选择业主END -->


		<!-- 变更客户 -->
		<el-dialog
      title="变更客户"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="1000px"
    >
      <el-form label-width="70px" size="small" :inline="true" :ref="contractType === '租赁' ? 'leaseform' : 'agencyform'">
				<h5>合同信息</h5>
        <el-form-item label="合同编号">
          <el-input v-if="contractType === '租赁'" class="minput" style="width: 220px;" :disabled="true" v-model="contractInfo.leaseNo"></el-input>
					<el-input v-else class="minput" style="width: 220px;" :disabled="true" v-model="contractInfo.agencyNo"></el-input>
        </el-form-item>
        <el-form-item label="合同类型">
          <el-select placeholder="请选择" v-model="contractInfo.contractType" :disabled="true">
            <el-option v-for="item in contractTypes" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
				<br>
        <el-form-item label="台账编号">
          <el-input class="minput" :disabled="true" style="width: 220px;" v-model="contractInfo.accountNo"></el-input>
        </el-form-item>
        <el-form-item label="经纪人">
          <el-input class="minput" v-model="contractInfo.masterBroker" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="合同地址">
          <el-input class="minput" v-model="contractInfo.address" style="width: 500px;" :disabled="true"></el-input>
        </el-form-item>
				<br>
				<h5>变更前客户</h5>
        <el-form-item label="客户编号">
          <el-input class="minput" :disabled="true" v-model="oldOwnerForm.memberId"></el-input>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input class="minput" :disabled="true" v-model="oldOwnerForm.name"></el-input>
        </el-form-item>
				<br>
        <el-form-item label="手机号码">
          <el-input class="minput" :disabled="true" v-model="oldOwnerForm.phoneNo"></el-input>
        </el-form-item>
        <el-form-item label="固定电话">
          <el-input class="minput" v-model="oldOwnerForm.telephone" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input class="minput" v-model="oldOwnerForm.identity" :disabled="true"></el-input>
        </el-form-item>
				<br>
				<h5>变更后客户</h5>
        <el-form-item label="客户编号">
          <el-input class="minput" :disabled="true" v-model="formTable.memberId"></el-input>
					<el-button type="primary" size="mini" @click="showChooseOwner">选择</el-button>
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input class="minput" :disabled="true" v-model="formTable.name"></el-input>
        </el-form-item>
				<br>
        <el-form-item label="手机号码">
          <el-input class="minput" :disabled="true" v-model="formTable.phoneNo"></el-input>
        </el-form-item>
        <el-form-item label="固定电话">
          <el-input class="minput" v-model="formTable.telephone" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input class="minput" v-model="formTable.identity" :disabled="true"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" type="primary" @click="submitForm">确 定</el-button>
        <el-button size="mini" @click="dialogVisible=false">取 消</el-button>
      </div>
    </el-dialog>
		<!-- 变更客户END -->
	</div>
</template>

<script>
import MTable from "@/components/Table";
import Owner from "@/views/org-agencyContract/owner";
import ChooseOwner from "@/views/org-agencyContract/chooseOwner";
import EventHub from "@/scripts/eventHub";
import { findMemberPager, removeMemberById } from "@/api/org-member";
import { getLeaseByPage, changeLease } from "@/api/org-leaseContract"; // 查询租赁合同
import { getAgencyByPage, changeAgency } from "@/api/org-agencyContract";// 查询代理合同

export default {
  props: {},
  components: {
		MTable,
		Owner,
		ChooseOwner
	},
  data() {
    //这里存放数据
    return {
			owner: {
        loading: false,
        list: [],
        setting: [
					{
						label: "客户编号",
						value: "memberId"
          },
          {
						label: "成交公司",
						value: "company",
						width: 100
					},
					{
						label: "客户分类",
						value: "classification",
						formatter(row, column, cellValue, index) {
							return cellValue == 1
								? "个人"
								: cellValue == 2
								? "单位"
								: " 国外";
						}
          },
          {
						label: "客户类型",
						value: "type",
						formatter(row, column, cellValue, index) {
							return cellValue == 1
								? "业主"
								: cellValue == 2
								? "客户"
								: " 业主和客户";
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
						value: "identity",
						width: 180
					},
					{
						label: "手机号A",
						value: "phoneNo",
						width: 120
					},
					{
						label: "电话",
						value: "telephone",
						width: 120
          },
          {
						label: "地址",
						value: "address",
						width: 260
          },
          {
						label: "开户银行",
						value: "bankName"
          },
          {
						label: "名称",
						value: "bankUserName"
          },
          {
						label: "银行卡号",
						value: "bankCardNo",
						width: 200
					},
					{
						label: "创建人",
						value: "createUser"
					},
					{
						label: "创建时间",
						value: "createTime",
						width: 160
					},
					{
						label: "备注",
						value: "description",
						width: 200
					}
				],
				parms: {
					identity: "",
					name: "",
					phoneNo: "",
					type: "",
					classification: ""
				},
        total: 10,
        page: 1,
        rows: 10
			},
			leaseOwner: {
				list: [],
        setting: [
					{
						label: "合同编号",
						value: "leaseNo",
						width: 240
					},
					{
						label: "合同类型",
						value: "",
						formatter(row, column, cellValue, index) {
							return '租赁合同';
						}
					},
					{
						label: "合同状态",
						value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue == -1 ? '删除' : cellValue == 0 ? '作废' : cellValue == 1 ? '生效' : '到期';
            }
					},
					{
						label: "开始日期",
						value: "startTime"
					},
					{
						label: "结束日期",
						value: "endTime"
          },
          {
						label: "业主名称",
						value: ""
          },
          {
						label: "业主编号",
						value: ""
					},
					{
						label: "客户编号",
						value: "memberId"
          },
					{
						label: "客户名称",
						value: "memberName"
          }
				]
			},
			agencyOwner: {
				list: [],
        setting: [
					{
						label: "合同编号",
						value: "agencyNo",
						width: 240
					},
					{
						label: "合同类型",
						value: "",
						formatter(row, column, cellValue, index) {
							return '代理合同';
						}
					},
					{
						label: "合同状态",
						value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue == -1 ? '删除' : cellValue == 0 ? '作废' : cellValue == 1 ? '生效' : '到期';
            }
					},
					{
						label: "开始日期",
						value: "startTime"
					},
					{
						label: "结束日期",
						value: "endTime"
          },
          {
						label: "业主名称",
						value: "memberName"
          },
          {
						label: "业主编号",
						value: "memberId"
					},
					{
						label: "客户编号",
						value: ""
          },
					{
						label: "客户名称",
						value: ""
          }
				]
			},
			typeTitle: "",
			contractType: "",
			contractInfo: {},// 合同信息
			formTable: {},// 变更后客户
			oldOwnerForm: {},// 变更前客户
			dialogVisible: false,
			ownerTypes: [{ value: 1, label: "业主" }, { value: 2, label: "客户" }],
			contractTypes: [{ value: 1, label: "租赁合同" }, { value: 2, label: "代理合同" }, { value: 3, label: "过期合同" }],
      classifications: [
        { value: 1, label: "个人" },
        { value: 2, label: "单位" },
        { value: 3, label: "国外" }
      ]
		};
  },
  //监听属性 类似于data概念
  computed: {
		leaseform() {
      return {
        accountNo: this.contractInfo.accountNo,
        leaseId: this.contractInfo.leaseId,
        memberId: this.formTable.memberId,
        memberName: this.formTable.name
      };
		},
		agencyform() {
      return {
        accountNo: this.contractInfo.accountNo,
        agencyId: this.contractInfo.agencyId,
        memberId: this.formTable.memberId,
        memberName: this.formTable.name
      };
		},
	},
  //方法集合
  methods: {
		/**
		 * 分页查询
		*/
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
		/**
		 * 单选Table
		*/
		handleCurrentChange(val){
			if(!val) return
			this.oldOwnerForm = { ...val };
			// 查询租赁合同
      getLeaseByPage({memberName: val.name}).then(res => {
				let { code, body } = res;
        if (code == 1000) {
          this.leaseOwner.list = body.rows;
        }
			});
			// 查询代理合同
			getAgencyByPage({memberName: val.name}).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.agencyOwner.list = body.rows;
        }
      });
    },
		/**
		 * 客户资料修改
		*/
		editOwner(ele) {
			this.typeTitle = "edit";
			this.$refs.owner.show({ ...ele });
		},
		/**
		 * 客户资料删除
		*/
		deleteOwner({ memberId }) {
			this.$confirm("此操作将删除该客户信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeMemberById({ memberId: memberId }).then(res => {  
            let { code, body } = res;
            if (code == 1000) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.currentChange(1);
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
		/**
		 * 更改租赁合同的客户信息
		*/
		changeOwner(val, index) {
			this.dialogVisible = true;
			this.contractInfo = { ...val };
			this.contractInfo.contractType = index
			this.contractType = index === 1 ? '租赁' : '代理'
		},
		/**
		 * chooseOwner选择业主
		*/
    sureSelectedOwner(owner) {
      this.formTable = { ...owner };
    },
		/**
		 * 确定更改用户
		*/
		submitForm() {
			if (this.contractType === '租赁') {
				console.log("leaseform =====",this.leaseform);
				
				changeLease(this.leaseform).then(res => {
					const { code } = res;
					if (code == 1000) {
						this.$message({
							message: "变更成功",
							type: "success"
						});
						this.currentChange(1);
						this.dialogVisible = false;
					} else {
						this.$message({
							message: "创建失败",
							type: "error"
						});
					}
				});
			}else {
				console.log("agencyform =====",this.agencyform);

				changeAgency(this.agencyform).then(res => {
					const { code } = res;
					if (code == 1000) {
						this.$message({
							message: "变更成功",
							type: "success"
						});
						this.currentChange(1);
						this.dialogVisible = false;
					} else {
						this.$message({
							message: "创建失败",
							type: "error"
						});
					}
				});
			}
      
    },
		/**
		 * 客户资料条件查询
		*/
		handleClickSearch() {
      this.currentChange(1);
		},
		handClickOwnerSure() {
      this.$refs.owner.close();
    },
    handClickOwnerCancel() {
      this.$refs.owner.close();
		},
		showChooseOwner() {
      this.$refs.chooseOwner.show();
    },
		/**
		 * 新建客户信息
		*/
    showAddOwner() {
      this.typeTitle = "add";
      this.$refs.owner.show();
    }
	},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
		this.$nextTick(() => {
      this.currentChange(1);
    })
    EventHub.$on("changeChooseOwnerPage", (data = {}) => {
				this.$nextTick(() => {
					this.currentChange(1);
			})
    });
	},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
};
</script>

<style>
.mContainer .el-table__body tr.current-row>td {
	background-color: #ffec8b !important;
}
</style>
<style scoped>
.contorl {
  padding: 20px 0;
  text-align: center;
}
h5 {
  font-size: 16px;
  margin-bottom: 10px;
}
</style>