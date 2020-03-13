<!--协议费用-->
<template>
  <m-table :hasPagination="false" :data="payments" :showSummary="true" :summaryMethod="summaryMethod">
    <el-table-column prop="years" label="年次" width="100"></el-table-column>
    <el-table-column prop="startTime" label="起止日期" width="100">
      <template slot-scope="scope">
        <template>{{scope.row.startTime}}～{{scope.row.endTime}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="rent" label="月租金单价" width="100">
      <template slot-scope="scope">
        <el-input v-if="scope.row.edit != 1" placeholder="请输入" v-model="scope.row.rent"></el-input>
        <template v-else>{{scope.row.rent}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="netUnitPric" label="网费单价" width="100">
      <template slot-scope="scope">
        <el-input v-if="scope.row.edit != 1" placeholder="请输入" v-model="scope.row.netUnitPric"></el-input>
        <template v-else>{{scope.row.netUnitPric}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="propertyUnitPric" label="物业费单价" width="100">
      <template slot-scope="scope">
        <el-input v-if="scope.row.edit != 1" placeholder="请输入" v-model="scope.row.propertyUnitPric"></el-input>
        <template v-else>{{scope.row.propertyUnitPric}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="hygieneUnitPric" label="卫生费单价" width="100">
      <template slot-scope="scope">
        <el-input v-if="scope.row.edit != 1" placeholder="请输入" v-model="scope.row.hygieneUnitPric"></el-input>
        <template v-else>{{scope.row.hygieneUnitPric}}</template>
      </template>
    </el-table-column>
    <el-table-column prop="serviceUnitPric" label="服务费单价" width="100">
      <template slot-scope="scope">
        <el-input v-if="scope.row.edit != 1" placeholder="请输入" v-model="scope.row.serviceUnitPric"></el-input>
        <template v-else>{{scope.row.serviceUnitPric}}</template>
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
        <!-- <el-button type="text">删除</el-button> -->
      </template>
    </el-table-column>
  </m-table>
</template>

<script>
import MTable from "@/components/Table";
import {
  getLeasePaymentAgreement,
  updateLeasePayment
} from "@/api/org-leaseContract";
import EventHub from "@/scripts/eventHub";

export default {
  props: {
    startTime: {
      type: String | Number,
      default: ""
    },
    endTime: {
      type: String | Number,
      default: ""
    },
    list1: {
      type: Array,
      default: () => []
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
      console.log("getStatusLabel====", val, arr);
      let status = arr.find(item => item.label === val);
      return status ? status.label : "";
    }
  },
  data() {
    return {
      list: [],
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
      console.log(this.list1)
      return this.list.length > 0 ? this.list : this.list1;
    }
  },
  methods: {
    getList() {
      getLeasePaymentAgreement({
        startTime: this.startTime,
        endTime: this.endTime
      }).then(res => {
        console.log("getLeasePaymentAgreement=", res);
        let { code, body } = res;
        if (res.code == 1000) {
          this.list = body.map(item => ({ ...item, edit: 2 }));
        }
      });
    },
    //更新
    editPayment({ $index }) {
      this.payments[$index].edit = 2;
    },
    toSave({ row, $index }) {
      const list = this.payments;
      list[$index].edit = 1;
      updateLeasePayment({ ...row }).then(res => {
        let { code } = res;
        if (code == 1000) {
          list[$index] = {
            ...list[$index],
            ...res.body.leasePaymentAgreementVO
          };
          this.list = [...list];
          let rentTotal = 0
          list.forEach((d) => {
            rentTotal += d.rentTotal
          })
          EventHub.$emit("advacePaymentData", {
            index: $index,
            data: res.body.leaseCostDetailRequests,
            rentTotal 
          });
        }
      });
    },
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((c, index) => {
        if (index === 0) {
          sums[index] = "合计：";
        } else if (index === 11) {
          let sum = 0;
          data.forEach(d => {
            sum += d.rentTotal;
          });
          sums[index] = sum;
        } else {
          sums[index] = "";
        }
      });
      console.log("sums=", sums);
      return sums;
    }
  },
  watch: {
    endTime() {
      // if (this.type === 'edit' && this.requestIndex === 0) {
      //   this.requestIndex++
      //   return
      // }
      this.getList();
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
  // created() {
  //   this.requestIndex = 0
  // },
};
</script>
