<template>
  <div class="mContainer">
    <div class="mtools">
      <el-form label-width="90px" size="small" :inline="true">
        <m-cascader :companyId.sync="ledger.parms.companyId" :storeId.sync="ledger.parms.storeId"></m-cascader>
        <el-form-item label="台账类型">
          <el-select placeholder="请选择" v-model="ledger.parms.type">
            <el-option v-for="(item, i) in types" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台账编号">
          <el-input class="minput" v-model="ledger.parms.accountNo" placeholder="请输入台账编号"></el-input>
        </el-form-item>
        <el-form-item label="楼盘名称">
          <el-input class="minput" v-model="ledger.parms.buildingName" placeholder="请输入楼盘名称"></el-input>
        </el-form-item>
        <el-form-item label="店内编号">
          <el-input class="minput" v-model="ledger.parms.storeNo" placeholder="请输入店内编号"></el-input>
        </el-form-item>
        <el-form-item label="楼盘">
          <el-select placeholder="请选择" v-model="ledger.parms.buildingId">
            <el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼号">
          <el-select v-model="ledger.parms.edificeId" placeholder="请选择">
            <el-option v-for="(item, i) in edifices" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单元">
          <el-select v-model="ledger.parms.unitId" placeholder="请选择">
            <el-option v-for="(item, i) in units" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层">
          <el-select v-model="ledger.parms.flowerId" placeholder="请选择">
            <el-option v-for="(item, i) in flowers" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号">
          <el-select v-model="ledger.parms.familyId" placeholder="请选择">
            <el-option v-for="(item, i) in familys" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        <el-form-item label="房间号">
          <el-input class="minput" v-model="ledger.parms.roomName"></el-input>
        </el-form-item>
        </el-form-item>
        <el-form-item label="主经纪人">
          <el-input class="minput" placeholder="请输入主经纪人" v-model="ledger.parms.masterBroker"></el-input>
        </el-form-item>
        <el-form-item label="租赁方式">
          <el-select placeholder="请选择" v-model="ledger.parms.rentalWay">
            <el-option v-for="(item, i) in rentalWays" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门锁类型">
          <el-select placeholder="请选择" v-model="ledger.parms.lockType">
            <el-option v-for="(item, i) in lockTypes" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否停用">
          <el-radio-group v-model="ledger.parms.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="currentChange(1)">查 询</el-button>
          <el-button type="primary" @click="newLedger">新 增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <m-table
      :hasIndex="true"
      :data="ledger.list"
      :hasPaginationSizes="true"
      :setting="ledger.setting"
      :loading="ledger.loading"
      :total="ledger.total"
      :pageNum="ledger.page"
      :pageSize="ledger.rows"
      @currentChange="currentChange"
      @handleSizeChange="handleSizeChange"
    >
      <el-table-column label="操作" width="180px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="editLedger(scope.row)">修改</el-button>
          <el-button type="text" style="color: red" @click="toDelate(scope.row)">删除</el-button>
          <el-button type="text" @click="toDetail(scope.row)">房源规划</el-button>
        </template>
      </el-table-column>
    </m-table>
    <!-- 新建台账 -->
    <el-dialog
      width="745px"
      :title=" type === 1 ? '新增编号' : type === 2 ? '修改编号' : '查看编号'  "
      :visible.sync="dialogTableVisible"
      @close="close"
    >
      <el-form
        label-width="90px"
        size="small"
        :model="parms"
        ref="ruleForm"
        :inline="true"
        :rules="rules"
      >
        <h5>台账信息</h5>
        <el-form-item label="店内编号">
          <el-input class="minput" v-model="parms.storeNo" placeholder="请输入店内编号"></el-input>
        </el-form-item>
        <el-form-item label="台账类型">
          <el-select v-model="parms.type" placeholder="请选择">
            <el-option v-for="(item, i) in types" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否停用" prop="status">
          <el-radio-group v-model="parms.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <h5>楼盘信息</h5>
        <el-form-item label="区域">
          <el-cascader
            expand-trigger="hover"
            :options="areaDataList"
            v-model="area"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="楼盘名称">
          <el-select placeholder="请选择" v-model="parms.buildingId">
            <el-option v-for="(item, i) in buildings" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼号">
          <el-select v-model="parms.edificeId" placeholder="请选择">
            <el-option v-for="(item, i) in edifices2" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单元">
          <el-select v-model="parms.unitId" placeholder="请选择">
            <el-option v-for="(item, i) in units2" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层">
          <el-select v-model="parms.flowerId" placeholder="请选择">
            <el-option v-for="(item, i) in flowers2" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门牌号">
          <el-select v-model="parms.familyId" placeholder="请选择">
            <el-option v-for="(item, i) in familys2" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房源地址">
          <el-input v-model="parms.address" class="minput" :disabled="true"></el-input>
        </el-form-item>
        <br />

        <m-cascader :companyId.sync="parms.companyId" :storeId.sync="parms.storeId" @update:storeId="changeStore"></m-cascader>

        <el-form-item label="主经济人">
          <el-select v-model="parms.masterBroker" placeholder="请选择主经济人">
            <el-option v-for="(item, i) in masterBrokers" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="parms.description" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
        </el-form-item>
        <br />
        <el-form-item label="租赁方式">
          <el-select v-model="parms.rentalWay" placeholder="请选择">
            <el-option v-for="(item, i) in rentalWays" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门锁类型">
          <el-select v-model="parms.lockType" placeholder="请选择">
            <el-option v-for="(item, i) in lockTypes" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房源质量">
          <el-select v-model="parms.quality" placeholder="请选择">
            <el-option v-for="(item, i) in qualitys" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="toAdd">提 交</el-button>
        <el-button @click="dialogTableVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 房源规划 -->
    <el-dialog width="1024px" title="房源规划" :visible.sync="dialogTableVisible2">
      <el-button type="primary" size="small" @click="newHouse">新建房间</el-button>
      <el-table
        :data="resources.list"
        :span-method="objectSpanMethod"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="id" label="楼栋门牌" width="100"></el-table-column>
        <el-table-column prop="name" label="房间名称" width="180"></el-table-column>
        <el-table-column prop="area" label="单间面积m²" width="180">
          <template slot-scope="scope">
            <el-input v-if="scope.row.edit != 2" placeholder="请输入" v-model="scope.row.area"></el-input>
            <template v-else>{{scope.row.area}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="oriented" label="房间朝向" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.oriented" v-if="scope.row.edit != 2">
              <el-option
                v-for="item in cx"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <template v-else>{{scope.row.oriented | getStatusLabel(cx)}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="checkInDate" label="可入住时间" width="180">
          <template slot-scope="scope">
            <el-date-picker
              style="width: 160px"
              v-if="scope.row.edit != 2"
              v-model="scope.row.checkInDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
            <template v-else>{{scope.row.checkInDate}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="rentStatus" label="出租状态" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.rentStatus" v-if="scope.row.edit != 2">
              <el-option
                v-for="item in cz"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <template v-else>{{scope.row.rentStatus | getStatusLabel(cz)}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="lookDate" label="可看房时间" width="180">
          <template slot-scope="scope">
            <el-date-picker
              style="width: 160px"
              v-if="scope.row.edit != 2"
              v-model="scope.row.lookDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
            <template v-else>{{scope.row.lookDate}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="rentInfoId" label="租金信息" width="180">
          <template slot-scope="scope">
            <template v-if="scope.row.edit == 2">
              <el-button v-if="scope.row.rentInfoId" type="text" @click="toAddzj2(scope)">修改</el-button>
              <el-button v-if="scope.row.rentInfoId" type="text" @click="toAddzj3(scope)">详情</el-button>
            </template>
            <template v-else>
              <el-button v-if="scope.row.rentInfoId" type="text" @click="toAddzj2(scope)">修改</el-button>
              <el-button v-else type="text" @click="toAddzj(scope.$index)">添加</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="rentType" label="出租类型" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.rentType" v-if="scope.row.edit != 2">
              <el-option
                v-for="item in czs"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <template v-else>{{scope.row.rentType | getStatusLabel(czs)}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="roomType" label="房间类型" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.roomType" v-if="scope.row.edit != 2">
              <el-option
                v-for="item in fj"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <template v-else>{{scope.row.roomType | getStatusLabel(fj)}}</template>
          </template>
        </el-table-column>
        <el-table-column width="100px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.edit == 1" @click="tosave(scope)">保存</el-button>
            <el-button type="text" v-else-if="scope.row.edit == 2" @click="editLedger2(scope)">修改</el-button>
            <el-button type="text" v-else-if="scope.row.edit == 3" @click="tosave2(scope)">保存</el-button>
            <el-button type="text" style="color: red" @click="toDelate2(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog width="1200px" title="租金信息" :visible.sync="dialogTableVisible3">
      <el-form label-width="120px">
        <el-form-item label="租期范围：">
          <el-date-picker
            v-model="zjtime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="是否收中介费：">
          <el-radio-group v-model="zjparms.interFeeFlag">
            <el-radio :label="0">不收</el-radio>
            <el-radio :label="1">收</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="租金：">
          <el-table :data="resources2.list" border style="width: 100%; margin-top: 20px">
            <el-table-column prop="id" label="付款方式" width="180">
              <template slot-scope="scope">
                <el-select v-model="zjparms.paymentWay">
                  <el-option
                    v-for="item in fk"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="月租金" width="180">
              <template slot-scope="scope">
                <el-input v-model="zjparms.monthAmount"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="amount1" label="押金方式" width="180">
              <template slot-scope="scope">
                <el-select v-model="zjparms.depositWay">
                  <el-option
                    v-for="item in yjfs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="amount2" label="押金金额" width="180">
              <template slot-scope="scope">
                <el-input v-model="zjparms.depositAmount"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="amount3" label="服务/管理费收取方式" width="180">
              <template slot-scope="scope">
                <el-select v-model="zjparms.serviceWay">
                  <el-option
                    v-for="item in sqfs"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="amount3" label="服务/管理费收取比例" width="180">
              <template slot-scope="scope">
                <el-input v-model="zjparms.serviceRatio"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="amount3" label="服务/管理费金额" width="180">
              <template slot-scope="scope">
                <el-select v-model="zjparms.serviceAmount">
                  <el-option
                    v-for="item in glf"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="amount3" label="中介费" width="180">
              <template slot-scope="scope">
                <el-input v-model="zjparms.interAmount"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <el-button type="primary" v-if="zjparms.id" @click="updatePlanRent">保存</el-button>
      <el-button type="primary" v-else @click="savePlanRent">保存</el-button>
      <el-button style="color: red" @click="dialogTableVisible3 = false">取消</el-button>
      <el-button v-if="zjparms.id" class="remove" @click="removePlanRent" style="color: red">删除</el-button>
    </el-dialog>

    <el-dialog width="1200px" title="租金信息" :visible.sync="dialogTableVisible4">
      <el-form label-width="120px">
        <el-form-item label="租期范围：">{{zjparms.periodBegin}}至{{zjparms.periodEnd}}</el-form-item>
        <el-form-item label="是否收中介费：">{{zjparms.interFeeFlag ? '收' : '不收'}}</el-form-item>
        <el-form-item label="租金：">
          <el-table :data="resources2.list" border style="width: 100%; margin-top: 20px">
            <el-table-column prop="id" label="付款方式" width="180">
              <template slot-scope="scope">{{zjparms.paymentWay | getStatusLabel(fk)}}</template>
            </el-table-column>
            <el-table-column prop="name" label="月租金" width="180">
              <template slot-scope="scope">{{zjparms.monthAmount}}</template>
            </el-table-column>
            <el-table-column prop="amount1" label="押金方式" width="180">
              <template slot-scope="scope">{{zjparms.depositWay | getStatusLabel(yjfs)}}</template>
            </el-table-column>
            <el-table-column prop="amount2" label="押金金额" width="180">
              <template slot-scope="scope">{{zjparms.depositAmount}}</template>
            </el-table-column>
            <el-table-column prop="amount3" label="服务/管理费收取方式" width="180">
              <template slot-scope="scope">{{zjparms.serviceWay | getStatusLabel(sqfs)}}</template>
            </el-table-column>
            <el-table-column prop="amount3" label="服务/管理费收取比例" width="180">
              <template slot-scope="scope">{{zjparms.serviceRatio}}</template>
            </el-table-column>
            <el-table-column prop="amount3" label="服务/管理费金额" width="180">
              <template slot-scope="scope">{{zjparms.serviceAmount | getStatusLabel(glf)}}</template>
            </el-table-column>
            <el-table-column prop="amount3" label="中介费" width="180">
              <template slot-scope="scope">{{zjparms.interAmount}}</template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import MTable from "@/components/Table";
import MCascader from "@/components/department/mcascader";
import {
  getContractList,
  getContractListById,
  removeContract,
  saveContract,
  updateContract,
  getfindPlan,
  savePlan,
  updatePlan,
  removePlan,
  findPlanRent,
  savePlanRent,
  updatePlanRent,
  removePlanRent
} from "@/api/org-ledger";
import { findAll } from "@/api/org-dept";
import { findTrader } from "@/api/org-agencyContract";
import {
  regionFindAllTree,
  buildingFindAll,
  dictionaryFindEdifice,
  dictionaryFindUnit,
  dictionaryFindFlower,
  dictionaryFindFamily
} from "@/api/org-house";
let id = 0;
export default {
  components: {
    MTable,
    MCascader
  },
  filters: {
    getStatusLabel(val, arr) {
      let status = arr.find(item => item.value === val);
      return status ? status.label : "";
    }
  },
  data() {
    return {
      masterBrokers: [{name: ''}],
      ledger: {
        loading: false,
        list: [],
        setting: [
          {
            label: "公司",
            value: "companyName",
            formatter(row, column, cellValue, index) {
              return cellValue;
            }
          },
          {
            label: "台账编号",
            value: "accountNo"
          },
          {
            label: "店内编号",
            value: "storeNo"
          },
          {
            label: "门店",
            value: "storeName"
          },
          {
            label: "台账类型",
            value: "type",
            formatter(row, column, cellValue, index) {
              let types = [
                { name: "业主", id: 1 },
                { name: "代理", id: 2 },
                { name: "居间", id: 3 },
                { name: "买卖", id: 4 },
                { name: "其他", id: 5 },
                { name: "未知", id: 6 }
              ];
              let json = types.find(item => item.id == cellValue);
              return json ? json.name : cellValue;
            }
          },
          {
            label: "是否停用",
            value: "status",
            formatter(row, column, cellValue, index) {
              return cellValue === 1 ? "启用" : "停用";
            }
          },
          {
            label: "主经纪人",
            value: "masterBroker"
          },
          {
            label: "房源地址",
            value: "address"
          },
          {
            label: "创建时间",
            value: "createTime"
          },
          {
            label: "创建人",
            value: "createUser"
          },
          {
            label: "租凭方式",
            value: "rentalWay",
            formatter(row, column, cellValue, index) {
              let rentalWays = [
                { name: "整租", id: 1 },
                { name: "合租", id: 2 },
                { name: "未知", id: 3 }
              ];
              let json = rentalWays.find(item => item.id == cellValue);
              return json ? json.name : cellValue;
            }
          },
          {
            label: "门锁类型",
            value: "lockType",
            formatter(row, column, cellValue, index) {
              let lockTypes = [
                { name: "普通锁", id: 1 },
                { name: "智能锁", id: 2 },
                { name: "刷卡", id: 3 }
              ];
              let json = lockTypes.find(item => item.id == cellValue);
              return json ? json.name : cellValue;
            }
          },
          {
            label: "房源质量",
            value: "quality"
          },
          {
            label: "备注",
            value: "description",
            width: 300
          }
        ],
        parms: {
          companyId: "",
          storeId: "",
          type: "",
          accountNo: "",
          storeNo: "",
          buildingName: "",
          buildingId: "",
          edificeId: "",
          unitId: "",
          flowerId: "",
          familyId: "",
          roomName: "",
          masterBroker: "",
          rentalWay: "",
          lockType: "",
          status: 1
        },
        total: 10,
        page: 1,
        rows: 10
      },
      cx: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "1",
          label: "朝南"
        },
        {
          value: "2",
          label: "朝北"
        },
        {
          value: "3",
          label: "朝东"
        },
        {
          value: "4",
          label: "朝西"
        },
        {
          value: "5",
          label: "朝西南"
        },
        {
          value: "6",
          label: "朝西北"
        },
        {
          value: "7",
          label: "朝东南"
        },
        {
          value: "8",
          label: "朝东北"
        }
      ],
      cz: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "1",
          label: "待出租"
        },
        {
          value: "2",
          label: "已出租"
        },
        {
          value: "3",
          label: "待释放"
        }
      ],
      czs: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "1",
          label: "整租"
        },
        {
          value: "2",
          label: "合租"
        },
        {
          value: "3",
          label: "其他"
        }
      ],
      fj: [
        {
          value: "",
          label: "请选择"
        },
        {
          value: "1",
          label: "主卧"
        },
        {
          value: "2",
          label: "次卧"
        },
        {
          value: "3",
          label: "客厅改"
        },
        {
          value: "4",
          label: "卫生间改"
        },
        {
          value: "5",
          label: "厨房改"
        },
        {
          value: "6",
          label: "其他"
        }
      ],
      fk: [
        {
          value: "1",
          label: "月付"
        },
        {
          value: "2",
          label: "季付"
        },
        {
          value: "3",
          label: "半年付"
        },
        {
          value: "4",
          label: "年付"
        }
      ],
      yjfs: [
        {
          value: "1",
          label: "一个月"
        },
        {
          value: "2",
          label: "两个月"
        },
        {
          value: "3",
          label: "三个月"
        },
        {
          value: "4",
          label: "无需押金"
        }
      ],
      sqfs: [
        {
          value: "1",
          label: "按固定额度"
        },
        {
          value: "2",
          label: "无需费用"
        }
      ],
      glf: [
        {
          value: 0,
          label: "0"
        },
        {
          value: 500,
          label: "500"
        },
        {
          value: 1000,
          label: "1000"
        },
        {
          value: 1500,
          label: "1500"
        },
        {
          value: 2000,
          label: "2000"
        },
        {
          value: 2500,
          label: "2500"
        },
        {
          value: 3000,
          label: "3000"
        },
        {
          value: 3500,
          label: "3500"
        },
        {
          value: 4000,
          label: "4000"
        },
        {
          value: 4500,
          label: "4500"
        },
        {
          value: 5000,
          label: "5000"
        }
      ],
      resources: {
        loading: false,
        list: [],
        total: 10,
        page: 1,
        rows: 10,
        setting: [
          {
            label: "楼栋门牌",
            value: "",
            formatter(row, column, cellValue, index) {
              return "4号楼-2单元-201室";
            }
          },
          {
            label: "房间名称",
            value: "",
            formatter(row, column, cellValue, index) {
              return "A房间";
            }
          },
          {
            label: "单间面积m²",
            value: "",
            formatter(row, column, cellValue, index) {
              return "2";
            }
          },
          {
            label: "*房间朝向",
            value: "",
            formatter(row, column, cellValue, index) {
              return "2";
            }
          },
          {
            label: "房间类型",
            value: "",
            formatter(row, column, cellValue, index) {
              return "整租";
            }
          }
        ]
      },
      resources2: {
        list: [{}]
      },
      zjparms: {
        depositAmount: "",
        depositWay: "",
        id: "",
        interAmount: "",
        interFeeFlag: "",
        monthAmount: "",
        paymentWay: "",
        periodBegin: "",
        periodEnd: "",
        serviceAmount: "",
        serviceRatio: "",
        serviceWay: ""
      },
      zjtime: "",
      parms: {
        accountNo: "",
        address: "",
        buildingId: "",
        companyId: "",
        description: "",
        edificeId: "",
        familyId: "",
        flowerId: "",
        lockType: "",
        masterBroker: "",
        quality: "",
        rentalWay: "",
        slaveBroker: "",
        storeId: "",
        storeNo: "",
        status: 1,
        type: "",
        unitId: ""
      },
      companys: [{ name: "所有项", id: "" }],
      stores: [{ name: "所有项", id: "" }],
      stores2: [{ name: "所有项", id: "" }],
      buildings: [{ name: "所有项", id: "" , address: ""}],
      types: [
        { name: "所有项", id: "" },
        { name: "业主", id: "1" },
        { name: "代理", id: "2" },
        { name: "居间", id: "3" },
        { name: "买卖", id: "4" },
        { name: "其他", id: "5" },
        { name: "未知", id: "6" }
      ],
      rentalWays: [
        { name: "所有项", id: "" },
        { name: "整租", id: "1" },
        { name: "合租", id: "2" },
        { name: "未知", id: "3" }
      ],
      lockTypes: [
        { name: "所有项", id: "" },
        { name: "普通锁", id: "1" },
        { name: "智能锁", id: "2" },
        { name: "刷卡", id: "3" }
      ],
      qualitys: [
        { name: "所有项", id: "" },
        { name: "A", id: "A" },
        { name: "B", id: "B" },
        { name: "C", id: "C" },
        { name: "D", id: "D" }
      ],
      edifices: [{ name: "所有项", id: "" }],
      units: [{ name: "所有项", id: "" }],
      flowers: [{ name: "所有项", id: "" }],
      familys: [{ name: "所有项", id: "" }],
      edifices2: [{ name: "所有项", id: "" }],
      units2: [{ name: "所有项", id: "" }],
      flowers2: [{ name: "所有项", id: "" }],
      familys2: [{ name: "所有项", id: "" }],
      dialogTableVisible: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisible4: false,
      type: 1,
      rules: {
        accountNo: [
          { required: true, message: "请选择台账编号", trigger: "change" }
        ]
      },
      accountNo: "",
      zjindex: "",
      area: "",
      areaDataList: [],
      // storearr: ""
    };
  },
  watch: {
    area(val) {
      if (val) {
        this.buildingFind1(val[val.length - 1]);
      }
      this.ledger.parms.companyId = "";
    },
    // storearr(val) {
    //   this.ledger.parms.companyId = val[0];
    //   this.ledger.parms.storeId = val[2];
    // },
    "ledger.parms.buildingId"(val) {
      if (val) {
        this.findEdifice(val);
      } else {
        this.edifices = [{ name: "所有项", id: "" }];
      }
    },
    "ledger.parms.edificeId"(val) {
      if (val) {
        this.findUnit(val);
      } else {
        this.units = [{ name: "所有项", id: "" }];
      }
    },
    "ledger.parms.unitId"(val) {
      if (val) {
        this.findFlower(val);
      } else {
        this.flowers = [{ name: "所有项", id: "" }];
      }
    },
    "ledger.parms.flowerId"(val) {
      if (val) {
        this.findFamily(val);
      } else {
        this.familys = [{ name: "所有项", id: "" }];
      }
    },
    "parms.buildingId"(val) {
      if (val) {
        this.findEdifice(val, 2);
      } else {
        this.edifices2 = [{ name: "所有项", id: "" }];
      }
    },
    "parms.edificeId"(val) {
      if (val) {
        this.findUnit(val, 2);
      } else {
        this.units2 = [{ name: "所有项", id: "" }];
      }
    },
    "parms.unitId"(val) {
      if (val) {
        this.findFlower(val, 2);
      } else {
        this.flowers2 = [{ name: "所有项", id: "" }];
      }
    },
    "parms.flowerId"(val) {
      if (val) {
        this.findFamily(val, 2);
      } else {
        this.familys2 = [{ name: "所有项", id: "" }];
      }
    }
  },
  methods: {
    // 主副成交人
    getTrader(id) {
      //获取成交人
      findTrader(id).then(res => {
        this.masterBrokers = res.body.notLeave;
        this.parms.masterBroker = this.isInArray(this.masterBrokers, this.parms.masterBroker) === false ? '' : this.parms.masterBroker
      });
    },
    changeStore(val) {

      // console.log("val=======",val);
      
      if (val === '') {
        this.parms.masterBroker = ''
      }else {
        const arr = val.split('.')
        this.getTrader(arr[arr.length-1])
      }
    },
    buildingFind2() {
      regionFindAllTree().then(res => {
        const cityAllData = res.body;
        cityAllData.map(o => {
          o.value = o.id;
          o.label = o.name;
          if (!o.children) return;
          o.children.map(j => {
            j.value = j.id;
            j.label = j.name;
            if (!j.children) return;
            j.children.map(k => {
              k.value = k.id;
              k.label = k.name;
            });
          });
        });
        this.areaDataList = cityAllData;
      });
    },
    removePlanRent() {
      removePlanRent({ id: this.zjparms.id }).then(res => {
        let { code } = res;
        if (code == 1000) {
          this.$message({
            message: "删除成功！",
            type: "success"
          });
          this.dialogTableVisible3 = false;
        } else {
          this.$message({
            message: "删除失败！",
            type: "error"
          });
        }
      });
    },
    savePlanRent() {
      let [periodBegin, periodEnd] = this.zjtime;
      this.zjparms.periodBegin = periodBegin;
      this.zjparms.periodEnd = periodEnd;
      savePlanRent(this.zjparms).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.resources.list[this.zjindex].rentInfoId = body;
          this.$message({
            message: "新增成功！",
            type: "success"
          });
          this.dialogTableVisible3 = false;
        } else {
          this.$message({
            message: "新增失败！",
            type: "error"
          });
        }
        // console.log(res);
      });
    },
    updatePlanRent() {
      let [periodBegin, periodEnd] = this.zjtime;
      this.zjparms.periodBegin = periodBegin;
      this.zjparms.periodEnd = periodEnd;
      updatePlanRent(this.zjparms).then(res => {
        let { code } = res;
        if (code == 1000) {
          this.$message({
            message: "编辑成功！",
            type: "success"
          });
          this.dialogTableVisible3 = false;
        } else {
          this.$message({
            message: "编辑失败！",
            type: "error"
          });
        }
        // console.log(res);
      });
    },
    toAddzj(index) {
      // this.zjparms.id = id
      this.zjindex = index;
      this.zjparms = {};
      this.dialogTableVisible3 = true;
    },
    toAddzj2({ row, $index }) {
      // this.zjparms.id = id
      this.zjindex = $index;
      this.dialogTableVisible3 = true;
      this.zjparms = {};
      findPlanRent({ id: row.rentInfoId }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.zjparms = { ...body, interFeeFlag: body.interFeeFlag ? 1 : 0 };
          this.zjtime = [body.periodBegin, body.periodEnd];
        }
      });
    },
    toAddzj3({ row, $index }) {
      this.dialogTableVisible4 = true;
      this.zjparms = {};
      findPlanRent({ id: row.rentInfoId }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.zjparms = { ...body };
        }
      });
    },
    newHouse() {
      this.resources.list.push({
        accountNo: "",
        area: "",
        checkInDate: "",
        id: "",
        lookDate: "",
        name: "",
        oriented: "",
        rentInfoId: "",
        rentStatus: "",
        rentType: "",
        roomType: "",
        edit: 3
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let len = this.resources.list.length;
      if (columnIndex === 0) {
        if (rowIndex % len === 0) {
          return {
            rowspan: len,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 设置显示页数
    handleSizeChange(val) {
      this.currentChange(1, val)
    },
    /**
     * 获取分页数据
    */
    currentChange(val, totalNum) {
      if (val || val === 0) {
        this.ledger.page = val;
      }
      if (totalNum || totalNum === 0) {
        this.ledger.rows = totalNum;
      }
      let { page, rows, parms } = this.ledger;
      getContractList({ ...parms, page, rows }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (body.rows) {
            this.ledger.list = body.rows.map(item => {
              return {
                ...item,
                edit: false
              };
            });
            this.ledger.total = body.total;
            // console.log(this.ledger.total);
          } else {
            this.ledger.list = [];
          }
        }
      });
    },
    newLedger() {
      this.type = 1;
      this.$store.commit('EDITID', this.type)
      this.dialogTableVisible = true;
      this.parms = {
        accountNo: "",
        address: "",
        buildingId: "",
        companyId: "",
        description: "",
        edificeId: "",
        familyId: "",
        flowerId: "",
        lockType: "",
        masterBroker: "",
        quality: "",
        rentalWay: "",
        slaveBroker: "",
        storeId: "",
        storeNo: "",
        status: 1,
        type: "",
        unitId: ""
      };
    },
    editLedger({ accountNo }) {
      this.type = 2;
      this.$store.commit('EDITID', this.type)
      this.dialogTableVisible = true;
      getContractListById({ id: accountNo }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.parms = { ...body };
        }
      });
    },
    editLedger2({ $index }) {
      this.resources.list[$index].edit = 1;
    },
    tosave({ row, $index }) {
      this.resources.list[$index].edit = 2;
      updatePlan({ ...row, accountNo: this.accountNo }).then(res => {
        let { code } = res;
        if (code == 1000) {
          this.$message({
            message: "编辑成功！",
            type: "success"
          });
          this.toDetail({ accountNo: this.accountNo });
        } else {
          this.$message({
            message: "编辑失败！",
            type: "error"
          });
        }
      });
    },
    tosave2({ row, $index }) {
      this.resources.list[$index].edit = 2;
      let params = { ...row, accountNo: this.accountNo };
      // let {accountNo,area,area,id,lookDate,name,oriented,rentInfoId,rentStatus,rentType,roomType } = row
      savePlan(params).then(res => {
        let { code } = res;
        if (code == 1000) {
          this.$message({
            message: "新增成功！",
            type: "success"
          });
          this.toDetail({ accountNo: this.accountNo });
        } else {
          this.$message({
            message: "新增失败！",
            type: "error"
          });
        }
      });
    },
    toDetail({ accountNo }) {
      this.accountNo = accountNo;
      this.dialogTableVisible2 = true;
      getfindPlan({ accountNo }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.resources.list = body.map(item => ({ ...item, edit: 2 }));
        }
      });
    },
    toEnable() {
      this.$confirm("此操作将启用该台账, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "启用成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用"
          });
        });
    },
    handleSelectionChange(val) {},
    toStop() {
      this.$confirm("此操作将停用该台账, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "停用成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消停用"
          });
        });
    },
    toDelate({ id }) {
      this.$confirm("此操作将删除该台账, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeContract({ id: id }).then(res => {
            // console.log(res);
            let { code, body } = res;
            if (code == 1000) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.currentChange();
            } else {
              this.$message({
                type: "error",
                message: "删除失败!"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    toDelate2({ row, $index }) {
      let { id } = row;
      if (id || id === 0) {
        removePlan({ id }).then(res => {
          let { code } = res;
          if (code == 1000) {
            this.resources.list.splice($index, 1);
            this.$message({
              message: "删除成功！",
              type: "success"
            });
            this.toDetail({ accountNo: this.accountNo });
          } else {
            this.$message({
              message: "删除失败！",
              type: "error"
            });
          }
        });
      } else {
        this.$message({
          message: "删除成功！",
          type: "success"
        });
        this.resources.list.splice($index, 1);
      }
    },
    buildingFind1(regionQs = "") {
      buildingFindAll({ regionQs }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          // console.log("body=====",body)
          this.buildings = [
            { name: "所有项", id: "" },
            ...body.map(item => {
              return { ...item, id: Number(item.id), address: String(item.address) };
            })
          ];
        }
      });
    },
    close() {
      this.$refs.ruleForm.resetFields();
    },
    getStores(qs, type) {
      findAll({ qs }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (type === 2) {
            this.stores2 = [{ name: "所有项", id: "" }, ...body];
          } else {
            this.stores = [{ name: "所有项", id: "" }, ...body];
          }
        }
      });
    },
    // 查询楼盘地址
    recursion(data, id) {
      let result = '';
      if (!data) {
        return;
      }
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.id === id) {
          result = item.address;
          break;
        }
      }
      console.log(result);
      return result;
    },
    findEdifice(superiorId, type) {
      this.parms.address = this.recursion(this.buildings, superiorId);
      dictionaryFindEdifice({ superiorId, rows: 1000 }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (type === 2) {
            if (!body.rows.find(item => item.id == this.parms.edificeId)) {
              this.parms.edificeId = "";
            }
            this.edifices2 = [{ name: "所有项", id: "" }, ...body.rows];
          } else {
            if (
              !body.rows.find(item => item.id == this.ledger.parms.edificeId)
            ) {
              this.ledger.parms.edificeId = "";
            }
            this.edifices = [{ name: "所有项", id: "" }, ...body.rows];
          }
        }
      });
    },
    findUnit(superiorId, type) {
      dictionaryFindUnit({ superiorId, rows: 1000 }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (type === 2) {
            if (!body.rows.find(item => item.id == this.parms.unitId)) {
              this.parms.unitId = "";
            }
            this.units2 = [{ name: "所有项", id: "" }, ...body.rows];
          } else {
            if (!body.rows.find(item => item.id == this.ledger.parms.unitId)) {
              this.ledger.parms.unitId = "";
            }
            this.units = [{ name: "所有项", id: "" }, ...body.rows];
          }
        }
      });
    },
    findFlower(superiorId, type) {
      dictionaryFindFlower({ superiorId, rows: 1000 }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (type === 2) {
            if (!body.rows.find(item => item.id == this.parms.flowerId)) {
              this.parms.flowerId = "";
            }
            this.flowers2 = [{ name: "所有项", id: "" }, ...body.rows];
          } else {
            if (
              !body.rows.find(item => item.id == this.ledger.parms.flowerId)
            ) {
              this.ledger.parms.flowerId = "";
            }
            this.flowers = [{ name: "所有项", id: "" }, ...body.rows];
          }
        }
      });
    },
    findFamily(superiorId, type) {
      dictionaryFindFamily({ superiorId, rows: 1000 }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          if (type === 2) {
            if (!body.rows.find(item => item.id == this.parms.familyId)) {
              this.parms.familyId = "";
            }
            this.familys2 = [{ name: "所有项", id: "" }, ...body.rows];
          } else {
            if (
              !body.rows.find(item => item.id == this.ledger.parms.familyId)
            ) {
              this.ledger.parms.familyId = "";
            }
            this.familys = [{ name: "所有项", id: "" }, ...body.rows];
          }
        }
      });
    },
    toAdd() {
      this.$delete(this.parms, "companyName");
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let buildingName = this.buildings.find(item => item.id == this.parms.buildingId)
          let edificesName = this.edifices2.find(item => item.id == this.parms.edificeId)
          let unitName = this.units2.find(item => item.id == this.parms.unitId)
          let familyName = this.familys2.find(item => item.id == this.parms.familyId)          
          
          this.parms.address = ""
          this.parms.address = `${buildingName.name}-${edificesName.name}-${unitName.name}-${familyName.name}`

          if (this.type === 1) {
            this.$delete(this.parms, "accountNo");
            saveContract(this.parms).then(res => {
              let { code, msg } = res;
              if (code == 1000) {
                this.$message({
                  type: "success",
                  message: "新增成功!"
                });
                this.currentChange(1);
                this.dialogTableVisible = false;
              } else {
                this.$message({
                  type: "error",
                  message: msg ? msg : "新增失败!"
                });
              }
            });
          } else {
            let parms = { ...this.parms };
            this.$delete(parms, "createTime");
            this.$delete(parms, "createUser");
            updateContract(parms).then(res => {
              let { code, msg } = res;
              if (code == 1000) {
                this.$message({
                  type: "success",
                  message: "编辑成功!"
                });
                this.currentChange();
                this.dialogTableVisible = false;
              } else {
                this.$message({
                  type: "error",
                  message: msg ? msg : "编辑失败!"
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    isInArray (arr,value) {
      for(var i = 0; i < arr.length; i++){
        if(value === arr[i].name){
          return true;
        }
      }
      return false;
    }
  },
  mounted() {

    this.buildingFind2();
    this.buildingFind1();
    this.currentChange(1);
  }
};
</script>

<style scoped>
h5 {
  font-size: 16px;
  margin-bottom: 10px;
}
.remove {
  float: right;
}
</style>
