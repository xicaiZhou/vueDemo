
<template>
<!-- 付款协议 -->
  <m-table :hasPagination="false" :data="payments" :showSummary="true" :summaryMethod="summaryMethod">
    <el-table-column prop="years" label="年次" width="100"></el-table-column>
    <el-table-column prop="startTime" label="起止日期" width="100">
      <template slot-scope="scope">
        <template>{{scope.row.startTime}}～{{scope.row.endTime}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="rent" label="租金单价" width="100">
      <template slot-scope="scope">
        <el-input v-if="scope.row.edit != 1" placeholder="请输入" v-model="scope.row.rent"></el-input>
        <template v-else>{{scope.row.rent}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="rentFreeDays" label="免租天数" width="100">
      <template slot-scope="scope">
        <el-input v-if="scope.row.edit != 1" placeholder="请输入" v-model="scope.row.rentFreeDays"></el-input>
        <template v-else>{{scope.row.rentFreeDays}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="rentFreeNumber" label="免租在第*次" width="100">
      <template slot-scope="scope">
        <el-input v-if="scope.row.edit != 1" placeholder="请输入" v-model="scope.row.rentFreeNumber"></el-input>
        <template v-else>{{scope.row.rentFreeNumber}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="paymentWay" label="付款方式" width="120">
      <template slot-scope="scope">
        <el-select v-model="scope.row.paymentWay" v-if="scope.row.edit != 1">
          <el-option
            v-for="item in payTypes"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          ></el-option>
        </el-select>
        <template v-else>{{scope.row.paymentWay | getStatusLabel(payTypes)}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="advancePaymentDays" label="提前付款天数" width="120">
      <template slot-scope="scope">
        <el-input
          v-if="scope.row.edit != 1"
          placeholder="请输入"
          v-model="scope.row.advancePaymentDays"
        ></el-input>
        <template v-else>{{scope.row.advancePaymentDays}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="rentTotal" label="租金合计" width="100"></el-table-column>
    <el-table-column label="操作" width="110px">
      <template slot-scope="scope">
        <el-button type="text" v-if="scope.row.edit == 1" @click="editPayment(scope)">编辑</el-button>
        <el-button type="text" v-else @click="toSave(scope)">保存</el-button>
        <!-- <el-button type="text" @click="deletePayment(scope)">删除</el-button> -->
      </template>
    </el-table-column>
  </m-table>
</template>

<script>
import MTable from "@/components/Table";
import { getPaymentAgreement, updatePayment } from "@/api/org-agencyContract";
import EventHub from "@/scripts/eventHub";

export default {
  props: {
    list1: {
      type: Array,
      default: () => []
    },
    startTime: {
      type: String | Number,
      default: ""
    },
    endTime: {
      type: String | Number,
      default: ""
    },
    type: {
      type: String | Number,
      default: ""
    }
  },
  components: {
    MTable
  },
  filters: {
    getStatusLabel(val, arr) {
      let status = arr.find(item => item.label === val);
      return status ? status.label : "";
    }
  },
  data() {
    return {
      list: [],
      setting: [
        {
          label: "年次",
          value: "years"
        },
        {
          label: "起止日期",
          value: "",
          formatter(row, column, cellValue, index) {
            return `${row.startTime}-${row.endTime}`;
          }
        },
        {
          label: "租金单价",
          value: "rent"
        },
        {
          label: "免租天数",
          value: "rentFreeDays"
        },
        {
          label: "免租在*次",
          value: "rentFreeNumber"
        },
        {
          label: "付款方式",
          value: "paymentWay"
        },
        {
          label: "提前付款天数",
          value: "advancePaymentDays"
        },
        {
          label: "租金合计",
          value: "rentTotal"
        }
      ],
      payTypes: [
        { value: "", label: "所有项" },
        { value: 0, label: "季付" },
        { value: 1, label: "半年付" },
        { value: 2, label: "一年付" },
        { value: 3, label: "月付" },
        { value: 4, label: "全付" },
        { value: 5, label: "两月付" }
      ],
      // requestIndex: 0
    };
  },
  computed: {
    payments() {
      return this.list.length > 0 ? this.list : this.list1
    }
  },
  methods: {
    getList() {
      getPaymentAgreement({
        startTime: this.startTime,
        endTime: this.endTime
      }).then(res => {
        let { code, body } = res;
        if (res.code == 1000) {
          this.list = body.map(item => ({ ...item, edit: 2 }));
        }
      });
    },
    // 删除
    deletePayment({ $index }) {
      if ($index !== -1) {
        this.payments.splice($index,1);
      }
    },
    //更新
    editPayment({ $index }) {
      this.payments[$index].edit = 2;
    },
    //更新保存 请求接口
    toSave({ row, $index }) {
      const list = this.payments
      list[$index].edit = 1;
      updatePayment({ ...row }).then(res => {
        let { code } = res;
        if (code == 1000) {
          list[$index] = {...list[$index], ...res.body.agencyPaymentAgreementVO}
          this.list = [...list]
          EventHub.$emit("advacePaymentData", {index: $index, data: res.body.agencyCostDetailRequests});
        }
      });
    },
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((c, index) => {
        if(index === 0) {
          sums[index] = '租金总计：'
        } else if (index === 8) {
          let sum = 0
          data.forEach(d => {
            sum += d.rentTotal
          })
          sums[index] = sum
        } else {
          sums[index] = ''
        }
      })
      return sums
    }
  },
  watch: {
    endTime() {
      // console.log("谁先走");
      // if (this.type === 'edit' && this.requestIndex === 0) {
      //   console.log("endTime=====",this.requestIndex);
        
      //   this.requestIndex++
      //   return
      // }
      this.getList()
    },
    startTime() {
      // if (this.type === 'edit' && this.requestIndex === 0) {
      //   console.log("startTime=====",this.requestIndex);
      //   this.requestIndex++
      //   return
      // }
      this.getList()
    }
  },
  // mounted () {
  //   console.log("mounted=====",this.requestIndex);
  //   this.requestIndex = 0
  // },
  // created() {
  //   console.log("created=====",this.requestIndex);
  //   this.requestIndex = 0
  // },
};
</script>
