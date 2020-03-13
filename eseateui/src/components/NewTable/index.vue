<template>
  <div class="table">
    <el-table 
      :show-summary="showSummary" 
      :summary-method="summaryMethod" 
      :data="data" 
      max-height="500"
      border 
      style="width: 100%" 
      v-loading="loading" 
      @selection-change="handleSelectionChange" 
      @current-change="handleCurrentChange"
      @cell-dblclick="dblhandleCurrentChange">
      <el-table-column
        v-if="hasSelection"
        type="selection"
        width="55"
        fixed>
      </el-table-column>
      <el-table-column
        v-if="hasIndex"
        label="序号"
        type="index"
        width="50"
        fixed>
      </el-table-column>
      <el-table-column v-for="(item, i) in setting" :key="i" :prop="item.value" :width="item.width" :label="item.label" :formatter="item.formatter">
        <slot :name="item.name"></slot>
      </el-table-column>
      <slot></slot>
    </el-table>
    <el-pagination v-if="hasPagination" background layout="total, prev, pager, next" :total="total" :page-size="pageSize" :current-page="pageNum" @current-change="currentChange"></el-pagination>
  </div> 
</template>

<script>
export default {
  props: {
    data:{
      type: Array,
      default(){
        return []
      }
    },
    setting:{
      type: Array,
      default(){
        return []
      }
    },
    total:{
      type: Number,
      default: 0
    },
    pageSize:{
      type: Number,
      default: 10
    },
    pageNum: {
      type: Number,
      default: 1
    },
    hasIndex: {
      type: Boolean,
      default: true
    },
    hasPagination: {
      type: Boolean,
      default: true
    },
    hasSelection: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    summaryMethod: {
      type: Function
    }
  },
  methods: {
    currentChange(val) {
      this.$emit('currentChange', val)
    },
    handleSelectionChange(val){
      this.$emit('handleSelectionChange', val)
    },
    handleCurrentChange(val){
      this.$emit('handleCurrentChange', val)
    },
    dblhandleCurrentChange(val){
      this.$emit('dblhandleCurrentChange', val)
    }
  }
};
</script>
