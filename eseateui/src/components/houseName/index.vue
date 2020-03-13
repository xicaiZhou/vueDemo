<template>
  <div>
    <el-form ref="form" :model="searchHouseForm" label-width="90px" size="small" :inline="true">
      <el-form-item label="楼盘名称：">
        <el-input placeholder="请输入楼盘名称查询" style="width: 150px;" v-model="searchHouseForm.houseName"></el-input>
      </el-form-item>
      <el-form-item label="区域：">
          <el-cascader
          expand-trigger="hover"
            :options="areaDataList"
            v-model="searchHouseForm.area"
            change-on-select
          ></el-cascader>
      </el-form-item>
      <el-button @click="houseNameQueryClick(searchHouseForm)" type="primary" size="small">查询</el-button>
      <el-button @click="houseNameBuildClick()" type="primary" size="small">新建</el-button>
      <el-button @click="refresh()" type="primary" size="small">重置</el-button>
    </el-form>
    <el-divider></el-divider>
    <el-table :data="houseNameData" border>
      <el-table-column prop="id" width="120" label="编号"></el-table-column>
      <el-table-column prop="name"  width="120" label="楼盘名称"></el-table-column>
      <el-table-column prop="city"  width="120" label="城市"></el-table-column>
      <el-table-column prop="area"  width="120" label="区/县"></el-table-column>
      <el-table-column prop="slice"  width="120" label="片区"></el-table-column>
      <el-table-column prop="address"  width="120" label="地址"></el-table-column>
      <el-table-column prop="subwaysName"  width="120" label="附近地铁"></el-table-column>
      <el-table-column prop="newSubwaystationAll"  width="120" label="附近地铁站点"></el-table-column>
      <el-table-column prop="newStationDistanceAll"  width="120" label="距离站点"></el-table-column>
      <el-table-column prop="apply"  width="120" label="用途"></el-table-column>
      <el-table-column prop="type"  width="120" label="类型"></el-table-column>
      <el-table-column prop="startYear"  width="120" label="房龄"></el-table-column>
      <!-- <el-table-column prop="houseMake" label="结构"></el-table-column> -->
      <el-table-column prop="property"  width="120" label="产权"></el-table-column>
      <el-table-column prop="costs"  width="120" label="物业费"></el-table-column>
      <el-table-column prop="developer"  width="120" label="开发商"></el-table-column>
      <el-table-column prop="company"  width="120" label="物业公司"></el-table-column>
      <el-table-column prop="parking"  width="120" label="停车位"></el-table-column>
      <el-table-column prop="totalUsers"  width="120" label="总用户数"></el-table-column>
      <el-table-column prop="volumeRate"  width="120" label="容积率"></el-table-column>
      <el-table-column prop="createUser" width="120" label="录入人"></el-table-column>
      <el-table-column prop="createTime" width="180" label="录入时间"></el-table-column>
      <el-table-column label="操作" width="120px"  fixed="right">
        <template slot-scope="scope" class="flex-center btn-style">
          <el-button
            @click="houseNamechangeClick(scope.row)"
            type="text"
            size="small"
          >修改</el-button>
          <el-button
            @click="houseNamedeleteClick(scope.row)"
            type="text"
            size="small"
            style="color:red;"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :page-size="10"
      :total="total"
    ></el-pagination>
    <!-- 楼盘新建/修改 -->
		<el-dialog
      :title="diaHouseNameTitle"
			:center="true"
      :visible.sync="dialoghouseNameVisible"
      :close-on-click-modal="false"
			:show-close="false"
			:close-on-press-escape="false"
			>
      <el-form :model="selectedHouseNameData" :rules="rules" ref="ruleForm" label-width="100px" :inline="true">
				<el-form-item label="楼盘名称：" prop="name">
					<el-input size="small" v-model="selectedHouseNameData.name" style="width: 200px;"></el-input>
					<el-button size="small" type="primary" @click="queryClick(selectedHouseNameData.name)">查 重</el-button>
				</el-form-item>

        <el-form-item label="片区：" prop="area">
          <el-cascader
            :options="areaDataList"
            v-model="selectedHouseNameData.area"
          ></el-cascader>
        </el-form-item>
				<el-form-item label="详细地址：" prop="address">
          <el-input type="textarea"  :rows="2" size="small" v-model="selectedHouseNameData.address" style="width: 200px;"></el-input>
        </el-form-item>
				<el-form-item label="附近地铁：" prop="nearSubWayName">
           <el-input size="small" v-model="selectedHouseNameData.nearSubWayName" @focus="nearSubWayClick" v-show="false"  placeholder="请先选择城市" style="width: 200px;"></el-input>
           <el-input size="small" v-model="selectedHouseNameData.nearSubWayNameString" @focus="nearSubWayClick"  multiple  :disabled="(!selectedHouseNameData.area)?true:false" placeholder="请先选择城市" style="width: 200px;"></el-input>
           
         <!-- <el-select v-model="selectedHouseNameData.nearSubWay" multiple  :disabled="(!selectedHouseNameData.area)?true:false" placeholder="请先选择城市">
             <el-option
              v-for="item in subwayList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
             </el-option>
          </el-select> -->
        </el-form-item>
        <!-- <el-form-item label="附近地铁站点：" prop="stationName" label-width="110px">
         <el-select v-model="selectedHouseNameData.stationName" multiple  :disabled="(!selectedHouseNameData.area)?true:false" placeholder="请先选择附近地铁">
             <el-option
              v-for="item in subwayList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
             </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="距离站点：" prop="distanceStation">
          <el-input size="small" v-model="selectedHouseNameData.distanceStation" style="width: 100px;"></el-input>  米
        </el-form-item> -->
				<el-form-item label="用途：" prop="apply">
         <el-select v-model="selectedHouseNameData.apply" placeholder="请选择">
             <el-option
              v-for="item in houseTypeList"
              :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="类型：" prop="type">
          <el-select v-model="selectedHouseNameData.type" placeholder="请选择">
             <el-option
              v-for="item in useTypeList"
              :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="物业费：" prop="costs">
          <el-input v-model="selectedHouseNameData.costs" style="width: 200px;">
                <el-select v-model="selectedHouseNameData.costsType" slot="prepend" placeholder="请选择" style="width: 100px;">
                  <el-option
                    v-for="item in quarterList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
              </el-select>           
          </el-input>

        </el-form-item>
				<el-form-item label="物业公司：" prop="company">
          <el-input size="small" v-model="selectedHouseNameData.company" style="width: 100px;"></el-input>
        </el-form-item>
				<el-form-item label="总用户数：" prop="totalUsers">
          <el-input size="small" v-model="selectedHouseNameData.totalUsers" style="width: 100px;"></el-input>
        </el-form-item>
				<el-form-item label="停车位：" prop="parking">
          <el-input size="small" v-model="selectedHouseNameData.parking" style="width: 100px;"></el-input>
        </el-form-item>
				<el-form-item label="容积率：" prop="volumeRate">
          <el-input size="small" v-model="selectedHouseNameData.volumeRate" style="width: 100px;"></el-input>
        </el-form-item>
				<el-form-item label="绿化率：" prop="greeningRate">
          <el-input size="small" v-model="selectedHouseNameData.greeningRate" style="width: 100px;"></el-input>
        </el-form-item>
				<el-form-item label="开发商：" prop="developer">
          <el-input size="small" v-model="selectedHouseNameData.developer" style="width: 100px;"></el-input>
        </el-form-item>
				<el-form-item label="电费单价：" prop="electricityFee">
          <el-input size="small" v-model="selectedHouseNameData.electricityFee" style="width: 150px;"><template slot="append">/每度</template></el-input>
        </el-form-item>
				<el-form-item label="水费单价：" prop="waterFee">
          <el-input size="small" v-model="selectedHouseNameData.waterFee" style="width: 150px;"><template slot="append">/每吨</template></el-input>
        </el-form-item>
				<el-form-item label="产权：" prop="property">
          <el-select v-model="selectedHouseNameData.property" placeholder="请选择">
             <el-option
              v-for="item in houseSelfList"
              :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
          </el-select>
        </el-form-item>

				<el-form-item label="房龄：" prop="houseAge">
          <el-date-picker
            v-model="selectedHouseNameData.houseAge"
            align="right"
            type="year"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="楼盘介绍：" prop="description">
          <el-input type="textarea" v-model="selectedHouseNameData.description" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submit()" style="width: 150px;">提 交</el-button>
        <el-button @click="dialoghouseNameVisible = false" style="width: 150px;">取 消</el-button>
      </div>
    </el-dialog>
     

    <!-- 地体查询 -->
    <el-dialog
      title="附近地铁"
      :visible.sync="dialogVisible"
      width="50%">
     <el-form label-width="40px" size="small" :inline="true">
        <el-form-item label="线路">
        <el-select v-model="subwayFrom.nearSubwayLine" style="width: 100px;" placeholder="请选择">
             <el-option
              v-for="item in subwayList"
              :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
        </el-select>
        </el-form-item>    
        <el-form-item label="站点">
        <el-select v-model="subwayFrom.nearSubwayStation" style="width: 100px;"  :disabled="(!subwayFrom.nearSubwayLine)?true:false" placeholder="请先选择附近地铁">
             <el-option
              v-for="item in subwayLineStation"
              :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
        </el-select>
        </el-form-item>    
        <el-form-item label="距离">
          <el-input style="width: 100px;" type="number" v-model="subwayFrom.distance"></el-input>
        </el-form-item>
     </el-form>
      <div class="dialog-footer" style="text-align: left;padding-bottom: 20px;">
        <span style="color: red;">*温馨提示：先选择线路、站点并填写距离，然后点击 “新增” 按钮，最后再统一提交</span>
        <br>
        <br>
        <el-button @click="saveSubwayClick()"  size="small" type="primary">新增</el-button>
        <!-- <el-button @click="dialogVisible = false"  size="small" type="primary">新增</el-button> -->
      </div>

      <el-table :data="nearSubwayStationData" highlight-current-row @current-change="houseClick" border>
        <el-table-column prop="nearSubwayStation" label="编号"></el-table-column>
        <el-table-column prop="subwayName" label="地铁名称"></el-table-column>
        <el-table-column prop="subwayStationName" label="站点名称"></el-table-column>
        <el-table-column prop="distance" label="距离"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope" class="flex-center btn-style">
            <el-button
              @click="deleteSubwayClick(scope.row)"
              type="text"
              size="small"
              style="color:red;"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button size="small" type="primary" @click="dialogVisible = false" style="width: 150px;">提 交</el-button>
      </div>

        <!-- <el-pagination
          :current-page="housetPage"
          @current-change="handlehousetChange"
          layout="prev, pager, next"
          :page-size="10"
          :total="houseTotal">
        </el-pagination> -->



      <!-- <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="houseDictQueryClick()" style="width: 150px;">查询</el-button>
        <el-button @click="dialogVisible = false" style="width: 150px;">取 消</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>
<script>
import { buildingFind,buildingFindByName,buildingSave,buildingUpdate,buildingRemove ,subwayFindSubway, subwayFindStation,dictionaryFindEdifice,regionFindAllTree } from "@/api/org-house";
import { constants } from 'crypto';
import { setTimeout } from 'timers';
export default {
    data(){
        return{
            rules:{
              name: [
                { required: true, message: '请输入楼盘名称', trigger: 'blur' }
              ],
              area: [
                { required: true, message: '请选择片区', trigger: 'blur' }
              ],
              nearSubWayName: [
                { required: true, message: '请选择附近地铁', trigger: 'change' }
              ],
            },
            searchHouseForm:{},
            houseNameData:[],
            nearSubwayStationData:[],
            curreySubwayStationData:[],
            currentPage:1,
            total: 1,
            type: 1,
            cityId:null,
            diaHouseNameTitle:'',
            cityAllData:[],
            dialoghouseNameVisible: false,
            dialogVisible: false,
            selectedHouseNameData:{
              area: [],
              id:'',
              name: '', // 楼盘名字
              address: '', // 详细地址
              nearSubWay: [], // 地铁站ID集合 （数组）

              // stationName: this.selectedHouseNameData.stationName,// 地铁站站点
              
              stations: [], // 地铁站站点（数组）

              // distanceStation: this.selectedHouseNameData.distanceStation,// 距离站点

              apply: 0, // 用途
              type: 0, // 类型
              property: 0, // 产权
              costs: '', // 物业费
              costsType: 0, // 物业费缴费结算方式
              developer: '', // 开发商
              company: '', // 物业公司
              parking: '', // 车位
              totalUsers: '', // 总人数
              volumeRate: '',// 容积率
              greeningRate: '', // 绿化率
              electricityFee: '',//  电费单价
              waterFee: '', // 水费单价
              description: '', // 描述
              nearSubWayName: '', //附近站点
              nearSubWayNameString:'',
              houseAge: '',
            },
            subwayFrom:{},
            // houseTotal:1,
            // housetPage:1,
            areaDataList:[],
            houseTypeList:[
               {value:0,label:'住宅'},
               {value:1,label:'写字楼'},
               {value:2,label:'商铺'},
               {value:3,label:'商住两用'},
               {value:4,label:'厂房'},
               {value:5,label:'土地'},
               {value:6,label:'其他'},
               {value:7,label:'车库'},
               {value:8,label:'住宅低商'}
            ],
            useTypeList:[
               {value:0,label:'高层'},
               {value:1,label:'小高层'},
               {value:2,label:'复式'},
               {value:3,label:'私房'},
               {value:4,label:'别墅'},
               {value:5,label:'多层'},
               {value:6,label:'公寓'},
               {value:7,label:'顶+阁'},
               {value:8,label:'底+院'},
               {value:9,label:'其他'}
            ],
            houseSelfList:[
               {value:0,label:'商品房'},
               {value:1,label:'经济适用房'},    
               {value:2,label:'房改房'},
               {value:3,label:'安置房'},    
               {value:4,label:'回迁房'},
               {value:5,label:'集体房'},    
               {value:6,label:'其他'}
            ],
            quarterList:[
               {value:0,label:'每月'},
               {value:1,label:'每天'},    
               {value:2,label:'每年'},          
            ],
            subwayList:[],
            subwayLineStation:[]
        }
    },
    watch:{
      'selectedHouseNameData.area'(newValue,oldValue){
        
        if(!newValue || newValue.length<1) return
        if(JSON.stringify(newValue) != JSON.stringify(oldValue)) this.nearSubwayStationData = []
         this.cityId = newValue[0]
         if(typeof(this.cityId)=='string') this.cityId = ''
         subwayFindSubway({regionId:this.cityId}).then(res=>{
           this.subwayList = []
           if(res.body.length<1) return
           res.body.map(o=>{
             const subway = {
               value: o.subwayId,
               label: o.subwayLine
             }
             this.subwayList.push(subway)

           })
         })
      },
      'subwayFrom.nearSubwayLine'(newValue,oldValue){
        this.subwayFrom = {
          nearSubwayStation:'',
          nearSubwayLine: newValue,
          distance:''
        }
        this.subwayLineStation = []
        subwayFindStation({subwayId:newValue}).then(res=>{
          if(res.body.length<1)  return
          const newStationList = []
          res.body.map(o=>{
           const newStation = {
             value: o.stationId,
             label: o.stationName
           }
           newStationList.push(newStation)
          })
          this.subwayLineStation = newStationList
        })
      }
    },
    methods:{
      nearSubWayClick(){
        this.nearSubwayStationData = this.curreySubwayStationData
        this.dialogVisible = true
      },
        queryClick(name){
          if(!name){
            this.$message({
            type: 'error',
            message: '请输入楼盘名称'
            })
            return   
          }
          buildingFindByName({name:name}).then(res=>{
            if(res.code == 1000) {
              this.$message({
              type: 'success',
              message: '该名称可用'
              })
            }else{
              this.$message({
              type: 'error',
              message: '该名称已被占用'
              })
            }
          }).catch(error => {

          })
        },
        saveSubwayClick(){ //保存线路
          let stuffStatus = true
          if(this.nearSubwayStationData.length>0){
            this.nearSubwayStationData.map(o=>{
              if(o.nearSubwayStation == this.subwayFrom.nearSubwayStation){
                this.$message({
                type: 'error',
                message: '该站点名称已被使用'
                })
                stuffStatus = false
                return
              }                
            })
          }
          if(!stuffStatus) return
          let subwayName= ""
          if(this.subwayList.length>0){
            this.subwayList.map(o=>{
              if(o.value == this.subwayFrom.nearSubwayLine){
                 subwayName = o.label
              }
            })
          }
          let subwayStationName= ""
          if(this.subwayLineStation.length>0){
            this.subwayLineStation.map(j=>{
              if(j.value == this.subwayFrom.nearSubwayStation){
                 subwayStationName = j.label
              }
            })
          }
          this.subwayFrom ={
            nearSubwayStation:this.subwayFrom.nearSubwayStation,
            nearSubwayLine: this.subwayFrom.nearSubwayLine,
            distance:this.subwayFrom.distance,
            subwayName:subwayName,
            subwayStationName:subwayStationName
          }
          this.nearSubwayStationData.push(this.subwayFrom)
          let nearSubWayNameLsit = []
          let nearSubWayNameLsitName = []
          this.nearSubwayStationData.map(o=>{
            const newStations = o.subwayStationName
            nearSubWayNameLsitName.push(newStations)
            nearSubWayNameLsit.push(o.nearSubwayLine)
          })
          this.subwayFrom = {}
          this.selectedHouseNameData.nearSubWayNameString = nearSubWayNameLsitName.join(',')
          this.selectedHouseNameData.nearSubWayName = nearSubWayNameLsit.join(',')
        },
        deleteSubwayClick(row){ //删除站点
         this.nearSubwayStationData.forEach((o,i,arr)=>{
           if(row.nearSubwayStation == o.nearSubwayStation){
              arr.splice(i, 1)
              if(arr.length<1){
                this.selectedHouseNameData.nearSubWayNameString = ''
                this.selectedHouseNameData.nearSubWayName = ''
                return
              }
              let nearSubWayNameLsit = []
              let nearSubWayNameLsitName = []
              this.nearSubwayStationData.map(o=>{
                const newStations = o.subwayStationName
                nearSubWayNameLsitName.push(newStations)
                nearSubWayNameLsit.push(o.nearSubwayLine)
              })
              this.selectedHouseNameData.nearSubWayNameString = nearSubWayNameLsitName.join(',')
              this.selectedHouseNameData.nearSubWayName = nearSubWayNameLsit.join(',')
           }
         })
        
          let nearSubWayNameLsit = []
          this.nearSubwayStationData.map(o=>{
            nearSubWayNameLsit.push(o.nearSubwayLine)
          })
          this.subwayFrom = {}
          this.selectedHouseNameData.nearSubWayName = nearSubWayNameLsit.join(',')
        },
        houseClick(val){

        },
        houseNameQueryClick(i){
          i.area ? this.searchHouseForm.newArea = i.area.join('.'): i=""
          this.currentPage = 1
          this.buildingFind({name:this.searchHouseForm.houseName,page:this.currentPage,regionQs:this.searchHouseForm.newArea})
        },
        houseNameBuildClick(){ //新建
          this.dialoghouseNameVisible = true
          this.diaHouseNameTitle = '新增楼盘名称'
          this.type = 1
            this.nearSubwayStationData =[]
          this.$nextTick(() => {
              
              this.selectedHouseNameData = {
                area: [],
                id:'',
                name: '', // 楼盘名字
                address: '', // 详细地址
                nearSubWay: [], // 地铁站ID集合 （数组）
                stations: [], // 地铁站站点（数组）
                apply: 0, // 用途
                type: 0, // 类型
                property: 0, // 产权
                costs: '', // 物业费
                costsType: 0, // 物业费缴费结算方式
                developer: '', // 开发商
                company: '', // 物业公司
                parking: '', // 车位
                totalUsers: '', // 总人数
                volumeRate: '',// 容积率
                greeningRate: '', // 绿化率
                electricityFee: '',//  电费单价
                waterFee: '', // 水费单价
                description: '', // 描述
                nearSubWayName: '', //附近站点
                nearSubWayNameString:'',
                houseAge: '',
              }
              this.$refs['ruleForm'].resetFields()
              this.curreySubwayStationData = []
          })
        },
        handleCurrentChange(val){
          this.currentPage = val
          this.buildingFind({name:this.searchHouseForm.houseName,page:this.currentPage,regionQs:this.searchHouseForm.newAreas})
        },
        houseNamechangeClick(row){ //修改
          this.dialoghouseNameVisible = true
          this.$nextTick(()=>{
            this.$refs['ruleForm'].resetFields()
          })

          this.diaHouseNameTitle = '修改楼盘名称'
          this.type = 2
          this.selectedHouseNameData = Object.assign({},row)
          
          const regionQs = this.selectedHouseNameData.regionQs.split(".")
          const area = []
          regionQs.map(o=>{
            area.push(Number(o))
          })
          
          const newData = `${this.selectedHouseNameData.startYear}-01-01 00:00:00:000`
          const date = new Date(newData)
          this.nearSubwayStationData = []
         row.subwayList.map(o=>{
          const nearSubwayStation = {
            nearSubwayStation:o.stationId,
            nearSubwayLine: o.subwayId,
            distance:o.stationDistance,
            subwayName:o.subwayLine,
            subwayStationName:o.stationName
          }
           this.nearSubwayStationData.push(nearSubwayStation)
         })
          this.curreySubwayStationData = [...this.nearSubwayStationData]
          
          let nearSubWay = this.selectedHouseNameData.nearSubWay
          if(nearSubWay && nearSubWay.length>0) nearSubWay = nearSubWay.join(",")
          else nearSubWay = ''
          this.selectedHouseNameData ={
            nearSubWayName: nearSubWay, //附近站点
            nearSubWayNameString:this.selectedHouseNameData.newSubwaystationAll,
            houseAge: Date.parse(date),
            area: area,
            id:this.selectedHouseNameData.id,
            name: this.selectedHouseNameData.name, // 楼盘名字
            address: this.selectedHouseNameData.address, // 详细地址
            nearSubWay: this.selectedHouseNameData.nearSubWay, // 地铁站ID集合 （数组）
            // stationName: this.selectedHouseNameData.stationName,// 地铁站站点
            stations: this.selectedHouseNameData.stationName, // 地铁站站点（数组）
            // distanceStation: this.selectedHouseNameData.distanceStation,// 距离站点
            apply: this.selectedHouseNameData.apply, // 用途
            type: this.selectedHouseNameData.type, // 类型
            property: this.selectedHouseNameData.property, // 产权
            costs: this.selectedHouseNameData.costs, // 物业费
            costsType: Number(this.selectedHouseNameData.costsType), // 物业费缴费结算方式
            developer: this.selectedHouseNameData.developer, // 开发商
            company: this.selectedHouseNameData.company, // 物业公司
            parking: this.selectedHouseNameData.parking, // 车位
            totalUsers: this.selectedHouseNameData.totalUsers, // 总人数
            volumeRate: this.selectedHouseNameData.volumeRate,// 容积率
            greeningRate: this.selectedHouseNameData.greeningRate, // 绿化率
            electricityFee: this.selectedHouseNameData.electricityFee,//  电费单价
            waterFee: this.selectedHouseNameData.waterFee, // 水费单价
            description: this.selectedHouseNameData.description, // 描述
          }
        },
        houseNamedeleteClick(row){ //删除
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dictionaryFindEdifice(row.id,(count)=>{
               if(count){
                  this.$message({
                    type: 'error',
                    message: '该楼盘下存在楼号信息列表，不可删除'
                  })                 
               }else{
                buildingRemove({id:row.id}).then(res=>{
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  })
                  this.currentPage = 1
                  this.buildingFind({page:this.currentPage})
                })
               }
            })

            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
        },
    regionFindAllTree(callBack){
        regionFindAllTree().then(res => {
        if(!res.body) return
        this.cityData = res.body;
        if(res.body.length>0){
          this.cityAllData =[...res.body]
          this.cityData[0].children ? (this.areaData = this.cityData[0].children) : (this.areaData = []);
          this.areaData.length>0 ? this.areaParentId = this.areaData[0].parentId : this.areaParentId = ''
          this.areaData.length>0 ? (this.sliceData = this.areaData[0].children) : (this.sliceData = []);
          this.cityAllData.map(o=>{
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
        }else{
          this.cityData = []
          this.areaData = []
          this.sliceData = []
        }
        callBack(this.cityAllData)
        });
    },
        buildingFind(data={}){
          buildingFind(data).then(res=>{
            this.total = res.body.total
            this.regionFindAllTree((data)=>{
              this.areaDataList = data
            // this.areaDataList = this.$store.getters.areaData
            res.body.rows.map(o=>{
              let regionQs
              o.regionQs ? regionQs = o.regionQs.split('.'): regionQs=null
              this.areaDataList.map((j)=>{
                if(!regionQs) return
                if(j.id == regionQs[0]){
                  o.city = j.label
                  if(!j.children) return
                  j.children.map(k=>{
                    if(k.id == regionQs[1]){
                      o.area = k.label
                      if(!k.children) return
                      k.children.map(c=>{
                        if(c.id == regionQs[2]){
                          o.slice = c.label
                        }
                      })
                    }

                  })
                }
              })
              this.houseTypeList.map(j=>{
                if(j.value == o.apply){
                  o.apply = j.label
                }
              })

              this.useTypeList.map(j=>{
                if(j.value == o.type){
                  o.type = j.label
                }
              })

              this.houseSelfList.map(j=>{
                if(j.value == o.property){
                  o.property = j.label
                }
              })
            })
            })

            // console.log(res.body.rows[3].subwayList)
            this.houseNameData = res.body.rows
            this.houseNameData.map(k=>{
               let newSubwaystationList = []
               let newStationDistance = []
               k.subwayList.map(j=>{
                  newSubwaystationList.push(j.stationName)
                  newStationDistance.push(j.stationDistance)
               })
               k.newSubwaystationAll = newSubwaystationList.join(",")
               k.newStationDistanceAll = newStationDistance.join(",")
            })
          })
        },
        dictionaryFindEdifice(superiorId,callBack){
          dictionaryFindEdifice({superiorId,page:1}).then(res=>{
            callBack(res.body.total)
          })
        },
        submit(){ //新增、修改

        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
        const newArea = this.selectedHouseNameData.area ? this.selectedHouseNameData.area : []
          let houseAge;
          if(this.selectedHouseNameData.houseAge){
            if(!this.selectedHouseNameData.houseAge.toString().length){
              houseAge = this.selectedHouseNameData.houseAge
            }else{
              houseAge = new Date(this.selectedHouseNameData.houseAge).getFullYear()
            }
          }else{
             houseAge = undefined
          }
        let newNearSubWay =[]
        let newStations =[]
        this.nearSubwayStationData.map(o=>{
           newNearSubWay.push(o.nearSubwayLine)
            const newStationsObj ={
               distance: o.distance,
               stationId: o.nearSubwayStation
            }
            newStations.push(newStationsObj)
        })
          const params = {
            name: this.selectedHouseNameData.name, // 楼盘名字
            regionId: newArea[newArea.length -1], // 片区ID
            address: this.selectedHouseNameData.address, // 详细地址
            nearSubWay: newNearSubWay, // 地铁站ID集合 （数组）
            // stationName: this.selectedHouseNameData.stationName,// 地铁站站点
            stations: newStations, // 地铁站站点（数组）
            // distanceStation: this.selectedHouseNameData.distanceStation,// 距离站点
            apply: this.selectedHouseNameData.apply, // 用途
            type: this.selectedHouseNameData.type, // 类型
            startYear: houseAge, // 物业交房年 [房龄(current year - start year)]
            // struct: this.selectedHouseNameData.houseType, // 结构
            property: this.selectedHouseNameData.property, // 产权
            costs: this.selectedHouseNameData.costs, // 物业费
            costsType: this.selectedHouseNameData.costsType, // 物业费缴费结算方式
            developer: this.selectedHouseNameData.developer, // 开发商
            company: this.selectedHouseNameData.company, // 物业公司
            parking: this.selectedHouseNameData.parking, // 车位
            totalUsers: this.selectedHouseNameData.totalUsers, // 总人数
            volumeRate: this.selectedHouseNameData.volumeRate,// 容积率
            // status: this.selectedHouseNameData.houseType, // 状态(-1:删除; 0:不可用; 1正常)
            greeningRate: this.selectedHouseNameData.greeningRate, // 绿化率
            electricityFee: this.selectedHouseNameData.electricityFee,//  电费单价
            waterFee: this.selectedHouseNameData.waterFee, // 水费单价
            description: this.selectedHouseNameData.description, // 描述
          }
        if(this.type == 1){
          buildingSave(params).then(res=>{
                this.$message({
                type: 'success',
                message: '新增成功'
                })
                this.dialoghouseNameVisible = false
                this.currentPage = 1
                this.buildingFind({page:this.currentPage})
          })
        }else{
          params.id = this.selectedHouseNameData.id
          buildingUpdate(params).then(res=>{
                this.$message({
                type: 'success',
                message: '修改成功'
                })
                this.dialoghouseNameVisible = false  
                this.currentPage = 1
                this.buildingFind({page:this.currentPage})
          })
        }

        }
        })
        },
        refresh(){ //刷新
          this.searchHouseForm = {}
          this.buildingFind()
        }
    },
    created(){
       this.buildingFind()
    }
}
</script>