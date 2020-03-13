<template>
  <div>
    <el-form ref="form" :model="searchHouseDictForm" label-width="90px" size="small" :inline="true">
      <el-form-item label="区域：">
          <el-cascader
            :options="areaDataList"
            v-model="searchHouseDictForm.area"
            change-on-select
          ></el-cascader>
      </el-form-item>
      <el-form-item label="楼盘名称：">

      <el-autocomplete
        :disabled="(!searchHouseDictForm.area)?true:false"
        v-model="searchHouseDictForm.houseName"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入楼盘名称查询"
        @select="handleSelect"
      ></el-autocomplete>
        <!-- <el-input placeholder="请输入楼盘名称查询" v-model="searchHouseDictForm.houseName" @focus="checkSelect"  :disabled="(!searchHouseDictForm.area)?true:false" style="width: 150px;"></el-input> -->

      </el-form-item>
      <!-- <el-button @click="houseDictQueryClick(searchHouseDictForm)" type="primary" size="small">查询</el-button> -->
      <!-- <el-button @click="reset()" type="primary" size="small">重置</el-button> -->
    </el-form>
    <el-divider></el-divider>
    <el-row :gutter="24">
      <!-- 楼号信息 -->
      <el-col :span="8">
        <div class="grid-content bg-purple">楼号信息</div>
        <div>
          <el-row class="oper-grid" type="flex" justify="space-around">
            <el-col :span="20">
              <el-button type="primary" size="small" @click="buildNo(1)">新增</el-button>
              <!-- <el-button type="primary" size="small" @click="buildNo(2)">修改</el-button> -->
              <el-button type="primary" size="small"  @click="refresh(1)">刷新</el-button>
            </el-col>
          </el-row>
        </div>
        <!-- :data="areaData.filter(data => !searchForm.searchArea || data.area.toLowerCase().includes(searchForm.searchArea.toLowerCase()) || data.pinyin.toLowerCase().includes(searchForm.searchArea.toLowerCase()))" -->
        <el-table
          :data="areaDataBuilding"
          ref="singleTable"
          highlight-current-row
          @current-change="handleCurrentChangeBuild1"
          height="300"
          border
        >
          <el-table-column prop="name" label="楼号"></el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope" class="flex-center btn-style">
              <el-button type="primary" size="small" @click="buildNo(2,scope.row)">新增单元</el-button>
              <el-button type="text" size="small" @click="elementNo(1,scope.row)">修改</el-button>
              <el-button
                @click="deleteClick(1, scope.row)"
                type="text"
                size="small"
                style="color:red;"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage1"
          @current-change="handleCurrentChange1"
          layout="prev, pager, next"
          :page-size="10"
          :total="total1"
        ></el-pagination>
      </el-col>
      <!-- 单元信息 -->
      <el-col :span="8">
        <div class="grid-content bg-purple">单元信息</div>
        <div>
          <el-row class="oper-grid" type="flex" justify="space-around">
            <el-col :span="20">
              <!-- <el-button type="primary" size="small" @click="buildNo(2)">新增</el-button> -->
              <!-- <el-button type="primary" size="small"  @click="elementNo(2)">修改</el-button> -->
              <!-- <el-button type="primary" size="small" @click="refresh(2)">刷新</el-button> -->
            </el-col>
          </el-row>
        </div>
        <el-table
          :data="areaDataCell"
          ref="singleAreaTable"
          highlight-current-row
          @current-change="handleCurrentChangeBuild2"
          height="300"
          border
        >
          <el-table-column prop="name" label="单元"></el-table-column>
          <el-table-column prop="totalFlower" label="总层数"></el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope" class="flex-center btn-style">
              <el-button type="primary" size="small" @click="buildNo(3, scope.row)">新增楼层</el-button>
              <el-button type="text" size="small" @click="elementNo(2, scope.row)">修改</el-button>
              <el-button
                @click="deleteClick(2, scope.row)"
                type="text"
                size="small"
                style="color:red;"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage2"
          @current-change="handleCurrentChange2"
          layout="prev, pager, next"
          :page-size="10"
          :total="total2"
        ></el-pagination>
      </el-col>
      <!-- 楼层信息 -->
      <el-col :span="8">
        <div class="grid-content bg-purple">楼层信息</div>
        <div>
          <el-row class="oper-grid" type="flex" justify="space-around">
            <el-col :span="20">
              <!-- <el-button type="primary" size="small" @click="buildNo(3)">新增</el-button> -->
              <!-- <el-button type="primary" size="small">修改</el-button> -->
              <!-- <el-button type="primary" size="small" @click="refresh(3)">刷新</el-button> -->
            </el-col>
          </el-row>
        </div>
        <el-table
          :data="areaDataFloor"
          ref="singleFloorTable"
          highlight-current-row
          @current-change="handleCurrentChangeBuild3"
          height="300"
          border
        >
          <el-table-column prop="name" label="楼层"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope" class="flex-center btn-style">
              <el-button type="primary" size="small" @click="buildNo(4, scope.row)">新增门牌号</el-button>
              <el-button type="text" size="small" @click="elementNo(3, scope.row)">修改</el-button>
              <el-button
                @click="deleteClick(3, scope.row)"
                type="text"
                size="small"
                style="color:red;"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage3"
          @current-change="handleCurrentChange3"
          layout="prev, pager, next"
          :page-size="10"
          :total="total3"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <!-- 门牌号信息 -->
      <el-col :span="24">
        <div class="grid-content bg-purple">门牌号信息</div>
        <div>
          <el-row class="oper-grid" type="flex" justify="space-around">
            <el-col :span="20">
              <!-- <el-button type="primary" size="small" @click="buildNo(4)">新增</el-button> -->
              <!-- <el-button type="primary" size="small">修改</el-button> -->
              <!-- <el-button type="primary" size="small" @click="refresh(4)">刷新</el-button> -->
            </el-col>
          </el-row>
        </div>
        <el-table
          :data="areaDataHouse"
          highlight-current-row
          ref="singleHouseTable"
          height="300"
          border
        >
          <el-table-column prop="name" width="100" label="门牌号"></el-table-column>
          <el-table-column prop="room" width="100"  label="室"></el-table-column>
          <el-table-column prop="hall" width="100" label="厅"></el-table-column>
          <el-table-column prop="bathroom" width="100" label="卫"></el-table-column>
          <el-table-column prop="kitchen" width="100" label="厨房"></el-table-column>
          <el-table-column prop="balcony" width="100" label="阳台"></el-table-column>
          <el-table-column prop="orientedName" width="100" label="朝向"></el-table-column>
          <el-table-column prop="area" width="100" label="面积"></el-table-column>
          <el-table-column prop="useArea" width="100" label="使用面积"></el-table-column>
          <el-table-column prop="applyName" width="100" label="用途"></el-table-column>
          <el-table-column prop="propertyName" width="100" label="产权"></el-table-column>
          <el-table-column label="操作" width="120px" fixed="right">
            <template slot-scope="scope" class="flex-center btn-style">
              <el-button type="text" size="small" @click="elementNo(4, scope.row)">修改</el-button>
              <el-button
                @click="deleteClick(4, scope.row)"
                type="text"
                size="small"
                style="color:red;"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="currentPage4"
          @current-change="handleCurrentChange4"
          layout="prev, pager, next"
          :page-size="10"
          :total="total4"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      :title="diaHouseNo"
      width="500px"
      :center="true"
      :visible.sync="dialogHouseNoVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <el-form :model="doorplateData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="楼盘：" prop="houses" >
          <el-cascader
            placeholder="请选择楼盘"
            disabled
            :options="housesList"
            v-model="doorplateData.houses"
            style="width: 300px;"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="楼盘：" prop="houses" v-show="!houseNameHave">
          <el-input
            v-model="doorplateData.housesl"
            placeholder="请选择楼盘1"
             disabled
          ></el-input>
        </el-form-item> -->
        <el-form-item label="楼号：" prop="build">
          <el-input
            v-model="doorplateData.build"
            placeholder="请输入楼号"
            :disabled="(type==1) ? false:true"
          ></el-input>
        </el-form-item>
        <el-form-item label="单元：" prop="element" v-if="type>1">
          <el-input
            v-model="doorplateData.element"
            placeholder="请输入单元号，若独栋请输入0"
            :disabled="(type==2) ? false:true"
          ></el-input>
        </el-form-item>
        <el-form-item label="总层数：" prop="pliesCount" v-if="type==2">
          <el-input v-model="doorplateData.pliesCount" placeholder="请输入总层数"></el-input>
        </el-form-item>
        <el-form-item label="楼层：" prop="plies" v-if="type>2">
          <el-input
            v-model="doorplateData.plies"
            placeholder="请输入楼层号"
            :disabled="(type==3) ? false:true"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="type" v-if="type==3">
          <el-input
            v-model="doorplateData.type"
            placeholder="请输入类型"
            :disabled="(type==3) ? false:true"
          ></el-input>
        </el-form-item>
        <el-form-item label="门牌：" prop="doorplate" v-if="type>3">
          <el-input v-model="doorplateData.doorplate" placeholder="请输入门牌号码"></el-input>
        </el-form-item>
        <el-form-item label="房型：" prop="roomType" v-if="type>3">
          <el-select v-model="doorplateData.room" placeholder="卧室">
            <el-option
              v-for="item in room"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="doorplateData.drawing" placeholder="客厅">
            <el-option
              v-for="item in drawing"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="doorplateData.toilet" placeholder="卫生间">
            <el-option
              v-for="item in toilet"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="doorplateData.kitchen" placeholder="厨房">
            <el-option
              v-for="item in kitchen"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="doorplateData.balcony" placeholder="阳台">
            <el-option
              v-for="item in balcony"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="朝向：" prop="orientation" v-if="type>3">
          <el-select v-model="doorplateData.orientation" placeholder="请选择朝向">
            <el-option
              v-for="item in orientationList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="面积：" prop="area" v-if="type>3">
          <div>
            <el-input v-model="doorplateData.area" placeholder="请输入面积">
              <template slot="append">㎡</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="使用面积：" prop="useArea" v-if="type>3">
          <div>
            <el-input v-model="doorplateData.useArea" placeholder="请输入使用面积">
              <template slot="append">㎡</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="用途：" prop="purpose" v-if="type>3">
          <el-select v-model="doorplateData.purpose" placeholder="请选择用途">
            <el-option
              v-for="item in purposeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产权：" prop="property" v-if="type>3">
          <el-select v-model="doorplateData.property" placeholder="请选择产权">
            <el-option
              v-for="item in propertyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="户型图：" prop="line" v-if="type>3">
          <el-upload
            class="upload-demo"
            :action=upUrl
            :data="upLoadData"
            :on-remove="handleRemove"
            :onSuccess="uploadSuccess"
            :beforeUpload="beforeAvatarUpload"
            :headers="upHeaders"
            :file-list="fileList"
            list-type="picture-card"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="save('ruleForm')" style="width: 150px;">保 存</el-button>
        <el-button @click="dialogHouseNoVisible = false" style="width: 150px;">取 消</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="30%">
      <el-table :data="houseNameData" highlight-current-row @current-change="houseClick" border>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="name" label="楼盘名称"></el-table-column>
      </el-table>
        <el-pagination
          :current-page="housetPage"
          @current-change="handlehousetChange"
          layout="prev, pager, next"
          :page-size="10"
          :total="houseTotal">
        </el-pagination>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="houseDictQueryClick()" style="width: 150px;">查询</el-button>
        <el-button @click="dialogVisible = false" style="width: 150px;">取 消</el-button>
      </div>
    </el-dialog> -->



  </div>
</template>
<script>
import {
  fileUpload,
  buildingFindAll,
  regionFindAllTree,
  dictionarySaveEdifice,
  dictionaryFindEdifice,
  dictionarySaveUnit,
  dictionaryFindUnit,
  dictionarySaveFlower,
  dictionaryUpdateEdifice,
  dictionaryUpdateUnit,
  dictionaryFindFlower,
  dictionaryUpdateFlower,
  dictionarySaveFamily,
  dictionaryFindFamily,
  dictionaryUpdateFamily,
  dictionaryRemoveEdifice,
  dictionaryRemoveUnit,
  dictionaryRemoveFlower,
  dictionaryRemoveFamily,
  buildingFind
} from "@/api/org-house";
import { stringify } from "querystring";
import { debuglog } from "util";
import { fail } from 'assert';
export default {
  data() {
    return {
      // http://39.97.235.207:8080/estate/file/upload
      upUrl:'http://www.tygy.top:8080/estate/file/upload',
      fileList: [],
      fileList2:[],
      rules: {
        build: [{ required: true, message: "请输入楼号", trigger: "change" }],
        element: [{ required: true, message: "请输入单元号，若独栋请输入0", trigger: "change" }],
        doorplate: [{ required: true, message: "请输入门牌号", trigger: "change" }],
        pliesCount: [
          { required: true, message: "请输入总层数", trigger: "change" }
        ]
      },
      houseNameHave: true,
      searchHouseDictForm: {},
      areaDataBuilding: [],
      areaDataCell: [],
      areaDataFloor: [],
      areaDataHouse: [],
      upLoadData: {},
      upHeaders: {},
      value: "",
      input: "",
      type: 1,
      edit: 1,
      doorplateData: {
        room: 0,
        drawing: 0,
        toilet: 0,
        kitchen: 0,
        balcony: 0,
        orientation: 0,
        purpose: 0,
        property: 0,
        houses: []
      },
      selectedOptions: "",
      diaHouseNo: "",
      dialogHouseNoVisible: false,
      dialogVisible: false,
      room: [],
      drawing: [],
      toilet: [],
      kitchen: [],
      balcony: [],
      areaDataList:[],
      orientationList: [
        { value: 0, label: "朝南" },
        { value: 1, label: "朝西" },
        { value: 2, label: "朝东" },
        { value: 3, label: "朝北" }
      ],
      propertyList: [
        { value: 0, label: "商品房" },
        { value: 1, label: "经济适用房" },
        { value: 2, label: "房改房" },
        { value: 3, label: "安置房" },
        { value: 4, label: "回迁房" },
        { value: 5, label: "集体房" },
        { value: 6, label: "其他" }
      ],
      purposeList: [
        { value: 0, label: "住宅" },
        { value: 1, label: "写字楼" },
        { value: 2, label: "商铺" },
        { value: 3, label: "商住两用" },
        { value: 4, label: "厂房" },
        { value: 5, label: "土地" },
        { value: 6, label: "其他" },
        { value: 7, label: "车库" },
        { value: 8, label: "住宅底商" }
      ],
      houseNameData:[],
      housesList: [],
      initHoseData:{},
      currentRow1: {},
      currentRow2: {},
      currentRow3: {},
      total1:1,
      total2:1,
      total3:1,
      total4:1,
      houseTotal:1,
      currentPage1:1,
      currentPage2:1,
      currentPage3:1,
      currentPage4:1,
      // housetPage:1,
      selectInput:{},
      resultList:[],
      initCount:0,
    };
  },
  watch:{
    'searchHouseDictForm.houseName'(newVal,oldVal){
      let seachResult = false
      if(this.resultList.length){
        this.resultList.map(o=>{
          if(newVal == o.value){
            seachResult = true
          }
        })
      }

      if(!seachResult && this.initCount>1) this.searchHouseDictForm.houseNameId = 0
      this.houseDictQueryClick(this.searchHouseDictForm)
    },
    'searchHouseDictForm.area'(newVal,oldVal){
      const regionQs = newVal.join(".")
      this.buildingFind({regionQs:regionQs})
    },
    areaDataBuilding: function() {
      // this.$nextTick(function() {
        if (this.areaDataBuilding.length) {
          this.$refs.singleTable.setCurrentRow(this.areaDataBuilding[0])
        }
      // })
    },
    areaDataCell: function() {
      // this.$nextTick(function() {
        if (this.areaDataCell.length) {
          this.$refs.singleAreaTable.setCurrentRow(this.areaDataCell[0])
        }
      // })
    },
    areaDataFloor: function() {
      // this.$nextTick(function() {
        if (this.areaDataFloor.length) {
            this.$refs.singleFloorTable.setCurrentRow(this.areaDataFloor[0])
        }

      // })
    },
    areaDataHouse: function() {
      // this.$nextTick(function() {
        if (this.areaDataHouse.length) {
          this.$refs.singleHouseTable.setCurrentRow(this.areaDataHouse[0])
        }
      // })
    },
    
  },
  methods: {
    // reset(){ //重置
    //   this.searchHouseDictForm ={}
    //   this.currentPage1 = 1
    //   this.currentPage2 = 1
    //   this.currentPage3 = 1
    //   this.currentPage4 = 1
    //   this.housetPage = 1
    //   this.dictionaryFindEdifice()
    // },
    houseClick(val){
      this.selectInput = val
      this.searchHouseDictForm.houseName = val.name
      // this.dialogVisible = false
    },
    checkSelect(val){ //查询弹窗
      this.currentPage1 = 1
      this.currentPage2 = 1
      this.currentPage3 = 1
      this.currentPage4 = 1
      const i = this.searchHouseDictForm
      i.area ? this.searchHouseDictForm.newArea = i.area.join('.'): i=""
        this.buildingFind({regionQs:this.searchHouseDictForm.newArea})
        // this.dialogVisible = true
        
    },
    querySearchAsync(queryString, cb){ //远程及时搜索
      var restaurants = [...this.houseNameData];
      if(restaurants.length<1) return
      restaurants.map(o=>{
        o.value = o.name
      })
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.resultList = results
          cb(results);
        }, 100 * Math.random());
    },
      createStateFilter(queryString) {
        return (state) => {
          return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
    handleSelect(){

    },



    handlehousetChange(val){
      //分页跳页查询
      this.housetPage = val
      // this.dictionaryFindEdifice()
      this.buildingFind({regionQs:this.searchHouseDictForm.newArea})
    },
    handleCurrentChange1(val){
          //分页跳页查询
          this.currentPage1 = val
          this.dictionaryFindEdifice(this.searchHouseDictForm.houseNameId)
    },
    handleCurrentChange2(val){
          //分页跳页查询
          this.currentPage2 = val
          this.dictionaryFindUnit(this.currentRow1.id)
    },
    handleCurrentChange3(val){
          //分页跳页查询
          this.currentPage3 = val
          this.dictionaryFindFlower(this.currentRow2.id)
    },
    handleCurrentChange4(val){
          //分页跳页查询
          this.currentPage4 = val
          this.dictionaryFindFamily(this.currentRow3.id)
    },
    houseDictQueryClick(row,type) {
      this.initCount ++
      if(!row.houseName){
        row.houseNameId = 0
      }
      if(this.houseNameData.length){
        this.houseNameData.map(o=>{
          if(row.houseName == o.name){
            row.houseNameId = Number(o.id)
          }
        })
      }

    if(!type){
        this.houseNameHave = false
    }
 

    this.dictionaryFindEdifice(row.houseNameId)
    this.doorplateData.houses = [row.area[0],JSON.stringify(row.houseNameId)]
    this.initHoseData = row
    this.currentRow1 = row

    },

    
    handleRemove(file, fileList) {
      this.fileList.map((o,i)=>{
        if(o.url == file.url){
           this.fileList.splice(i, 1)
        }
      })
    },
    refresh(i){ //刷新
     switch (i) {
       case 1:
         this.currentPage1 = 1
         
        //  console.log(this.searchHouseDictForm)
        // this.currentRow1.buildingId
         this.dictionaryFindEdifice(this.searchHouseDictForm.houseNameId)
         break;
       case 2:
        this.currentPage2 = 1
        this.dictionaryFindUnit(this.currentRow1.id)
         break;
       case 3:
         this.currentPage3 = 1
         this.dictionaryFindFlower(this.currentRow2.id)
         break;
       case 4:
         this.currentPage4 = 1
         this.dictionaryFindFamily(this.currentRow3.id)
         break;
       default:
         break;
     }
    },
    uploadSuccess(res, file) {
      if (res.code == 1000) {
        this.fileList.push({url:res.body})
      }
    },
    // 上传前对文件的大小的判断
    beforeAvatarUpload(file) {
      const extension = file.name.split(".")[1] === "png";
      const extension2 = file.name.split(".")[1] === "jpg";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!extension && !extension2) {
        this.$message({
          type: "error",
          message: "上传图片只能是 png,jpg 格式!"
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          type: "error",
          message: "上传图片大小不能超过 1MB!"
        });
      }
      return extension || (extension2 && isLt2M);
    },
    buildNo(type,row) {
      this.type = type;
      this.edit = "";
      this.diaHouseNo = "新增";
      this.dialogHouseNoVisible = true;
      this.currentRow = row
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
        switch (type) {
          case 1:
    let newAreas =''

    if(this.initHoseData.area.length==1){
      this.areaDataList.map(o=>{
        if(o.id == this.initHoseData.area[0]){
            newAreas = o.label
        }
      })
    }
    if(this.initHoseData.area.length == 2){
      this.areaDataList.map(o=>{
        if(o.id == this.initHoseData.area[0]){
            o.children.map(j=>{
              if(j.id ==this.initHoseData.area[1]){
                newAreas = j.label
              }
            })
        }
      })
    }
    if(this.initHoseData.area.length==3){
      this.areaDataList.map(o=>{
        if(o.id == this.initHoseData.area[0]){
            o.children.map(j=>{
              if(j.id ==this.initHoseData.area[1]){
                j.children.map(k=>{
                    if(k.id ==this.initHoseData.area[2]){
                      newAreas = j.label + k.label
                    }
                })
              }
            })
        }
      })
    }
            this.doorplateData = {
              build: "",
              houses: [this.initHoseData.area[0],this.initHoseData.houseNameId],
              housesl: newAreas +"/"+this.initHoseData.houseName
            };
            break;
          case 2:
            const lasRegionIds = JSON.stringify(
              this.currentRow.regionIds[this.currentRow.regionIds.length - 1]
            );
            let newHouses = [this.currentRow.regionIds[0], lasRegionIds];
            this.doorplateData = {
              build: this.currentRow.name,
              houses: newHouses,
              element: "",
              pliesCount: ""
            };
            break;
          case 3:
            const floorRegionIds = JSON.stringify(
              this.currentRow.regionIds[this.currentRow.regionIds.length - 1]
            );
            let newFloor = [this.currentRow.regionIds[0], floorRegionIds];
            this.doorplateData = {
              build: this.currentRow.edificeName,
              houses: newFloor,
              element: this.currentRow.name,
              plies: "",
              type: ""
            };
            break;
          case 4:
            const doorRegionIds = JSON.stringify(
              this.currentRow.regionIds[this.currentRow.regionIds.length - 1]
            );
            let newDoor = [this.currentRow.regionIds[0], doorRegionIds];
            this.fileList = []
            this.doorplateData = {
              build: this.currentRow.edificeName,
              houses: newDoor,
              element: this.currentRow.unitName,
              plies: this.currentRow.name,
              type: this.currentRow.type,
              purpose: 0, //用途
              balcony: 0, //阳台
              toilet: 0, //卫
              drawing: 0, //厅
              kitchen: 0, //厨房
              orientation: 0, //朝向
              property: 0, //产权
              room: 0 //室
            };
            break;
          default:
            break;
        }
      });
    },

    handleCurrentChangeBuild1(row) {
      if(!row) return
      this.dictionaryFindUnit(row.id)
      this.currentRow1 = row;
    },
    handleCurrentChangeBuild2(row) {
      if(!row) return
      this.currentRow2 = row;
      this.dictionaryFindFlower(row.id)
    },
    handleCurrentChangeBuild3(row) {
      if(!row) return
      this.currentRow3 = row;
      this.dictionaryFindFamily(row.id)
    },
    deleteClick(i,row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        switch (i) {
          case 1:
            if(this.areaDataCell.length>0){
              this.$message({
                type: "error",
                message: "该楼号下单元列表不为空，无法删除"
              })
              return
            }
            dictionaryRemoveEdifice({id:row.id}).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.dictionaryFindEdifice(this.currentRow1.buildingId)
          })        
            break;
          case 2:
            if(this.areaDataFloor.length>0){
              this.$message({
                type: "error",
                message: "该单元信息下的楼层信息列表不为空，无法删除"
              })  
              return
            }
            dictionaryRemoveUnit({id:row.id}).then(res=>{
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.dictionaryFindUnit(this.currentRow1.id)
            })        
            break;        
          case 3:
            if(this.areaDataHouse.length>0){
              this.$message({
                type: "error",
                message: "该楼层信息下的门牌号信息列表不为空，无法删除"
              })  
              return
            }
              dictionaryRemoveFlower({id:row.id}).then(res=>{
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.dictionaryFindFlower(this.currentRow2.id)
            })        
            break;        
          case 4:
            dictionaryRemoveFamily({id:row.id}).then(res=>{
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.dictionaryFindFamily(this.currentRow3.id);
          })        
            break; 


            
          default:
            break;
        }

        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

    },
    elementNo(i, row) {
      setTimeout(() => {
      //编辑
      this.type = i;
      this.edit = i;
      this.diaHouseNo = "修改";
      switch (i) {
        case 1:
          





      let newAreas =''

      if(this.initHoseData.area.length==1){
        this.areaDataList.map(o=>{
          if(o.id == this.initHoseData.area[0]){
              newAreas = o.label
          }
        })
      }
      if(this.initHoseData.area.length == 2){
        this.areaDataList.map(o=>{
          if(o.id == this.initHoseData.area[0]){
              o.children.map(j=>{
                if(j.id ==this.initHoseData.area[1]){
                  newAreas = j.label
                }
              })
          }
        })
      }
      if(this.initHoseData.area.length==3){
        this.areaDataList.map(o=>{
          if(o.id == this.initHoseData.area[0]){
              o.children.map(j=>{
                if(j.id ==this.initHoseData.area[1]){
                  j.children.map(k=>{
                      if(k.id ==this.initHoseData.area[2]){
                        newAreas = j.label + k.label
                      }
                  })
                }
              })
          }
        })
      }
          const lasRegionIds = JSON.stringify(
            row.regionIds[row.regionIds.length - 1]
          );
          let newHouses = [row.regionIds[0], lasRegionIds];
          // console.log(row)
          this.doorplateData = {
            id: row.id,
            build: row.name,
            houses: newHouses,
            housesl: newAreas +"/"+this.initHoseData.houseName
          };
          this.dialogHouseNoVisible = true;
          break;
        case 2:


      let newAreasl =''

      if(this.initHoseData.area.length==1){
        this.areaDataList.map(o=>{
          if(o.id == this.initHoseData.area[0]){
              newAreasl = o.label
          }
        })
      }
      if(this.initHoseData.area.length == 2){
        this.areaDataList.map(o=>{
          if(o.id == this.initHoseData.area[0]){
              o.children.map(j=>{
                if(j.id ==this.initHoseData.area[1]){
                  newAreasl = j.label
                }
              })
          }
        })
      }
      if(this.initHoseData.area.length==3){
        this.areaDataList.map(o=>{
          if(o.id == this.initHoseData.area[0]){
              o.children.map(j=>{
                if(j.id ==this.initHoseData.area[1]){
                  j.children.map(k=>{
                      if(k.id ==this.initHoseData.area[2]){
                        newAreasl = j.label + k.label
                      }
                  })
                }
              })
          }
        })
      }







          const eleLast = JSON.stringify(
            row.regionIds[row.regionIds.length - 1]
          );
          let eleHouse = [row.regionIds[0], eleLast];
          this.doorplateData = {
            id: row.id,
            edificeId: row.edificeId,
            build: row.edificeName,
            houses: eleHouse,
            housesl: newAreasl +"/"+this.initHoseData.houseName,
            element: row.name,
            pliesCount: row.totalFlower
          };
          this.dialogHouseNoVisible = true;
          break;
        case 3:
          const floorLast = JSON.stringify(
            row.regionIds[row.regionIds.length - 1]
          );
          let floorHouse = [row.regionIds[0], floorLast];
          this.doorplateData = {
            id: row.id,
            edificeId: row.edificeId,
            build: row.edificeName,
            houses: floorHouse,
            element: row.unitName,
            pliesCount: row.totalFlower,
            plies: row.name,
            type: row.type
          };
          this.dialogHouseNoVisible = true;
          break;
        case 4:
          this.fileList = []
          const signLast = JSON.stringify(
            row.regionIds[row.regionIds.length - 1]
          );
          let signHouse = [row.regionIds[0], signLast];
              
                if(row.houseChart){
                  row.houseChart.map(o=>{
                      const newImg = {
                        url:o
                      }
                      this.fileList.push(newImg)
                  })
                }

          this.doorplateData = {
            id: row.id,
            flowerId: row.flowerId,
            build: row.edificeName,
            houses: signHouse,
            element: row.unitName,
            plies: row.flowerName,
            purpose: Number(row.apply), //用途
            area: row.area, //面积
            balcony: row.balcony, //阳台
            toilet: row.bathroom, //卫
            flowerId: row.flowerId, //楼层id
            drawing: row.hall, //厅
            kitchen: row.kitchen, //厨房
            doorplate: row.name, //门牌号
            orientation: row.oriented, //朝向
            property: Number(row.property), //产权
            room: row.room, //室
            useArea: row.useArea, //使用面积
            houseChart:row.houseChart
          };
          this.dialogHouseNoVisible = true;
          break;
        default:
          break;
      }
      })
    },
    handleChange() {},
    handlePreview() {},
    save(formName) {
      //保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.edit) {
            //编辑
            switch (this.edit) {
              case 1:
                let upData = Object.assign({}, this.doorplateData);
                upData = {
                  id: this.doorplateData.id,
                  name: this.doorplateData.build,
                  buildingId: Number(this.doorplateData.houses[1])
                };
                dictionaryUpdateEdifice(upData).then(res => {
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                  this.dictionaryFindEdifice(this.currentRow1.buildingId,1)
                  this.dictionaryFindUnit(this.currentRow1.id);
                  this.dialogHouseNoVisible = false;
                });
                break;
              case 2:
                let upDataEle = Object.assign({}, this.doorplateData);
                upDataEle = {
                  edificeId: this.doorplateData.edificeId,
                  id: this.doorplateData.id,
                  name: this.doorplateData.element,
                  totalFlower: this.doorplateData.pliesCount
                }
                dictionaryUpdateUnit(upDataEle).then(res => {
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                  this.dictionaryFindUnit(this.currentRow1.id,1);
                  this.dictionaryFindFlower(this.currentRow2.id);
                  this.dialogHouseNoVisible = false;
                });
                break;
              case 3:
                let upDataFloor = Object.assign({}, this.doorplateData);
                upDataFloor = {
                  id: upDataFloor.id,
                  name: upDataFloor.plies,
                  type: upDataFloor.type,
                  unitId: this.currentRow2.id
                };
                dictionaryUpdateFlower(upDataFloor).then(res => {
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                  this.dictionaryFindFlower(this.currentRow2.id,1);
                  this.dictionaryFindFamily(this.currentRow3.id);
                  this.dialogHouseNoVisible = false;
                });
                break;
              case 4:
                let upDataSign = Object.assign({}, this.doorplateData);
                const fileList2 = []
                this.fileList.map(o=>{
                  fileList2.push(o.url)
                })
                upDataSign = {
                  apply: upDataSign.purpose,
                  area: upDataSign.area,
                  balcony: upDataSign.balcony, //阳台
                  bathroom: upDataSign.toilet, //卫
                  flowerId: upDataSign.flowerId,
                  hall: upDataSign.drawing, //厅
                  id: upDataSign.id,
                  kitchen: upDataSign.kitchen, //厨房
                  name: upDataSign.doorplate, //门牌号
                  oriented: upDataSign.orientation, //朝向
                  property: upDataSign.property, //产权
                  room: upDataSign.room, //室
                  useArea: upDataSign.useArea, //使用面积
                  houseChart: fileList2 //户型图
                };
                dictionaryUpdateFamily(upDataSign).then(res => {
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                  this.dictionaryFindFamily(this.currentRow3.id,1);
                  this.dialogHouseNoVisible = false;
                });
                break;
              default:
                break;
            }
          } else {
            //新增

            switch (this.type) {
              case 1:
                let upData = Object.assign({}, this.doorplateData);
                upData = {
                  name: this.doorplateData.build,
                  buildingId: Number(this.doorplateData.houses[1])
                };
                dictionarySaveEdifice(upData).then(res => {
                  this.$message({
                    type: "success",
                    message: "新增成功"
                  });
                  this.dictionaryFindEdifice(this.currentRow1.buildingId);
                  this.dialogHouseNoVisible = false;
                });
                break;
              case 2:
                const params = {
                  edificeId: this.currentRow.id,
                  name: this.doorplateData.element,
                  totalFlower: this.doorplateData.pliesCount
                };
                dictionarySaveUnit(params).then(res => {
                  this.$message({
                    type: "success",
                    message: "新增成功"
                  });
                  this.dictionaryFindUnit(this.currentRow1.id);
                  this.dialogHouseNoVisible = false;
                });
                break;
              case 3:
                const floorData = {
                  name: this.doorplateData.plies,
                  type: this.doorplateData.type,
                  unitId: this.currentRow.id
                };
                dictionarySaveFlower(floorData).then(res => {
                  this.$message({
                    type: "success",
                    message: "新增成功"
                  });
                  this.dictionaryFindFlower(this.currentRow2.id);
                  this.dialogHouseNoVisible = false;
                });
                break;
              case 4:
                const fileList2 = []
                this.fileList.map(o=>{
                  fileList2.push(o.url)
                })
                const doorData = {
                  apply: this.doorplateData.purpose, //用途
                  area: this.doorplateData.area, //面积
                  balcony: this.doorplateData.balcony, //阳台
                  bathroom: this.doorplateData.toilet, //卫
                  flowerId: this.currentRow.id, //楼层id
                  hall: this.doorplateData.drawing, //厅
                  kitchen: this.doorplateData.kitchen, //厨房
                  name: this.doorplateData.doorplate, //门牌号
                  oriented: this.doorplateData.orientation, //朝向
                  property: this.doorplateData.property, //产权
                  room: this.doorplateData.room, //室
                  useArea: this.doorplateData.useArea, //使用面积
                  houseChart: fileList2 //户型图
                };
                dictionarySaveFamily(doorData).then(res => {
                  this.$message({
                    type: "success",
                    message: "新增成功"
                  });
                  this.dictionaryFindFamily(this.currentRow3.id);
                  this.dialogHouseNoVisible = false;
                });
                break;
              default:
                break;
            }
          }
        }
      });
    },
    dictionaryFindEdifice(superiorId="",type) {
      //查询楼号信息
      dictionaryFindEdifice({superiorId:superiorId,page:this.currentPage1}).then(res => {
        this.total1 = res.body.total
        
        if(res.body.rows.length){
          this.areaDataBuilding = res.body.rows;
          const id = this.areaDataBuilding[0].id
          this.currentRow1 = this.areaDataBuilding[0]
          if(!type) this.dictionaryFindUnit(id)
        }else{
          this.areaDataBuilding = []
          this.areaDataCell = []
          this.areaDataFloor =[]
          this.areaDataHouse = []
          this.total1 = 1
          this.total2 = 1
          this.total3 = 1
          this.total4 = 1
        }
        
      });
    },
    dictionaryFindUnit(superiorId='',type) {
      //查询单元信息
      dictionaryFindUnit({page:this.currentPage2,superiorId:superiorId}).then(res => {
        this.total2 = res.body.total
        if(res.body.rows.length){
          this.areaDataCell = res.body.rows;
          this.currentRow2 = this.areaDataCell[0]
          const id =this.areaDataCell[0].id
          if(!type) this.dictionaryFindFlower(id)
        }else{
          this.areaDataCell = []
          this.areaDataFloor =[]
          this.areaDataHouse = []
          this.total2 = 1
          this.total3 = 1
          this.total4 = 1
        }
        
      });
    },
    dictionaryFindFlower(superiorId='',type) {
      //查询楼层信息
      dictionaryFindFlower({page:this.currentPage3,superiorId:superiorId}).then(res => {
        this.total3 = res.body.total
        
        if(res.body.rows.length){
          this.areaDataFloor = res.body.rows;
          this.currentRow3 = this.areaDataFloor[0]
          const id = this.areaDataFloor[0].id
          if(!type) this.dictionaryFindFamily(id)
        }else{
          this.areaDataHouse = []
          this.areaDataFloor =[]
          this.total3 = 1
          this.total4 = 1
        }
      });
    },
    dictionaryFindFamily(superiorId='') {
      //查询门牌号信息
      dictionaryFindFamily({page:this.currentPage4,superiorId:superiorId}).then(res => {
        this.total4 = res.body.total
        this.areaDataHouse = res.body.rows;
        res.body.rows.map(j => {
          this.orientationList.forEach(k => {
            if (k.value == j.oriented) {
              j.orientedName = k.label;
            }
          });
          this.purposeList.forEach(k => {
            if (k.value == j.apply) {
              j.applyName = k.label;
            }
          });
          this.propertyList.forEach(o => {
            if (o.value == j.property) {
              j.propertyName = o.label;
            }
          });
        });
      });
    },
    regionFindAllTree(type){
      regionFindAllTree({}).then(res => {
        if (!res.body.length) return;
        res.body.map(o => {
          let newLabel = ''
            if(o.children){
              if(o.children[0].children){
                newLabel = `${o.children[0].name}/${o.children[0].children[0].name}`
              }else{
                newLabel = o.children[0].name
              }
            }else{
              newLabel = o.name
            }
            const doorplate = {
              label: newLabel,
              value: o.id
            };
          
          const doorplateChildList = [];
          buildingFindAll({ regionQs: o.qs }).then(data => {
            data.body.map(j => {
              const cityDoorplate = {
                label: j.name,
                value: j.id
              };
              if (cityDoorplate) {
                if (this.doorplateData.houses.length < 1) {
                  this.doorplateData.houses = [o.id, j.id];
                }
              }
              doorplateChildList.push(cityDoorplate);
            });
          });
          doorplate.children = doorplateChildList;
          this.housesList.push(doorplate);
        });
      });
    },
    initData() {
      for (let i = 0; i < 8; i++) {
        const newRoom = {
          value: i,
          label: `${i}室`
        };
        this.room.push(newRoom);
        const newDrawing = {
          value: i,
          label: `${i}厅`
        };
        this.drawing.push(newDrawing);
        const newToilet = {
          value: i,
          label: `${i}卫`
        };
        this.toilet.push(newToilet);
        const newKitchen = {
          value: i,
          label: `${i}厨`
        };
        this.kitchen.push(newKitchen);
        const newBalcony = {
          value: i,
          label: `${i}阳台`
        };
        this.balcony.push(newBalcony);
      }
      this.regionFindAllTree()
    },
    buildingFind(data={}){
      buildingFind(data).then(res=>{
        this.houseNameData = res.body.rows
        this.houseTotal = res.body.total
        if(res.body.rows.length<1){
          this.searchHouseDictForm.houseName =''
          this.searchHouseDictForm.houseNameId =''
        }else{
          this.searchHouseDictForm.houseName = this.houseNameData[0].name
          this.searchHouseDictForm.houseNameId = this.houseNameData[0].id
        }
      })
    }
  },
  created() {
    // this.dictionaryFindEdifice();
    this.initData();
      this.upHeaders = {
        token: localStorage.getItem("token")
      };
      this.areaDataList = this.$store.getters.areaData
      let cityId, areaId
      if(this.areaDataList.length>0){
        cityId = this.areaDataList[0].id
        if(this.areaDataList[0].children && this.areaDataList[0].children.length>0){
          areaId = this.areaDataList[0].children[0].id
        }
        this.searchHouseDictForm = {
          area: [cityId,areaId],
          houseName:''
        }
        
        this.checkSelect()
      }
     setTimeout(()=>{
       this.houseDictQueryClick(this.searchHouseDictForm,1)
     },500)
      
  }
};
</script>
<style>
.house_regis .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, 
.house_regis .el-table__body tr.current-row>td {
	background-color: #ffec8b !important;
}
</style>
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
  background: #67c23a;
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
.oper-grid {
  padding-top: 20px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>