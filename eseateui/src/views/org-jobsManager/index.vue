<!--  -->
<template>
  <div class="jobs_manager">
		<el-input placeholder="请输入岗位名称/ID" v-model="search" class="input-with-select">
			<el-select v-model="select" slot="prepend" placeholder="请选择">
				<el-option label="全部" value=""></el-option>
				<el-option label="启用" value="1"></el-option>
				<el-option label="停用" value="0"></el-option>
			</el-select>
			<el-button slot="append" icon="el-icon-search" @click="searchClick(search, select)">查询</el-button>
		</el-input>
		<el-button class="rightRole" @click="buildRoleClick()" type="primary">新建岗位</el-button>
		<el-table :data="deptData" max-height="600">
			<el-table-column prop="id" label="岗位ID"></el-table-column>
			<el-table-column prop="name" label="岗位名称"></el-table-column>
      <el-table-column prop="tagName" label="岗位标签"></el-table-column>
			<el-table-column prop="deptName" label="所属部门"></el-table-column>
			<el-table-column prop="statusFlag" label="状态"></el-table-column>
      <el-table-column prop="description" label="备注"></el-table-column>
			<el-table-column fixed="right" label="操作">
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
					<el-button
						@click="deleteClick(scope.row)"
						type="text"
						size="small"
						style="color:red"
					>删除</el-button>
					<el-button @click="editorClick(scope.row)" type="text" size="small">修改</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 新增/修改/查看岗位信息提示框 -->
    <el-dialog
      :title="currentTitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <div class="block zMark" v-if="!showCancel"></div>
      <el-form :model="deptForm" ref="deptForm" label-width="80px">
        <el-form-item label="所属部门">
          <el-cascader v-model="ruleForm.deptIdList" filterable
    change-on-select :props="props" style="width: 80%"></el-cascader>
        </el-form-item>
        <el-form-item label="岗位名称">
          <el-input placeholder="请输入岗位名称" v-model="ruleForm.name" style="width: 80%"></el-input>
          <!-- <el-select
            :disabled="(type==1||!ruleForm.deptIdList)?true:false"
            v-model="ruleForm.stationId"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in stationOptions"
              :key="item.id"
              :label="item.name"
              :value="Number(item.id)"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="岗位标签" prop="status">
            <el-select v-model="ruleForm.sign" placeholder="请选择">
              <el-option
                v-for="item in signList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>



        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="showCancel" type="primary" @click="roleClick(ruleForm)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { stationFind, stationSave, stationRemove,stationUpdate,stationFindTags } from '@/api/org-job'
import { find } from '@/api/org-dept'
import { debuglog } from 'util';
export default {

  data() {
    //这里存放数据
    return {
      props:{
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          let form = {
            parentId: null
          }
          if (node && node.data && node.data.id) form.parentId = node.data.id
          find(form).then(res => {
            if (res && res.body && res.body.length > 0) {
              let data = []
              res.body.forEach(element => {
                data.push({
                  id: element.id,
                  value: element.id,
                  label: element.name,
                  leaf: element.leaf
                })
              })
              resolve(data)
            }
          })
          return
        }
      },
      signList:[],
      search:'',
      select:'',
      deptData:[],
      dialogFormVisible: false,
      currentTitle:'',
      deptForm:{},
      stationOptions:[],
			ruleForm: {
        deptIdList: [],
        name:"",
        statusNum:1,
        status:1
      },
      showCancel: true
		};
  },
  methods: {
    stationFind(status="",name=""){
      // console.log(this.$route.query.id)
      stationFind({status:status,name:name,deptId:this.$route.query.id}).then(res=>{
        res.body.map(o=>{
          o.status == 1 ? o.statusFlag ='启用': o.statusFlag = '停用'
        })
       this.deptData = res.body
      })
    },
    handleClick(row){
      this.showCancel = false
      this.dialogFormVisible = true
      this.ruleForm = {}
      this.ruleForm = row
      this.ruleForm.sign = row.tag
    },
    buildRoleClick(){
      this.dialogFormVisible = true
      this.showCancel = true
      this.ruleForm ={}
      this.ruleForm = {
        statusNum:1,
        status:1,
        sign:'EMPLOYEE'
      }
      this.currentTitle = "新建岗位"
    },
    stationFindTags(i){
      stationFindTags().then(res=>{
        this.signList = res.body
      })
    },
    deleteClick(row){
      this.$confirm('此操作将永久删除该岗位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          stationRemove({id:row.id}).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.stationFind()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    editorClick(row){
      this.showCancel = true
      this.dialogFormVisible = true
      this.currentTitle = "修改岗位"
      this.ruleForm = {}
      this.ruleForm = row
      this.ruleForm = {
        deptId: row.deptId,
        deptIdList: row.deptIdList,
        deptName: row.deptName,
        description: row.description,
        grade: row.grade,
        id: row.id,
        name: row.name,
        qs: row.qs,
        status: row.status,
        sign: row.tag,
        statusNum: row.status =='启用'? 1 : 0
      }
      
    },
    roleClick(e){
      const {deptIdList, name, status,sign } = this.ruleForm
      if(!deptIdList){
            this.$message({
              type: 'error',
              message: '所属部门为必填项'
            })   
            return
      }
      const params = {
        deptId: [...deptIdList].pop(),
        description:'',
        grade: 0,
        name: name,
        status: status,
        tag:sign
      }
      if(this.ruleForm.id) { //修改
        const newParams = Object.assign(params,{id:this.ruleForm.id})
        stationUpdate(newParams).then(res=>{
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.dialogFormVisible = false
            this.stationFind()
        })
      }else { //新增
        stationSave(params).then(res=>{
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.dialogFormVisible = false
            this.stationFind()
        })
      }

    },
    searchClick(search, select){
      this.stationFind(select,search)
    },
    findDepartment(id=""){
          if(id){
            find({parentId:id}).then(res => {
              if (res && res.body && res.body.length > 0) {
                let data = []
                res.body.forEach(element => {
                  data.push({
                    id: element.id,
                    value: element.id,
                    label: element.name,
                    leaf: element.leaf
                  })
                })
                this.ruleForm.deptIdList = data
              }
            })
          }else{
            find().then(res => {
              if (res && res.body && res.body.length > 0) {
                let data = []
                res.body.forEach(element => {
                  data.push({
                    id: element.id,
                    value: element.id,
                    label: element.name,
                    leaf: element.leaf
                  })
                })
                this.ruleForm.deptIdList = data
              }
            })
          }
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.stationFind()
    this.findDepartment()
    this.stationFindTags()
  },
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
.el-table {
  margin-top: 12px;
}
.el-select {
  width: 110px;
}
.el-input {
  width: 650px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-dialog__body{
  position: relative;
  .zMark{
     position: absolute;
     z-index: 99;
     width: 92%;
     height: 55%;
  }
}
</style>