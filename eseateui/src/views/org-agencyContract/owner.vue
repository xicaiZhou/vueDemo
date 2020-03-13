<template>
  <el-dialog
    :title="type === 'add' ? '新建业主' : '修改业主'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="720px"
  >
    <el-form
      ref="addOwnerData"
      v-model="addOwnerData"
      :model="addOwnerData"
      :rules="rules"
      label-width="100px"
      size="small"
    >
      <el-form-item label="成交公司" prop="companyId">
        <el-select v-model="addOwnerData.companyId" placeholder="请选择">
          <el-option
            v-for="(item, index) in companys"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型">
        <el-select v-model="addOwnerData.type" placeholder="请选择">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户分类">
        <el-select v-model="addOwnerData.classification" placeholder="请选择">
          <el-option
            v-for="item in classifications"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="addOwnerData.name" class="minput"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="addOwnerData.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="民族">
        <el-input v-model="addOwnerData.nation" class="minput"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="identity">
        <el-input v-model="addOwnerData.identity" class="minput" maxlength="18"></el-input>
        <el-button type="primary" size="mini" @click="checkIdcard">查重</el-button>
      </el-form-item>
      <el-form-item label="手机" prop="phoneNo">
        <el-input v-model="addOwnerData.phoneNo" class="minput" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="telephone">
        <el-input v-model="addOwnerData.telephone" class="minput" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="addOwnerData.address" class="minput" style="width: 500px"></el-input>
      </el-form-item>
      <el-form-item label="开户银行">
        <el-input v-model="addOwnerData.bankName" class="minput"></el-input>
      </el-form-item>
      <el-form-item label="银行名称">
        <el-input v-model="addOwnerData.bankUserName" class="minput"></el-input>
      </el-form-item>
      <el-form-item label="银行卡号">
        <el-input v-model="addOwnerData.bankCardNo" class="minput"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="addOwnerData.description"
          type="textarea"
          :rows="5"
          size="small"
          style="width: 500px;"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="text-align: center">
      <el-button type="primary" size="mini" @click="onSubmit('addOwnerData')">确 定</el-button>
      <el-button size="mini" @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { findAll } from "@/api/org-dept";
import { createMember, findMemberPager, updateMemberPager } from "@/api/org-member";
import EventHub from "@/scripts/eventHub";

export default {
  props: {
    sure: {
      type: Function,
      default: () => () => {}
    },
    cancel: {
      type: Function,
      default: () => () => {}
    },
    type: {
      type: String,
      default: "add"
    }
  },
  data() {
    return {
      addOwnerData: {
        companyId: "",
        type: "", //客户分类
        classification: "", //客户类型
        name: "",
        gender: "",
        nation: "",
        identity: "",
        phoneNo: "",
        telephone: "",
        address: "",
        bankName: "",
        bankUserName: "",
        bankCardNo: "",
        description: ""
      },
      types: [{ value: 1, label: "业主" }, { value: 2, label: "客户" }],
      classifications: [
        { value: 1, label: "个人" },
        { value: 2, label: "单位" },
        { value: 3, label: "国外" }
      ],
      dialogVisible: false,
      companys: [],
      rules: {
        companyId: [
          { required: true, message: "请选择成交公司", trigger: "change" }
        ],
        name: [
          { required: true, message: "客户名称不能为空", trigger: "blur" }
        ],
        identity: [
          { required: true, message: "身份证不能为空", trigger: "blur" }
        ],
        phoneNo: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { pattern: /^1[34578]\d{9}$/, message: '手机号码格式不正确' }
        ],
        telephone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    findAll({ level: "2" }).then(res => {
      const { code, body } = res;
      if (code == 1000) {
        this.companys = body;
      }
    });
  },
  methods: {
    onSubmit(formName) {
      if (this.type === 'edit') {
        this.addOwnerData.id = this.addOwnerData.memberId
        delete this.addOwnerData.memberId;
        this.eaidSubmitForm();
      }else {
        // 新增
        Promise.all([this.checkIdcard(), new Promise(resolve => {
          this.$refs[formName].validate(valid => {
            if (valid) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })]).then(res => {
          if (!res[0] && res[1]) {
            this.dialogVisible = true;
            this.submitForm()
          }
        }).catch(err => {
          console.error(err)
        })
      }
    },
    // 新增
    submitForm(){
      createMember(this.addOwnerData).then(res => {
        const { code } = res;
        if (code == 1000) {
          this.$message({
            message: "新增业主成功",
            type: "success"
          });
          this.close();
          EventHub.$emit('changeChooseOwnerPage')
        } else {
          this.$message({
            message: '创建失败',
            type: "error"
          });
        }
      }).catch(err => {
        this.$message({
          message: err.message,
          type: "error"
        });
      });
    },
    // 修改
    eaidSubmitForm(){
      updateMemberPager(this.addOwnerData).then(res => {
        const { code } = res;
        if (code == 1000) {
          this.$message({
            message: "修改业主成功",
            type: "success"
          });
          this.close();
          EventHub.$emit('changeChooseOwnerPage')
        } else {
          this.$message({
            message: '修改失败',
            type: "error"
          });
        }
      }).catch(err => {
        this.$message({
          message: err.message,
          type: "error"
        });
      });
    },
    /**
     * 身份证查重，true：已存在，false不存在
     */
    checkIdcard() {
      const identity = this.addOwnerData.identity
      if (!identity) {
        return Promise.resolve(true)
      }
      return findMemberPager({ identity }).then(res => {
        const isExist = res.body.rows.length > 0
        if (isExist) {
          this.$message({
            type: "warning",
            message: "身份证号已存在!"
          })
        } 
        return isExist
      })
    },
    close() {
      this.dialogVisible = false;
    },
    show(ele) {
      if (ele !== undefined) {
        this.addOwnerData = ele;
      }else {
        this.addOwnerData = {}
      }
      this.dialogVisible = true;
    }
  }
};
</script>
