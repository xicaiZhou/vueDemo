<template>
  <div class="table">
    <el-table 
      :show-summary="showSummary" 
      :summary-method="summaryMethod" 
      :data="data" 
      max-height="500"
      border
      highlight-current-row
      :header-cell-style="tableHeaderColor"
      ref="interfaceTable" 
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
    
    <!-- 分页 -->
    <div v-if="!disabledPaginnation">
      <el-pagination 
      v-if="hasPaginationSizes" 
      background 
      layout="total, prev, pager, next, sizes" 
      :total="total" 
      :page-size="pageSize" 
      :current-page="pageNum" 
      @current-change="currentChange"
      @size-change="handleSizeChange"
      :page-sizes="[100, 200, 500, 1000]"
    >
    </el-pagination>
    <!-- 分页 -->
    <el-pagination 
      v-else
      background 
      layout="total, prev, pager, next" 
      :total="total" 
      :page-size="pageSize" 
      :current-page="pageNum" 
      @current-change="currentChange"
    >
    </el-pagination>
    </div>
    <!-- <el-pagination 
      v-if="hasPagination" 
      background 
      layout="total, prev, pager, next" 
      :total="total" 
      :page-size="pageSize" 
      :current-page="pageNum" 
      @current-change="currentChange"
    >
    </el-pagination> -->
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
    hasPaginationSizes: {
      type: Boolean,
      default: false
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
    },
    notChangeRow:  {
      type: Boolean,
      default: false
    },
    disabledPaginnation: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    currentChange(val) {
      this.$emit('currentChange', val)
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleSelectionChange(val){
      this.$emit('handleSelectionChange', val)
    },
    handleCurrentChange(val){
      this.$emit('handleCurrentChange', val)
    },
    dblhandleCurrentChange(val){
      this.$emit('dblhandleCurrentChange', val)
    },
    setCurrentRow(row) {
      if (!row)  {
        this.$refs.interfaceTable.setCurrentRow(this.data[0])
        console.log('table setCurrentRow error....row is null')
      }
      this.$refs.interfaceTable.setCurrentRow(row)
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color: #5CB87A;color: #fff;font-weight: 900;'
      }
    }
  },
  watch: {
    data: function() {
      this.$nextTick(function() {
        if (this.data && !this.notChangeRow) {
          this.setCurrentRow(this.data[0])
        }
      })
    }
  },
};
</script>
