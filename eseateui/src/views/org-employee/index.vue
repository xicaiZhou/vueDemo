<template>
  <div>
    <el-form ref="form" :model="searchForm" label-width="90px" size="small" :inline="true">
      <el-form-item label="员工编号">
        <el-input v-model="searchForm.memberId"></el-input>
      </el-form-item>
      <el-form-item label="员工名称">
        <el-input v-model="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="searchForm.phoneNo"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="searchForm.email"></el-input>
      </el-form-item>
      <el-form-item label="是否在职">
        <el-select v-model="searchForm.leave" placeholder="请选择">
          <el-option label="全部" value></el-option>
          <el-option label="在职" :value="1"></el-option>
          <el-option label="离职" :value="0"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属部门">
        <el-cascader
          v-model="searchForm.deptQs"
          :props="props"
          :show-all-levels="false"
          change-on-select
          filterable
          @change="changeOrganization"
          style="width: 200px"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="入职时间">
        <el-col>
          <el-date-picker
            v-model="time"
            type="daterange"
            align="right"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width:222px"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item style="float:right;margin-right:150px">
        <el-button type="primary" @click="onSubmit()">查询</el-button>
        <el-button type="success" @click="buildUserClick(0)">新建员工</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border  max-height="500">
      <el-table-column label="序号" type="index" width="50" fixed> </el-table-column>
      <el-table-column prop="id" width="120" label="编号"></el-table-column>
      <el-table-column prop="name" width="120" label="员工姓名"></el-table-column>
      <el-table-column prop="identity" width="120" label="身份证号码"></el-table-column>
      <el-table-column prop="address" width="120" label="户口所在地"></el-table-column>
      <!-- <el-table-column prop="stationName" label="岗位名称"></el-table-column> -->
      <!-- <el-table-column prop="manageName" label="所属上级"></el-table-column> -->
      <el-table-column prop="deptName" width="120" label="部门"></el-table-column>
      <el-table-column prop="email" width="120" label="邮箱"></el-table-column>
      <el-table-column prop="phoneNo" width="120" label="手机号码"></el-table-column>
      <el-table-column prop="joinTime" width="120" label="入职时间"></el-table-column>
      <el-table-column prop="createTime" width="120" label="创建日期"></el-table-column>
      <el-table-column prop="leaveFlag" width="120" label="是否在职"></el-table-column>
      <el-table-column prop="statusFlag" width="120" label="状态"></el-table-column>
      <el-table-column prop="roleName" width="120" label="角色"></el-table-column>
      <el-table-column prop="createUser" width="120" label="创建人"></el-table-column>
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="scope" class="flex-center btn-style">
          <el-button @click="handeleClick(scope.$index, scope.row,1)" type="text" size="small">查看</el-button>
          <el-button
            v-if="managerChangePW"
            @click="deleteClick(scope.$index, scope.row)"
            type="text"
            size="small"
            style="color:red;"
          >删除</el-button>
          <el-button @click="handeleClick(scope.$index, scope.row,2)" type="text" size="small">修改</el-button>
          <el-button @click="changePWClick(scope.$index, scope.row)" type="text" size="small">更改密码</el-button>
          <el-button @click="managerChangePWClick(scope.$index, scope.row)" type="text" size="small" v-if="managerChangePW">重置员工密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      background 
      layout="total, prev, pager, next, sizes" 
      :total="total" 
      :page-size="pageSize" 
      :current-page="currentPage" 
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[10, 30, 60, 100]"
    ></el-pagination>

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
        <span>{{message}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="showCancel" @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDeleteClick(showCancel)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增/修改/查看 员工信息提示框 -->
    <el-dialog
      :title="currentroleType"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <span class="baseInfo">基础信息</span>
      <el-divider></el-divider>
      <div class="block zMark" v-if="type==1"></div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item v-if="type" label="编号" prop="id">
          <span>{{ruleForm.id}}</span>
        </el-form-item>
        <el-form-item label=" 账号" prop="username">
          <el-input
            :disabled="type==1?true:false"
            v-model="ruleForm.username"
            style="width: 200px;"
          ></el-input>
          <span class="beizhu">登录使用（唯一）</span>
        </el-form-item>
        <el-form-item v-if="!type" label="密码" prop="password">
          <el-input v-model="ruleForm.password" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="identity">
          <el-input v-model="ruleForm.identity" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="ruleForm.address" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNo">
          <el-input v-model="ruleForm.phoneNo" style="width: 200px;"></el-input>
        </el-form-item>

        <!-- 性别 -->
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="ruleForm.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 所属部门 -->
        <el-form-item label="所属部门">
          <el-cascader
            v-model="ruleForm.deptIdList"
            :props="props"
            :show-all-levels="false"
            filterable
            change-on-select
            @change="changeOrganization"
          ></el-cascader>
          <!-- <el-cascader :props="props" @change="changeOrganization"></el-cascader> -->
        </el-form-item>
        <!-- <el-form-item label="岗位名称">
          <el-select
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
          </el-select>
        </el-form-item> -->
        <!-- 所属上级 -->
        <!-- <el-form-item label="所属上级">
          <el-select
            :disabled="type==1?true:false"
            v-model="ruleForm.manageId"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.lableName"
              :value="Number(item.id)"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 是否离职 -->
        <el-form-item label="是否离职" prop="leave">
          <el-radio-group v-model="ruleForm.leave">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="limitsManager">权限</span>
        <el-divider></el-divider>
        <!-- 角色 -->
        <el-form-item label="角色：">
          <el-select
            multiple
            :disabled="type==1?true:false"
            v-model="ruleForm.roleList"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 角色权限 -->
        <!-- <el-form-item label="角色权限：">
          <el-tree
            :data="treeData"
            :show-checkbox="true"
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :default-checked-keys="dataArray"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogFormVisible = false" style="width: 150px;">取 消</el-button>
        <el-button type="primary" v-if="type!=1" @click="changeUserInfo('ruleForm')" style="width: 150px;">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 员工自己更改密码提示框 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogPWFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item v-if="!type" label="编号：" prop="id">
          <span>{{ruleForm.id}}</span>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="ruleForm.name" style="width: 80%;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="ruleForm.email" style="width: 80%;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phoneNo">
          <el-input v-model="ruleForm.phoneNo" style="width: 80%;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="旧密码：" prop="password">
          <el-input v-model="ruleForm.password" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogPWFormVisible = false" style="width: 150px;">取 消</el-button>
        <el-button type="primary" @click="changeRolePWClick(ruleForm)" style="width: 150px;">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 管理员更改员工密码提示框 -->
    <el-dialog
      title="修改员工密码"
      :visible.sync="dialogManagerPWFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="110px" class="demo-ruleForm">
        <el-form-item v-if="!type" label="编号：" prop="id">
          <span>{{ruleForm.id}}</span>
        </el-form-item>
        <el-form-item label="管理员密码：" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" style="width: 80%;"></el-input>
        </el-form-item>
        <el-form-item label="重置员工密码：" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogManagerPWFormVisible = false" style="width: 150px;">取 消</el-button>
        <el-button type="primary" @click="changeRoleManagerPWClick(ruleForm)" style="width: 150px;">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { KeyObject, fips } from 'crypto'
import moment from 'moment'

import {
  page,
  FindByName,
  EditUserInfo,
  AddUserInfo,
  DeleteUserInfo,
  EditUserPwd
} from '@/api/org-user'
import { find } from '@/api/org-dept'
import { FindStation } from '@/api/org-station'
import { AllMenu, FindByRole } from '@/api/org-menu'
import { AllRole } from '@/api/org-role'
import { type } from 'os'

let id = 10000

export default {

  data() {
    var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      }
      var idCard = (rule, cardNo, callback)=>{
        var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
        if(!idcardReg.test(cardNo)) {
           return callback(new Error('请输入正确的身份证号码'));
        }else{
          callback()
        }
      }
    return {
      rules: {
          username: [
            { required: true, message: '请输入唯一的账号信息', trigger: 'blur' }
          ],
          oldPassword: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 4, max: 18, message: '请输入长度在 4 到 18 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 4, max: 18, message: '请输入长度在 4 到 18 个字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请选择员工姓名', trigger: 'blur' }
          ],
          identity: [
            { required: true, validator: idCard,  trigger: 'blur,change' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          phoneNo: [
            { required: true, validator: checkPhone,  trigger: 'blur,change' }
          ]
      },
      props: {
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
      managerChangePW: false,
      restaurants: [],
      state: '',
      timeout: null,
      time: '',
      roleRestaurants: [],
      roleState: '',
      roleTimeout: null,
      dataArray: [],
      department: '',
      currentroleType: '',
      showCancel: false,
      message: '',
      select: '',
      dialogFormVisible: false,
      dialogPWFormVisible: false,
      dialogManagerPWFormVisible: false,
      ruleForm: {
        oldPassword: '',
        deptIdList: [],
        deptId: '',
        email: '',
        gender: null,
        id: '',
        manageId: '',
        manageName: '',
        name: '',
        identity: '',
        address: '',
        phoneNo: '',
        stationId: null,
        stationName: '',
        status: '1',
        username: '',
        roleList: [],
        leave: '',
        password: '',
        newPassword: ''
      },
      // treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      temList: [],
      temIndex: null,
      centerDialogVisible: false,
      input: '',
      searchForm: {
        memberId: '',
        name: '',
        phoneNo: '',
        email: '',
        leave: '',
        deptQs: '',
        beginJoinTime: '',
        endJoinTime: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      Organization: [],
      type: null,
      // options: [],
      stationOptions: [],
      roleList: []
    }
  },
  created() {
    const userInfo = this.$store.getters.userinfo
    if(userInfo.username == 'admin'){
      this.managerChangePW = true
    }
    this.onSubmit()
    // this.getAllMenu()
    this.getAllRole()
    // this.getFindByName()
  },
  watch: {
    time(val) {
      if (val !== null) {
        let [beginTime, endTime] = val;
        this.searchForm.beginJoinTime = moment(beginTime).format("YYYY-MM-DD");
        this.searchForm.endJoinTime = moment(endTime).format("YYYY-MM-DD");
      }else {
        this.searchForm.beginJoinTime = ""
        this.searchForm.endJoinTime = ""
      }
    }
  },
  methods: {
    // 删除用户
    doDeleteUserInfo(memberId) {
      DeleteUserInfo({ memberId })
        .then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.onSubmit()
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
    },
    changeUserInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          if (this.type == 2) this.doEditUserInfo()
          else this.doAddUserInfo()
          this.currentPage = 1
          this.onSubmit()

          } else {
            return false;
          }
        })
    },
    // 添加用户
    doAddUserInfo() {
      let companyId = 10000
      let storeId = ""
      if (this.ruleForm.deptIdList.length == 1) {
        // 总公司
        companyId = this.ruleForm.deptIdList[0]
        storeId = ""
      }else {
        // 分公司及其以下部门
        companyId = this.ruleForm.deptIdList[1]
        if (this.ruleForm.deptIdList.length == 2) {
          storeId = ""
        }else {
          storeId = (this.ruleForm.deptIdList[this.ruleForm.deptIdList.length-2] + '.' + this.ruleForm.deptIdList[this.ruleForm.deptIdList.length-1])
        }
      }
      let params = {
        email: this.ruleForm.email,
        gender: this.ruleForm.gender,
        leave: this.ruleForm.leave,
        managerId: this.ruleForm.manageId,
        name: this.ruleForm.name,
        address: this.ruleForm.address,
        identity: this.ruleForm.identity,
        password: this.ruleForm.password,
        phoneNo: this.ruleForm.phoneNo,
        roleList: this.ruleForm.roleList,
        stationId: this.ruleForm.stationId,
        status: this.ruleForm.status,
        username: this.ruleForm.username,
        deptIdList:this.ruleForm.deptIdList,
        deptId: this.ruleForm.deptIdList[this.ruleForm.deptIdList.length-1],
        companyId: companyId,
        storeId: storeId
      }
      AddUserInfo(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.dialogFormVisible = false
          this.onSubmit()
        })
        .catch(() => {
          this.$message.error(res.msg)
        })
    },
    doEditUserInfo() {
      let companyId = 10000
      let storeId = ""
      if (this.ruleForm.deptIdList.length == 1) {
        // 总公司
        companyId = this.ruleForm.deptIdList[0]
        storeId = ""
      }else {
        // 分公司及其以下部门
        companyId = this.ruleForm.deptIdList[1]
        if (this.ruleForm.deptIdList.length == 2) {
          storeId = ""
        }else {
          storeId = (this.ruleForm.deptIdList[this.ruleForm.deptIdList.length-2] + '.' + this.ruleForm.deptIdList[this.ruleForm.deptIdList.length-1])
        }
      }
      let params = {
        email: this.ruleForm.email,
        gender: this.ruleForm.gender,
        memberId: this.ruleForm.id,
        name: this.ruleForm.name,
        address: this.ruleForm.address,
        identity: this.ruleForm.identity,
        phoneNo: this.ruleForm.phoneNo,
        status: this.ruleForm.status,
        username: this.ruleForm.username,
        leave: this.ruleForm.leave,
        managerId: this.ruleForm.manageId,
        phoneNo: this.ruleForm.phoneNo,
        roleList: this.ruleForm.roleList,
        stationId: this.ruleForm.stationId,
        deptId: this.ruleForm.deptIdList[this.ruleForm.deptIdList.length-1],
        companyId: companyId,
        storeId: storeId
      }
      EditUserInfo(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.dialogFormVisible = false
          this.onSubmit()
        })
        .catch(() => {
          this.$message.error(res.msg)
        })
    },
    // 角色
    getAllRole(name = '', status = '') {
      AllRole({ name, status })
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
          console.log(e)
        })
    },
    changeOrganization() {
      let index = 0
      if (this.ruleForm.deptIdList && this.ruleForm.deptIdList.length)
        index = this.ruleForm.deptIdList.length - 1
      if (!this.type) this.getFindStation(this.ruleForm.deptIdList[index])
    },
    getFindStation(deptId) {
      FindStation({ deptId }).then(res => {
        if (res && res.body && res.body.length) {
          this.stationOptions = res.body
        } else {
          this.stationOptions = []
        }
      })
    },
    // getFindByName(name) {
    //   FindByName({ name }).then(res => {
    //     if (res && res.body && res.body.length) {
    //       res.body = res.body.map(i => {
    //         i.lableName = i.name + '(' + i.username + ')'
    //         return i
    //       })
    //       this.options = res.body
    //     }
    //   })
    // },
    // 根据角色查菜单
    // getFindByRole(id) {
      // FindByRole({ roleId: id }).then(res => {
      //   if (res && res.body && res.body.length) {
      //     res.body.map(i => {
      //       if (i.child && i.child.length) {
      //         i.child.map(j => {
      //           if (j.child && j.child.length) {
      //             j.child.map(n => {
      //               this.child.push(n.id)
      //               return n
      //             })
      //           } else {
      //             this.dataArray.push(j.id)
      //           }
      //           return j
      //         })
      //       } else {
      //         this.dataArray.push(i.id)
      //       }
      //       return i
      //     })
      //     if (this.dataArray)
      //       this.$nextTick(() => {
      //         this.$refs.tree.setCheckedKeys(this.dataArray)
      //       })
      //     else
      //       this.$nextTick(() => {
      //         this.$refs.tree.setCheckedKeys([])
      //       })
      //   }
      // })
    // },
    // 菜单
    // getAllMenu() {
    //   AllMenu().then(res => {
    //     if (res && res.body && res.body.length > 0) {
    //       this.treeData = res.body
    //     }
    //   })
    // },
    setCheckedKeys() {
      // 异步更新Dom
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.dataArray)
      })
    },
    // 操作----删除
    deleteClick(index, item) {
      this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          item.leave
            ? this.$message({
                type: 'info',
                message: '该员工还在职，不可删除'
              })
            : this.doDeleteUserInfo(item.id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 操作----查看\修改
    handeleClick(index, item, type) {
      this.type = type
      this.dialogFormVisible = true
      this.ruleForm = item
      this.dataArray = [11, 12]
      // item.deptIdList = item.deptList
      this.ruleForm.deptIdList = item.deptList
      this.currentroleType = type == 1 ? '查看员工' : '修改员工'
      // this.getFindByRole(item.stationId)
      this.getFindStation(item.deptId)

      // this.$nextTick(() => {
      //   this.$refs.tree.setCheckedKeys(this.dataArray)
      // })
    },
    // 操作----修改密码
    changePWClick(index, item) {
      this.ruleForm.newPassword = ''
      this.ruleForm = item
      this.dialogPWFormVisible = true
    },
    // 操作----管理员修改员工密码(只有管理员用户才能看到此按钮)
    managerChangePWClick(index, item) {
      this.dialogManagerPWFormVisible = true
      this.ruleForm = item
    },
    // 新建员工
    buildUserClick(type) {
      this.$nextTick(() => {
      this.dataArray = []
      this.ruleForm = {
        gender: 1,
        status: 1,
        leave: 1
      }
        this.type = type
        this.currentroleType = '新建员工'
        this.dialogFormVisible = true
        if (this.$refs['ruleForm']!==undefined) {
            this.$refs['ruleForm'].resetFields()
        }
      })
    },
    // 设置显示页数
    handleSizeChange(val) {
      this.currentPage = 1
      this.pageSize = val
      this.onSubmit()
    },
    // 查询
    onSubmit() {
      const {
        deptQs,
        email,
        leave,
        memberId,
        name,
        phoneNo,
        username,
        status
      } = this.searchForm
      
      const params = {
        beginJoinTime: this.searchForm.beginJoinTime,
        endJoinTime: this.searchForm.endJoinTime,
        deptQs: deptQs ? deptQs.join("."): "",
        email: email,
        leave: leave,
        memberId: memberId,
        name: name,
        page: this.currentPage ? this.currentPage : 1,
        phoneNo: phoneNo,
        rows: this.pageSize,
        status: status,
        username: username
      }
      page(params).then(res => {
        this.total = res.body.total
        let userData = res.body.rows
        userData.filter(user => {
          if (user.status === 0) {
            user.statusFlag = '停用'
          } else if (user.status === 1) {
            user.statusFlag = '启用'
          }
          if (user.leave) {
            user.leaveFlag = '在职'
          } else {
            user.leaveFlag = '离职'
          }
        })
        this.tableData = res.body.rows
      })
    },
    // 弹框---确定删除
    sureDeleteClick(showCancelBtn) {
      this.centerDialogVisible = false
      if (showCancelBtn) {
        this.temList.splice(this.temIndex, 1)
      }
    },
    // 弹框---确定管理员更改员工密码
    changeRoleManagerPWClick(obj) {
      this.dialogManagerPWFormVisible = false
      let params = {
        memberId: this.ruleForm.id,
        newPassword: this.ruleForm.newPassword,
        oldPassword: this.ruleForm.oldPassword
      }
      EditUserPwd(params)
        .then(res => {
          this.dialogPWFormVisible = false
          this.$message({
            type: 'success',
            message: '修改密码成功'
          })
        })
        .catch(() => {
          this.$message.error(res.msg)
        })
    },
    // 弹框---确定员工自己更改密码
    changeRolePWClick(obj) {
      let params = {
        memberId: this.ruleForm.id,
        newPassword: this.ruleForm.newPassword,
        oldPassword: this.ruleForm.password
      }
      EditUserPwd(params)
        .then(res => {
          this.dialogPWFormVisible = false
          this.$message({
            type: 'success',
            message: '修改密码成功'
          })
        })
        .catch(() => {
          this.$message.error(res.msg)
        })
    },
    handleCurrentChange(val) {
      //分页跳页查询
      this.currentPage = val
      this.onSubmit()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 12px;
}
// .el-input {
//   width: 200px;
// }
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.beizhu {
  // color: #888888;
  color: red;
}
.el-button--text {
  width: 40%;
}
.el-button + .el-button {
  margin-left: 0;
}
.el-dialog__body {
  position: relative;
  .zMark {
    position: absolute;
    z-index: 99;
    width: 92%;
    height: 78%;
  }
}
</style>