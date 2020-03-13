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
          label: "ID",
          value: "leaseCostDetailId"
        },
        {
          label: "分类",
          value: "classification"
        },
        {
          label: "类型",
          value: "type",
          formatter(row, column, cellValue, index) {
            return cellValue === 1 ? '收入' : '支出';
          }
        },
        {
          label: "预收日期",
          value: "prepaidDate"
        },
        {
          label: "预收金额",
          value: "prepaidAmount"
        },
        {
          label: "状态",
          value: "status",
           formatter(row, column, cellValue, index) {
             return cellValue == 1 ? "已收款" : "未收款";
          }
        },
        {
          label: "实收日期",
          value: "acturalDate"
        },
        {
          label: "实收金额",
          value: "acturalAmount"
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
        },
        {
          label: "系统编号",
          value: "sysNo"
        },
        {
          label: "台账编号",
          value: "accountNo"
        }
      ]
    };
  },
  created() {},
  methods: {},
  watch: {}
};
</script>
