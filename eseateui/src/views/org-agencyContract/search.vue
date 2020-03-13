<template>
  <div class="mtools">
      <el-form label-width="90px" size="small" v-model="searchParams" ref="searchParams" :inline="true">
        <m-cascader :companyId.sync="searchParams.companyId" :storeId.sync="searchParams.storeId"></m-cascader>
        <el-form-item label="经纪人">
          <el-input v-model="searchParams.masterBroker" class="minput" placeholder="请输入经纪人"></el-input>
        </el-form-item>
        <el-form-item label="合同状态">
          <el-select placeholder="请选择">
            <el-option v-for="item in contractTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input v-model="searchParams.accountNo" class="minput" placeholder="请输入台账编号"></el-input>
        </el-form-item>
        <el-form-item label="业主姓名">
          <el-input class="minput" placeholder="请输入业主姓名"></el-input>
        </el-form-item>
        <el-form-item label="合同编号">
          <el-input v-model="searchParams.agencyNo" class="minput" placeholder="请输入合同编号"></el-input>
        </el-form-item>
        <el-form-item label="付款方式">
          <el-select placeholder="请选择">
            <el-option v-for="item in payTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="签约日期">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="房源地址">
          <el-input v-model="searchParams.address" class="minput" placeholder="请输入房源地址"></el-input>
        </el-form-item>
        <el-form-item label="签约状态">
          <el-select v-model="searchParams.signType" placeholder="请选择">
            <el-option v-for="item in signTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="currentChange">查 询</el-button>
          <el-button type="primary" @click="newLedger">新建代理合同</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script>
export default {
  name: 'search',
  props: {
    searchParams: {
      type: Object,
      default: () => ({})
    },
    contractTypes: {
      type: Array,
      default: () => []
    },
    payTypes: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    currentChange() {
      this.$emit('currentChange', 1)
    },
    newLedger() {
      this.$emit('newLedger')
    }
  }
}
</script>
