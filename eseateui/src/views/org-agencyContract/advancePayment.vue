<!--预收预付-->
<template>
  <m-table :hasPagination="false" :data="list" :setting="setting"></m-table>
</template>
<script >
import MTable from "@/components/Table";
import { getPaymentAgreement } from "@/api/org-agencyContract";
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MTable
  },
  data() {
    return {
      setting: [
        {
          label: "类别",
          value: "classification"
        },
        {
          label: "次数",
          value: "",
          formatter(row, column, cellValue, index) {
            return `${index+1}`;
          }
        },
        {
          label: "预付日期",
          value: "prepaidDate"
        },
        {
          label: "预付金额",
          value: "prepaidAmount"
        },
        {
          label: "状态",
          value: "status",
           formatter(row, column, cellValue, index) {
             return cellValue == 1 ? "已付款" : "未付款";
          }
        },
        {
          label: "实付日期",
          value: "acturalDate"
        },
        {
          label: "实付金额",
          value: "acturalAmount"
        },
        {
          label: "类型",
          value: "type",
           formatter(row, column, cellValue, index) {
             return cellValue == 1 ? "收入" : "支出";
          }
        },
        {
          label: "房租日期",
          value: "",
          formatter(row, column, cellValue, index) {
            if (row.classification == "押金") {
              return "";
            }
            return `${row.startTime}至${row.endTime}`;
          }
        },
        {
          label: "备注",
          value: "remarks"
        }
      ]
    };
  },
  created() {},
  methods: {},
};
</script>
