<!--变更合同-->
<template>
  <div>
    <el-dialog
      title="变更合同"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1000px"
    >
      <el-form label-width="100px" size="small" :inline="true" ref="form">
        <el-form-item label="合同编号：">
          <el-input class="minput" :disabled="true" v-model="info.agencyNo" style="width: 260px"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="合同地址：">
          <el-input class="minput" :disabled="true" v-model="info.address" style="width: 510px"></el-input>
        </el-form-item>
        <br />
        <br />
        <el-form-item label="主成交人：">
          <el-input class="minput" :value="masterDealer.name"></el-input>
          <el-button type="primary" size="mini" @click="showChooseMasterTrader">选择</el-button>
        </el-form-item>
        <br />
        <el-form-item label="副成交人：">
          <el-input class="minput" :value="slaveDealer.name"></el-input>
          <el-button type="primary" size="mini" @click="showChooseTrader">选择</el-button>
        </el-form-item>
        <br />
        <br />
        <el-form-item label="台账编号：">
          <el-input class="minput" :value="info.accountNo" style="width: 260px"></el-input>
          <el-button type="primary" size="mini" @click="showChooseLedger">选择</el-button>
        </el-form-item>
        <br />
        <el-form-item label="台账地址：">
          <el-input class="minput" :value="info.address" :disabled="true" style="width: 510px"></el-input>
        </el-form-item>
        <br />
        <br />
        <el-form-item label="业主编号：">
          <el-input class="minput" :value="memberInfo.memberId"></el-input>
          <el-button type="primary" size="mini" @click="showChooseOwner">选择</el-button>
        </el-form-item>
        <br />
        <el-form-item label="业主姓名：">
          <el-input class="minput" :value="memberInfo.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input class="minput" :value="memberInfo.identity" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input class="minput" :value="memberInfo.phoneNo" :disabled="true"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="开户支行：">
          <el-input class="minput" :value="memberInfo.bankName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账户名称：">
          <el-input class="minput" :value="memberInfo.bankUserName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号：">
          <el-input class="minput" :value="memberInfo.bankCardNo" :disabled="true"></el-input>
        </el-form-item>
        <br />
        <br />
        <el-form-item label="是否续签：">
          <el-radio-group v-model="info.signType">
            <el-radio :label="1">续签</el-radio>
            <el-radio :label="0">新签</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button size="mini" type="primary" @click="submitForm">保 存</el-button>
        <el-button size="mini" @click="close">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 选择台账 -->
    <ledger ref="ledger" @sureSelect="sureSelectedLedger"></ledger>
    <!-- 选择台账END -->

    <!-- 选择业主 -->
    <choose-owner ref="chooseOwner" @sureSelect="sureSelectedOwner"></choose-owner>
    <!-- 选择业主END -->

    <!-- 主/副成交人 -->
    <trader ref="trader" @choose="chooseTrader"></trader>
    <!-- 主/副成交人 -->
  </div>
</template>
<script >
import Ledger from "./ledger";
import Owner from "./owner";
import ChooseOwner from "./chooseOwner";
import Trader from "./trader"; //主副成交人
import { changeAgency, getContractDetail } from "@/api/org-agencyContract";

export default {
  props: {
    id: {
      type: Number | String
    }
  },
  components: { Ledger, Owner, ChooseOwner, Trader },
  data() {
    return {
      dialogVisible: false,
      ledger: {},
      owner: {},
      info: {
        accountNo: "",
        agencyId: "",
        address: "",
        agencyNo: "", //合同编号
        signType: ""
      },
      memberInfo: {
        memberId: "",
        name: "",
        phoneNo: "",
        identity: "",
        bankName: "",
        bankUserName: "",
        bankCardNo: ""
      }, // 业主
      activeCjr: "masterDealer", // 当前待选择成交人， masterDealer：主成交人， slaveDealer: 副成交人
      masterDealer: {
        name: ""
      }, // 选择的主成交人
      slaveDealer: {
        name: ""
      } // 选择的副成交人
    };
  },
  created() {
    this.getData();
  },
  computed: {
    form() {
      return {
        accountNo: this.info.accountNo,
        agencyId: this.info.agencyId,
        masterDealer: this.masterDealer.name + "", // 主成交人
        slaveDealer: this.slaveDealer.name + "", // 副成交人
        memberId: this.memberInfo.memberId,
        memberName: this.memberInfo.memberName,
        signType: this.info.signType
      };
    }
  },
  methods: {
    getData() {
      getContractDetail(this.id).then(res => {
        this.info = { ...this.info, ...res.body };
        this.memberInfo = { ...res.body.memberInfo };
        this.masterDealer.name = res.body.masterDealer;
        this.slaveDealer.name =
          res.body.slaveDealer === "undefined" ? "" : res.body.slaveDealer;
      });
    },
    //台账显示
    showChooseLedger() {
      this.$refs.ledger.show();
    },
    //业主显示
    showChooseOwner() {
      this.$refs.chooseOwner.show();
    },
    //选择副成交人
    showChooseTrader() {
      this.activeCjr = "slaveDealer";
      this.$refs.trader.show();
    },
    //选择主成交人
    showChooseMasterTrader() {
      this.activeCjr = "masterDealer";
      this.$refs.trader.show();
    },
    show() {
      this.dialogVisible = true;
    },
    close() {
      // this.dialogVisible = false;
      this.$emit("close");
    },
    // 选择台账
    sureSelectedLedger(ledger) {
      this.info.accountNo = ledger.accountNo;
      this.info.address = ledger.address;
      this.masterDealer.name = ledger.masterBroker; // 主成交人
      this.slaveBroker.name = ledger.slaveBroker; // 副成交人
    },
    // chooseOwner选择业主
    sureSelectedOwner(owner) {
      this.owner = owner;
      this.memberInfo.memberId = owner.memberId;
      this.memberInfo.name = owner.name;
      this.memberInfo.identity = owner.identity;
      this.memberInfo.phoneNo = owner.phoneNo;
      this.memberInfo.bankName = owner.bankName;
      this.memberInfo.bankUserName = owner.bankUserName;
      this.memberInfo.bankCardNo = owner.bankCardNo;
    },
    submitForm() {
      changeAgency(this.form).then(res => {
        const { code } = res;
        if (code == 1000) {
          this.$message({
            message: "变更成功",
            type: "success"
          });
          this.$emit("update");
          this.close();
        } else {
          this.$message({
            message: "创建失败",
            type: "error"
          });
        }
      });
    },
    // 选择主/副成交人
    chooseTrader(data = {}) {
      this[this.activeCjr] = data;
    }
  }
};
</script>
