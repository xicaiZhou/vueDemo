<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="80px" size="small" :inline="true">
      <el-form-item label="用户昵称">
        <el-input v-model="sizeForm.nickName" placeholder="请输入昵称/ID" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="sizeForm.userName" placeholder="请输入姓名/ID" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model="sizeForm.phoneNum" placeholder="请输入手机号码" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model="sizeForm.idCard" placeholder="请输入身份证号码" style="width: 200px;"></el-input>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-col>
          <el-date-picker
            v-model="sizeForm.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">查询</el-button>
        <el-button type="success" @click="buildUserClick()">新建用户</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%" height="100%">
      <el-table-column prop="number" width="100" label="编号"></el-table-column>
      <el-table-column prop="nickName" width="100" label="用户昵称"></el-table-column>
      <el-table-column prop="userName" width="100" label="姓名"></el-table-column>
      <el-table-column prop="sex" width="100" label="性别"></el-table-column>
      <el-table-column prop="idCard" label="身份证号码" width="170px"></el-table-column>
      <el-table-column prop="phoneNum" label="联系电话" width="135px"></el-table-column>
      <el-table-column prop="openBankName" label="开户银行"></el-table-column>
      <el-table-column prop="accName" label="账号名称"></el-table-column>
      <el-table-column prop="bankNum" label="银行卡号" width="150px"></el-table-column>
      <el-table-column prop="weixinNum" label="微信账号" width="150px"></el-table-column>
      <el-table-column prop="alipayNum" label="支付宝账号" width="130px"></el-table-column>
      <el-table-column prop="origin" label="来源"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="105px"></el-table-column>
      <el-table-column prop="createPeople" label="创建人"></el-table-column>
      <el-table-column label="操作" width="110px" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="deleteClick(scope.$index, tableData)"
            type="text"
            size="small"
            style="color:red;"
          >删除</el-button>
          <el-button @click="editorClick(scope.$index, tableData)" type="text" size="small">修改</el-button>
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
        <span>您确定要删除该条数据吗？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureDeleteClick()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增/修改用户信息提示框 -->
    <el-dialog
      title="基础信息"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="编号：" prop="number">
          <span>{{ruleForm.number}}</span>
          <!-- <el-input v-model="ruleForm.number" style="width: 200px;"></el-input> -->
        </el-form-item>
        <el-form-item label="昵称：" prop="nickName">
          <el-input v-model="ruleForm.nickName" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="userName">
          <el-input v-model="ruleForm.userName" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phoneNum">
          <el-input v-model="ruleForm.phoneNum" style="width: 200px;"></el-input>
          <el-button
            type="primary"
            @click="serchClick(`${ruleForm.phoneNum}`)"
            style="width: 100px;"
          >查 询</el-button>
          <br />
          <span class="beizhu">注：相同的手机号只能创建一次</span>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号码：" prop="idCard">
          <el-input v-model="ruleForm.idCard" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：" prop="openBankName">
          <el-input v-model="ruleForm.openBankName" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：" prop="bankNum">
          <el-input v-model="ruleForm.bankNum" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="dialogFormVisible = false" style="width: 150px;">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false" style="width: 150px;">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { KeyObject } from 'crypto'
export default {
  data() {
    return {
      dialogFormVisible: false,
      ruleForm: {
        number: '',
        nickName: '',
        userName: '',
        phoneNum: '',
        sex: '',
        idCard: '',
        openBankName: '',
        bankNum: '',
        desc: ''
      },
      temList: [],
      temIndex: null,
      centerDialogVisible: false,
      input: '',
      sizeForm: {
        nickName: '',
        userName: '',
        phoneNum: '',
        idCard: '',
        date: ''
      },
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
      tableData: [
        {
          number: '100201',
          nickName: '王小虎',
          userName: '陈曦',
          sex: '女',
          idCard: '391231199008198970',
          phoneNum: 18973219931,
          openBankName: '招商银行',
          accName: '陈曦',
          bankNum: 12312312312313,
          weixinNum: 23131313,
          alipayNum: 8789931723,
          origin: 'App注册',
          status: '注册',
          createDate: '2019-09-09',
          createPeople: '陈曦'
        },
        {
          number: '100202',
          nickName: '小老虎',
          userName: '陈曦',
          sex: '男',
          idCard: '391231199008198970',
          phoneNum: 18973219931,
          openBankName: '招商银行',
          accName: '陈曦',
          bankNum: 12312312312313,
          weixinNum: 23131313,
          alipayNum: 8789931723,
          origin: 'App注册',
          status: '注册',
          createDate: '2019-09-09',
          createPeople: '陈曦'
        }
      ]
    }
  },
  methods: {
    // 删除
    deleteClick(index, rows) {
      // rows.splice(index, 1);
      this.temList = rows
      this.temIndex = index
      this.centerDialogVisible = true
    },
    // 修改
    editorClick(index, rows) {
      console.log(rows[index])
      this.$data.dialogFormVisible = true
      this.$data.ruleForm = rows[index]
    },
    // 新建用户
    buildUserClick() {
      this.$data.dialogFormVisible = true
      this.$data.ruleForm = {}
    },
    // 查询
    onSubmit() {
      console.log('submit!')
    },
    // 根据手机号码查询
    serchClick(num) {
      console.log(num)
    },
    // 确定删除
    sureDeleteClick() {
      this.centerDialogVisible = false
      this.temList.splice(this.temIndex, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 12px;
}
.el-input {
  width: 200px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.beizhu {
  color: #888888;
}
</style>