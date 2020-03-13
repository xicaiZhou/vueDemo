<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <span class="asideTree">组织架构</span>
        <el-tree
         v-if="!push"
          :default-expand-all="defaultExpandAll"
          highlight-current
          :load="loadNode"
          :props="defaultProps"
          lazy
          @node-click="handleNodeClick"
        ></el-tree>
      </el-aside>
      <el-main>
        <el-input placeholder="请输入部门名称/ID" v-model="search" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="searchClick(search, select)">查询</el-button>
        </el-input>
        <el-button class="rightRole" @click="buildRoleClick()" type="primary">新建部门</el-button>
        <!-- :data="tableData.filter(data => !search || data.number.includes(search) || data.name.toLowerCase().includes(search.toLowerCase()))" -->
        <el-table :data="deptData" max-height="600">
          <el-table-column prop="id" label="部门ID"></el-table-column>
          <el-table-column prop="parentName" label="上级部门"></el-table-column>
          <el-table-column prop="name" label="部门名称"></el-table-column>
          <el-table-column prop="statusFlag" label="状态"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="gotoJobManage(scope.row)" type="text" size="small">岗位管理</el-button>
              <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
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
      </el-main>
    </el-container>

    <!-- 删除提示框 -->
    <el-dialog
      title="温馨提示"
      :visible.sync="centerDialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      width="30%"
      center
    >
      <div style="text-align: center;">
        <span>此操作将永久删除该部门，是否继续？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDeleteClick()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增/修改/查看部门信息提示框 -->
    <el-dialog
      v-if="dialogFormVisible"
      :title="currentTitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <div class="block zMark" v-if="!showCancel"></div>
      <el-form :model="deptForm" ref="deptForm" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="deptForm.name" style="width: 80%"></el-input>
        </el-form-item>
        <!-- <el-form-item label="上级部门" prop="parentName">
          <el-input v-model="deptForm.parentName" style="width: 80%"></el-input>
        </el-form-item>-->
        <el-form-item label="上级部门">
          <el-cascader v-model="deptForm.superior" v-if="!newPropsShow" :disabled="deptForm.id === 10000 ? true : false" :props="newProps" @change="changeOrganization" style="width: 80%"></el-cascader>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="deptForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="showCancel" type="primary" @click="roleClick()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { find, findAll, save, update, remove } from '@/api/org-dept'
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      newProps:{
       checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          let form = {
            parentId: null
          }
          if (node.data && node.data.id) form.parentId = node.data.id
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
      props: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          let form = {
            parentId: null
          }
          if (node.data && node.data.id) form.parentId = node.data.id
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
      push:false,
      newPropsShow:false,
      showCancel: false,
      currentTitle: '新增部门',
      // 部门基础属性
      defaultProps: {
        id: 'id',
        label: 'name',
        leaf: 'leaf',
        children: 'children'
      },
      // 自动展开所有部门
      defaultExpandAll: true,
      // 新增修改form
      deptForm: {},
      deptData: [],
      stationData: [],
      dialogFormVisible: false,
      temList: [],
      temIndex: null,
      centerDialogVisible: false,
      search: '',
      select: ''
    }
  },
  created() {
    this.findAll()
  },
  methods: {
    gotoJobManage(item) {
      this.$router.push('/jobsManager?id=' + item.id + '&name=' + item.name)
    },
    loadNode(node, resolve) {
      const _this = this
      // 加载一级部门
      if (node.level === 0) {
        _this.findParent(callBack => {
          resolve(callBack)
        })
        return
      }
      // 加载子部门
      if (node.data && node.data.id) {
        _this.findData(node.data.id, callBack => {
          resolve(callBack)
        })
      }
    },
    findParent(callBack) {
      //查询父数据
      let _this = this
      find().then(res => {
        if (res.body && res.body.length) {
          let dataArr = res.body.map(i => {
            i.statusFlag = i.status ? '启用' : '停用'
            return i
          })
          // _this.deptData = _this.deptData.concat(res.body)
        }
        callBack(res.body)
      })
    },
    findData(parentId, callBack) {
      //查询子数据
      const _this = this
      find({ parentId: parentId }).then(res => {
        if (res.body && res.body.length) {
          let dataArr = res.body.map(i => {
            i.statusFlag = i.status ? '启用' : '停用'
            return i
          })
          // _this.deptData = _this.deptData.concat(res.body)
        }
        callBack(res.body)
      })
    },
    handleNodeClick(treeData) {
      let _this = this
      // if (!treeData.parent) {
      //   this.findParent(callBack => {
      //     console.log(callBack)
      //     _this.deptData = callBack
      //   })
      //   return
      // }
      this.findData(treeData.id, callBack => {
        _this.deptData = callBack
      })
    },
    // 操作--查看
    handleClick(row) {
      this.deptForm = row
      this.newPropsShow = true
      setTimeout(()=>{
        this.newPropsShow = false
      })
      this.$nextTick(() => {
           this.dialogFormVisible = true
           this.showCancel = false
        this.currentTitle = '查看部门'
      })
    },
    // 操作--删除
    deleteClick(row) {
      const userName = row.name
      if (userName === '总公司') {
      }
      this.temList = row
      this.temIndex = row.id
      this.centerDialogVisible = true
    },
    // 操作--修改
    editorClick(row) {
      this.dialogFormVisible = true
      // if(row.qs){
      //   const newQs =  JSON.parse(`[${row.qs.replace(/\./g, ",")}]`)
      //   this.deptForm.qs = newQs.pop()
      // } else{
      //   this.deptForm.qs = []
      // }
        this.deptForm = row
        console.log(row)
      this.newPropsShow = true
      setTimeout(()=>{
        this.newPropsShow = false
      })
      this.showCancel = true
      this.$nextTick(() => {
        this.currentTitle = '修改部门'
      })



    },
    findAll(name = '', status = '') {
      //查询接口
      findAll({ name: name, status: status }).then(res => {
        if (res.body && res.body.length) {
          let dataArr = res.body.map(i => {
            i.statusFlag = i.status ? '启用' : '停用'
            return i
          })
        }
        this.deptData = res.body
      })
    },
    // 查询
    searchClick(search, select) {
      this.findAll(search, select ? Number(select) : '')
    },
    // 新建角色
    buildRoleClick() {
      this.$data.dialogFormVisible = true
      this.$nextTick(() => {
        this.currentTitle = '新建部门'
        this.deptForm = {
          status: 1,
          parentName: []
        }
        this.showCancel = true
      })
    },
    // 弹框---确定删除
    sureDeleteClick() {
      this.centerDialogVisible = false
      var _this = this
     this.findData(this.temList.id, callBack => {
       const callBackArr = callBack
        if(callBackArr.length){
            this.$message({
              type: 'error',
              message: '该部门下有下级部门，无法删除'
            })
        }else{
          remove(this.temList.id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            const newDeptData = []
            this.deptData.map(o => {
              if (o.id != this.temList.id) {
                newDeptData.push(o)
              }
            })
            this.push= true
            setTimeout(()=>{
            this.push= false
            })
            this.deptData = newDeptData
          })
        }
      })



    },
    // 角色弹框----(修改/查看/新建)确定
    roleClick() {
      // 修改
      let parmas
      if(!this.deptForm.superior || !this.deptForm.name){
          this.$message({
            message: '上级部门不能为空/部门名称',
            type: 'error',
            duration: 2000
          })
          return  
      }

      let parentLength = this.deptForm.superior.length
      if (this.deptForm.id) {
        parmas = {
          id: this.deptForm.id,
          description: '',
          grade: 0,
          leaf: true,
          name: this.deptForm.name,
          parent: this.deptForm.superior[parentLength - 1],
          status: this.deptForm.status
        }
        update(parmas).then(res => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 2000
          })
        this.push= true
        setTimeout(()=>{
         this.push= false
        })
          this.findAll()
        })
      } else {
        parmas = {
          description: '',
          grade: 0,
          leaf: true,
          name: this.deptForm.name,
          parent: this.deptForm.superior[parentLength - 1],
          status: this.deptForm.status
        }
        save(parmas).then(res => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 2000
          })
        this.push= true
        setTimeout(()=>{
         this.push= false
        })
          this.findAll()
        })
      }

      this.dialogFormVisible = false
    },
    changeOrganization() {
      // let index = 0
      // if (this.ruleForm.deptIdList && this.ruleForm.deptIdList.length)
      //   index = this.ruleForm.deptIdList.length - 1
      // if (!this.type) this.getFindStation(this.ruleForm.deptIdList[index])
    }
  }
}
</script>

<style lang="scss" scoped>
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
.rightRole {
  right: 20px;
}
.asideTree {
  font-size: 20px;
  background-color: #fff;
  display: block;
  margin: 0px 0 20px 0;
}
.el-aside {
  margin-top: 20px;
}
.el-dialog__body {
  position: relative;
  .zMark {
    position: absolute;
    z-index: 99;
    width: 92%;
    height: 54%;
  }
}
</style>
