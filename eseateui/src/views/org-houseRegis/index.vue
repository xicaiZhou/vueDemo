<template>
	<div class="house_regis">
		<el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- 1、片区名称 -->
			<el-tab-pane label="片区名称"  name="first">
        <regional v-if="activeName=='first'"></regional>
			</el-tab-pane>
      <!-- 2、城市地铁 -->
			<el-tab-pane label="城市地铁"  name="second">
        <subway v-if="activeName=='second'"></subway>
			</el-tab-pane>
      <!-- 3、楼盘名称 -->
			<el-tab-pane label="楼盘名称"  name="third">
        <houseName v-if="activeName=='third'"></houseName>
			</el-tab-pane>
      <!-- 4、楼盘字典 -->
			<el-tab-pane label="楼盘字典" name="fourth">
        <dictionaries v-if="activeName=='fourth'"></dictionaries>
			</el-tab-pane>
      <!-- 5、楼盘跟进 -->
      <el-tab-pane label="楼盘跟进" name="fifth">
        <floorFollowUp v-if="activeName=='fifth'"></floorFollowUp>
			</el-tab-pane>
      <!-- 6、楼盘跟进查询 -->
      <el-tab-pane label="跟进查询" name="sixth">
        <followUpQuery v-if="activeName=='sixth'"></followUpQuery>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import regional from '../../components/regional'
import subway from '../../components/subway'
import houseName from '../../components/houseName'
import dictionaries from '../../components/dictionaries'
import floorFollowUp from '../../components/floorFollowUp'
import followUpQuery from '../../components/followUpQuery'
import { regionFindAllTree } from "@/api/org-house";
export default {
	components:{
	  regional,
	  subway,
    houseName,
    dictionaries,
    floorFollowUp,
    followUpQuery
	},
	data(){
		return{
      activeName:'first'
		}
	},
	methods:{
    handleClick(tab){
      this.index = tab.index
	  }
	},
	created(){
        regionFindAllTree().then(res => {
		const cityAllData = res.body
        cityAllData.map(o=>{
            o.value = o.id
            o.label = o.name
            if(!o.children) return
            o.children.map(j=>{
              j.value = j.id
              j.label = j.name
              if(!j.children) return
              j.children.map(k=>{
                k.value = k.id
                k.label = k.name   
              })
            })
        })
        this.$store.commit('AREA',cityAllData)
        });		
	}
}
</script>

<style lang='scss' scoped>

.el-button-group {
	margin-left: 5px;
}
.el-input {
    width: 300px;
  }
  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
	border-radius: 4px;
	text-align: center;
	padding-bottom: 20px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
	background: #67C23A;
	line-height: 36px;
	text-align: center;
	color: #ffffff;
	font-size: 18px;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .oper-grid{
	  padding-top: 20px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>