<!-- 预收房租 -->
<template>
  <div class="rent_advance">
		<el-form ref="form" :model="searchForm" label-width="90px" size="small" :inline="true">
      <el-form-item label="城市：">
        <el-select v-model="searchForm.city" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="北京" :value="0"></el-option>
          <el-option label="上海" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区县：">
        <el-select v-model="searchForm.county" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="海淀区" :value="0"></el-option>
          <el-option label="宝山区" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="片区：">
        <el-select v-model="searchForm.area" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="东坝" :value="0"></el-option>
          <el-option label="安陵" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同编号：">
        <el-input v-model="searchForm.contractNum"></el-input>
      </el-form-item>
			<el-form-item label="楼盘：">
        <el-select v-model="searchForm.house" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="万科龙湖" :value="0"></el-option>
          <el-option label="碧桂园" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门牌号：">
        <el-input v-model="searchForm.doorNum"></el-input>
      </el-form-item>
      <el-form-item label="台账编号：">
        <el-input v-model="searchForm.noteNum"></el-input>
      </el-form-item>
      <el-form-item label="客户姓名：">
        <el-input v-model="searchForm.customerName"></el-input>
      </el-form-item>
			<el-form-item label="公司：">
        <el-select v-model="searchForm.company" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="总公司" :value="0"></el-option>
          <el-option label="郑州分公司" :value="1"></el-option>
					<el-option label="北京分公司" :value="2"></el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="门店：">
        <el-select v-model="searchForm.doorShop" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="技术一部" :value="0"></el-option>
          <el-option label="销售二部" :value="1"></el-option>
        </el-select>
      </el-form-item>
			<el-form-item label="经纪人：">
        <el-input v-model="searchForm.selfPeople"></el-input>
      </el-form-item>
      <el-form-item label="客户电话：">
        <el-input v-model="searchForm.customerPhone"></el-input>
      </el-form-item>
      <el-form-item label="费用类型：">
        <el-select v-model="searchForm.feeType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="房租" :value="0"></el-option>
          <el-option label="水电费" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款状态：">
        <el-select v-model="searchForm.paymentStatus" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="只看未收" :value="0"></el-option>
          <el-option label="只看已收" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门锁类型：">
        <el-select v-model="searchForm.doorLockType" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="普通锁" :value="0"></el-option>
          <el-option label="智能锁" :value="1"></el-option>
          <el-option label="刷卡" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预收日期：">
        <el-col>
          <el-date-picker
            v-model="searchForm.predictDate"
            type="daterange"
            align="right"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            style="width:222px"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="实收日期：">
        <el-col>
          <el-date-picker
            v-model="searchForm.actualDate"
            type="daterange"
            align="right"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            style="width:222px"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item style="float:right;margin-right:150px">
        <el-button type="primary" @click="onSubmit(1)">查询</el-button>
        <el-button type="primary" @click="onSubmit(2)">群发短信</el-button>
      </el-form-item>
    </el-form>
		<el-table :data="tableData" border>
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="name" label="ID"></el-table-column>
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column prop="differentType" label="分类"></el-table-column>
      <el-table-column prop="contractNum" label="合同编号"></el-table-column>
      <el-table-column prop="address" label="台账编号"></el-table-column>
      <el-table-column prop="identity" label="门店"></el-table-column>
      <el-table-column prop="deptName" label="主经济人"></el-table-column>
      <el-table-column prop="masterName" label="主成交人"></el-table-column>
      <el-table-column prop="manageName" label="台账地址"></el-table-column>
      <el-table-column prop="predictDate" label="预收日期"></el-table-column>
      <el-table-column prop="predictMoney" label="预收金额"></el-table-column>
      <el-table-column prop="paymentStatus" label="收款状态"></el-table-column>
      <el-table-column prop="actualDate" label="实收日期"></el-table-column>
      <el-table-column prop="actualMoney" label="实收金额"></el-table-column>
      <el-table-column prop="peopleName" label="客户名称"></el-table-column>
      <el-table-column prop="rentDate" label="房租日期"></el-table-column>
      <el-table-column prop="desc" label="备注"></el-table-column>
      <el-table-column prop="smsRemind" label="短信提醒"></el-table-column>
      <el-table-column prop="contractAdd" label="合同地址"></el-table-column>
      <el-table-column prop="viceManager" label="副经纪人"></el-table-column>
      <el-table-column prop="vicePeople" label="副成交人"></el-table-column>
      <el-table-column prop="doorLockType" label="门锁类型"></el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope" class="flex-center btn-style">
          <el-button @click="handeleClick(scope.$index, scope.row)" type="text" size="small">发送短信</el-button>
          <el-button @click="changeClick(scope.$index, scope.row)" type="text" size="small">{{isActualMoney ? "撤销收款" : "确认收款"}}</el-button>
        </template>
      </el-table-column>
    </el-table>
	</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      isActualMoney: false,
      tableData: [{
        id: 1,
        name: '哈哈哈'
      }],
      searchForm: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
		};
  },
  //监听属性 类似于data概念
  computed: {},
  //方法集合
  methods: {
    // 发送短信
    handeleClick(index, item) {

    },
    // 确认/撤销收款
    changeClick(index, item) {
      this.isActualMoney = !this.isActualMoney
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>