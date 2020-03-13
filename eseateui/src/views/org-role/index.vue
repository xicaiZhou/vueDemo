<template>
  <div style="margin-top: 15px;">
    <el-input placeholder="请输入角色名称/ID" v-model="search" class="input-with-select">
      <el-select v-model="select" slot="prepend" placeholder="请选择">
        <el-option label="全部" value=""></el-option>
        <el-option label="启用" :value="1"></el-option>
        <el-option label="停用" :value="0"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="searchClick(search, select)">查询</el-button>
    </el-input>
    <el-button class="rightRole" @click="buildRoleClick(0)" type="primary">新建角色</el-button>
    <!-- :data="roleList.filter(data => !search || data.number.includes(search) || data.name.toLowerCase().includes(search.toLowerCase()))" -->
    <el-table
      :data="roleList"
      stripe
      :header-cell-style="{'text-align': 'center'}"
      :cell-style="{'text-align': 'center'}"
      style="width: 100%"
    >
      <el-table-column prop="id" label="角色ID" width="180"></el-table-column>
      <el-table-column prop="name" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="text" label="状态" width="180"></el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.$index, scope.row,1)" type="text" size="small">查看</el-button>
          <el-button
            @click="deleteClick(scope.$index,scope.row)"
            type="text"
            size="small"
            style="color:red"
          >删除</el-button>
          <el-button @click="handleClick(scope.$index,scope.row,2)" type="text" size="small">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

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
        <span>此操作将永久删除该角色，是否继续？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDeleteClick()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增/修改用户信息提示框 -->
    <el-dialog
      :title="currentroleType"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="ruleForm.roleName" style="width: 200px;"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="角色权限：">
              <el-tree
                :data="ruleForm.treeData"
                :show-checkbox="true"
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current
                :default-checked-keys="dataArray"
                :props="ruleForm.defaultProps"
              ></el-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色审核权限: ">
              <el-checkbox-group v-model="ruleForm.type">
                <el-checkbox label="财务审核" name="type"></el-checkbox>
                <el-checkbox label="经纪人" name="type"></el-checkbox>
                <el-checkbox label="经理" name="type"></el-checkbox>
                <el-checkbox label="店长" name="type"></el-checkbox>
              </el-checkbox-group>

            </el-form-item>
          </el-col>
        </el-row>



        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启动</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogFormVisible = false" style="width: 150px;">取 消</el-button>
        <el-button v-if="type!=1" type="primary" @click="roleClick()" style="width: 150px;">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { AllRole, RemoveRole, EditRole, AddRole } from '@/api/org-role'
import { AllMenu, FindByRole } from '@/api/org-menu'
export default {
  data() {
    return {
      dataArray: [],
      currentroleType: '',
      ruleForm: {
        type: [],
        roleName: '',
        treeData: [],
        defaultProps: {
          children: 'child',
          label: 'name'
        },
        status: ''
      },
      dialogFormVisible: false,
      roleItem: {},
      centerDialogVisible: false,
      search: '',
      select: '',
      roleList: [],
      type: ''
    }
  },
  mounted() {
    this.getAllRole()
    this.getAllMenu()
  },
  methods: {
    // status 0禁用 1启用 -1删除
    // 根据角色查菜单
    getFindByRole(id) {
      FindByRole({ roleId: id }).then(res => {
        if (res && res.body && res.body.length) {
          res.body.map(i => {
            if (i.child && i.child.length) {
              i.child.map(j => {
                if (j.child && j.child.length) {
                  j.child.map(n => {
                    this.child.push(n.id)
                    return n
                  })
                } else {
                  this.dataArray.push(j.id)
                }
                return j
              })
            } else {
              this.dataArray.push(i.id)
            }
            return i
          })
          if (this.dataArray) this.setCheckedKeys()
          else
            this.$nextTick(() => {
              this.$refs.tree.setCheckedKeys([])
            })
        }
      })
    },
    // 角色
    getAllRole(name="",status="") {
      this.roleList = []
      AllRole({name,status})
        .then(res => {
          if (res && res.body && res.body.length > 0) {
            this.roleList = res.body
            this.roleList = this.roleList.map(i => {
              i.text = i.status ? '启用' : '禁用'
              return i
            })
          }
        })
        .catch(e => {
          this.$message.error('失败')
        })
    },
    // 菜单
    getAllMenu() {
      AllMenu().then(res => {
        if (res && res.body && res.body.length > 0) {
          this.ruleForm.treeData = res.body 
        }
      })
    },
    setCheckedKeys() {
      // 异步更新Dom
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.dataArray)
      })
    },
    // 操作--查看修改
    handleClick(index, item, type) {
      this.dataArray =[]
      this.$data.dialogFormVisible = true
      this.getFindByRole(item.id)
      this.type = type
      this.roleItem = item
      this.ruleForm.roleName = item.name
      this.ruleForm.status = item.status
      this.disposeJuris(item.permission,(callBack)=>{
        this.ruleForm.type = callBack
      })
      this.currentroleType = type == 1 ? '查看角色' : '修改角色'
    },
    // 操作--删除
    deleteClick(index, item) {
      this.roleItem = item
      this.centerDialogVisible = true
    },
    // 弹框---确定删除
    sureDeleteClick() {
      let form = {
        roleId: this.roleItem.id
      }
      RemoveRole(form)
        .then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getAllRole()
        })
        .catch(e => {
          this.$message.error('删除失败')
        })
      this.centerDialogVisible = false
    },
    /**
     * 角色审核权限
    */
    disposeJuris(typeList,callBack){
        let ruleFormType = []
        // console.log("原始数据 typeList ===",typeList);
        
        if (typeof typeList == "string" || typeof typeList == Object) {
          typeList = typeList.split(',')
          // console.log("改造后数据 typeList ===",typeList);
          typeList.map((o) =>{
            if (o == 1) {
              ruleFormType.push('财务审核')
            }else if (o == 2) {
              ruleFormType.push('经纪人')
            }else if (o == 3) {
              ruleFormType.push('经理')
            }else if (o == 4) {
              ruleFormType.push('店长')
            }
          })
          callBack(ruleFormType)
        }else {
          typeList.map((o) =>{
            if (o == '财务审核') {
              ruleFormType.push(1)
            }else if (o == '经纪人') {
              ruleFormType.push(2)
            }else if (o == '经理') {
              ruleFormType.push(3)
            }else if (o == '店长') {
              ruleFormType.push(4)
            }
          })
          callBack(ruleFormType.join(','))
        }
    },
    /**
     * 编辑
    */
    doEditRole() {
      if(this.ruleForm.type.length){
        this.disposeJuris(this.ruleForm.type,(call)=>{
          let form = {
            id: this.roleItem.id,
            status: this.ruleForm.status,
            menus: this.$refs.tree
              .getCheckedKeys()
              .concat(this.$refs.tree.getHalfCheckedKeys()),
            name: this.ruleForm.roleName,
            permission: call
          }
          EditRole(form)
            .then(() => {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.$router.push('/login')
              this.$data.dialogFormVisible = false
              this.getAllRole()

            })
            .catch(e => {
              this.$message.error('修改失败')
            })       
        })
      }else{
         this.$message.error('请先选择角色审核人')       
      }
    },
    // 查询
    searchClick(search, select) {
      this.getAllRole(search,select)
    },
    // 新建角色
    buildRoleClick(type) {
      this.dataArray = null
      this.$data.dialogFormVisible = true
      this.currentroleType = '新建角色'
      this.ruleForm.status = 1
      this.type = type
      this.ruleForm.roleName=''
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      })
    },
    /**
     * 添加
    */
    doAddRole() {
      if(this.ruleForm.type.length){
        this.disposeJuris(this.ruleForm.type,(call)=>{
            let form = {
              name: this.ruleForm.roleName,
              menus: this.$refs.tree
                .getCheckedKeys()
                .concat(this.$refs.tree.getHalfCheckedKeys()),
              status: this.ruleForm.status,
              permission: call
            }
            AddRole(form)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
                this.$data.dialogFormVisible = false
                this.getAllRole()
              })
              .catch(e => {
                this.$message.error('添加失败')
              })
        })
        }else{
          this.$message.error('请先选择角色审核人')       
        }

    },
    // 角色弹框----(修改/查看/新建)确定
    roleClick() {
      if (this.type) this.doEditRole()
      else this.doAddRole()
      
    },
    // 获取节点
    getCheckedKeys() {
      this.$nextTick(() => {
        this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys())
        // this.$refs.tree.getCheckedKeys()
      })
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
  width: 70%;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.rightRole {
  right: 20px;
}
</style>
