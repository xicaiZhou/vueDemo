<template>
  <div class="mContainer">
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
        <!-- <el-form-item label-width="180px" label="提醒天数设置 租赁合同">
          <el-input class="minput"  v-model="searchParams.w1" placeholder="请设置租赁合同到期天数"></el-input> 天
        </el-form-item> -->
        <m-cascader :companyId.sync="searchParams.companyId" :storeId.sync="searchParams.storeId"></m-cascader>
        <el-form-item label="经纪人">
          <el-input class="minput" v-model="searchParams.masterBroker" placeholder="请输入经纪人"></el-input>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input class="minput" v-model="searchParams.accountNo" placeholder="请输入台账编号"></el-input>
        </el-form-item>
        <el-form-item label="楼盘名称">
          <el-input class="minput" v-model="searchParams.buildingName" placeholder="请输入楼盘名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="门牌号">
          <el-input class="minput" v-model="searchParams.w3" placeholder="请输入门牌号"></el-input>
        </el-form-item> -->
        <el-form-item label="租赁合同">
          <el-input class="minput" v-model="searchParams.leaseDay" placeholder="请输入租赁合同"></el-input> 天内
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="currentChange(1)">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      :hasIndex="false"
      :data="table.list"
      :setting="table.setting"
      :loading="table.loading"
      :total="table.total"
      :pageNum="table.page"
      :pageSize="table.rows"
      @currentChange="currentChange"
    >
      <el-table-column label="操作" width="100px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="editLedger(scope.row)">修改备注</el-button>
        </template>
      </el-table-column>
    </m-table>
    <!-- 修改备注 -->
    <el-dialog width="545px" title="到期备注" 
    :visible.sync="dialogTableVisible"
    :close-on-click-modal="false"
    :show-close="false"
    :close-on-press-escape="false">
      <el-form label-width="90px" size="small" :inline="true">
        <el-form-item label="备注">
          <el-input style="width: 350px;" type="textarea" :rows="6" placeholder="请输入备注"  v-model="edit.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="handleSubmit">提 交</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import MTable from "@/components/Table";
import MCascader from "@/components/department/mcascader";
import {
  getExpirationPage,
  getModifye
} from "@/api/org-expirationContract";
export default {
  components: {
		MTable,
		MCascader
  },
  data() {
    return {
      activeName: 'first',
      dialogTableVisible: false,
      edit: {
        description:''
      },
       searchParams: {
        leaseDay:"30",//租赁合同
        companyId:"",//分公司
        storeId:"",//门店
        masterBroker:"",
				contractNo:"",
				type: "CONTRACT_LEASE",
        w1:"",
        buildingName:""
      },
      table: {
        loading:false,
        list: [],
        setting: [
          {
            label: "ID",
            value: "id",
          },
          {
            label: "合同状态",
            value: "", 
            formatter(row, column, cellValue, index) {
              return cellValue == -1 ? '删除' : cellValue == 0 ? '作废' : cellValue == 1 ? '正常' : '到期';
            }
          },
          {
            label: "合同类型",
            value: "type",
             formatter(row, column, cellValue, index) {
              return cellValue == "CONTRACT_AGENCY" ? '代理合同' : '租赁合同';
            }
          },
          {
            label: "合同编号",
            value: "contractNo",
          },
          {
            label: "台账编号",
            value: "accountNo",
          },
          {
            label: "经纪人",
            value: "masterBroker",
          },
          {
            label: "房源地址",
            value: "address",
          },
          {
            label: "用户姓名",
            value: "memberName",
          },
          {
            label: "联系电话",
            value: "phoneNo",
          },
          {
            label: "合同日期",
            value: "",
             formatter(row, column, cellValue, index) {
              return `${row.startTime}至${row.endTime}`;
            }
          },
          {
            label: "合同期限",
            value: "",
             formatter(row, column, cellValue, index) {
              return `${row.year}年${row.month}月${row.day}日`;
            }
          },
          {
            label: "合同总收",
            value: "totalBudget",
          },
          {
            label: "到期备注",
            value: "description",
          }
        ],
        total: 10,
        page: 1,
        rows: 10
      }
    };
  },
  methods: {
    // 修改备注
    editLedger(item) {
      this.dialogTableVisible = true
      this.edit = {
        contractId: item.contractNo,
        type:  item.type,
        description: item.description
      }
    },
    currentChange(val) {
      if (val) {
        this.searchParams.page = val;
      }
      getExpirationPage(this.searchParams).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.table.list = body.rows;
          this.table.total = body.total
        }else {
          this.table.total = 0
        }
      });
    },
    handleSubmit() {
      getModifye(this.edit).then(res => {
        if (res.code == 1000) {
          this.dialogTableVisible = false
           this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.currentChange(1)
        }  else {
           this.$message({
              type: "error",
              message: "修改失败!"
            });
        }
      }).catch(err  => {
        console.error(err)
         this.$message({
          type: "error",
          message: "作废失败!"
        });
      })
    }
  },
   mounted() {
    this.currentChange(1);
  }
};
</script>

<style scoped>
h5{
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
