<template>
  <div class="subway">
    <!-- 第一级：线路 -->
    <el-form ref="form" :model="searchDictForm" label-width="100px" size="small" :inline="true">
      <el-form-item label="第一级：线路">
        <!-- <el-input placeholder="请输入城市名称查找" style="width: 150px;" v-model="searchDictForm.searchCity"></el-input> -->
        <el-select v-model="searchDictForm.searchCity" placeholder="请选择">
          <el-option v-for="item in optionCity" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-input placeholder="请输入线路名称查找" style="width: 150px;" v-model="searchDictForm.searchLine"></el-input>
        <el-button @click="subwayQueryClick(searchDictForm,1)" type="primary" size="small">查询</el-button>
        <el-button @click="subwayBuildClick(1)" type="primary" size="small">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table 
      :data="citySubwayData" 
      highlight-current-row 
      border height="300" 
      ref="interfaceTableCitySubway"
      @current-change="handleCurrentChange">
      <el-table-column type="index" width="100" label="序号"></el-table-column>
      <el-table-column prop="subwayLine" label="线路"></el-table-column>
      <el-table-column prop="regionName" label="城市"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope" class="flex-center btn-style">
          <el-button @click="subwayBuildClick(2,scope.row)" type="primary" size="small">新增站点</el-button>
          <el-button @click="changeSubwayClick(scope.row, 1)" type="text" size="small">修改</el-button>
          <el-button
            @click="deleteSubwayClick(scope.row, 1)"
            type="text"
            size="small"
            style="color:red;"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider></el-divider>
    <!-- 第二级：站点 -->
    <el-form ref="form" :model="searchSiteForm" label-width="100px" size="small" :inline="true">
      <el-form-item label="第二级：站点">
        <el-input placeholder="请输入站点名称查找" v-model="searchSiteForm.searchPoint"></el-input>
        <el-button @click="subwayQueryClick(searchSiteForm,2)" type="primary" size="small">查询</el-button>
        <!-- <el-button @click="subwayBuildClick(2)" type="primary" size="small">新建</el-button> -->
      </el-form-item>
    </el-form>
    <el-table 
      :data="subwayPointData" 
      ref="interfaceTableSubwayPoint"
      highlight-current-row border height="350">
      <el-table-column type="index" width="100" label="序号"></el-table-column>
      <el-table-column prop="stationName" label="站点"></el-table-column>
      <el-table-column prop="subwayLine" label="线路"></el-table-column>
      <el-table-column prop="regionName" label="城市"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope" class="flex-center btn-style">
          <el-button @click="changeSubwayClick(scope.row, 2)" type="text" size="small">修改</el-button>
          <el-button
            @click="deleteSubwayClick(scope.row, 2)"
            type="text"
            size="small"
            style="color:red;"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 城市地铁新建/修改信息提示框 -->
    <el-dialog
      :title="diaSubwayTitle"
      :visible.sync="dialogCitySubwayVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <el-form :model="selectedCitySubwayData" label-width="100px">
        <el-form-item label="线路：" prop="line" style="width: 300px;">
          <el-input
            v-if="selectedCitySubwayData.selectedIndex > 1"
            v-model="selectedCitySubwayData.line"
            disabled
            style="width: 300px;"
          ></el-input>
          <el-input v-else v-model="selectedCitySubwayData.line" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="城市：" prop="city">
          <el-select
            style="width: 300px;"
            v-model="selectedCitySubwayData.city"
            placeholder="请选择"
            v-if="selectedCitySubwayData.selectType"
          >
            <el-option
              v-for="item in optionCity1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

          <el-select style="width: 300px;" v-model="selectedCitySubwayData.city" disabled placeholder="请选择" v-else>
            <el-option
              v-for="item in optionCity1"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

        </el-form-item>
        <el-form-item v-if="selectedCitySubwayData.selectedIndex == 2" label="站点名称：" prop="city">
          <el-input v-model="selectedCitySubwayData.point" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="描述：" v-if="selectedCitySubwayData.selectedIndex == 1" prop="desc">
          <el-input type="textarea" v-model="selectedCitySubwayData.desc" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button
          type="primary"
          @click="saveSubway(selectedCitySubwayData)"
          style="width: 150px;"
        >保 存</el-button>
        <el-button @click="dialogCitySubwayVisible = false" style="width: 150px;">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  subwayFindSubway,
  subwayFindStation,
  subwaySubwayCity,
  subwaySaveStation,
  subwaySaveSubway,
  subwayUpdateSubway,
  subwayUpdateStation,
  subwayRemoveSubway,
  subwayRemoveStation
} from "@/api/org-house";
import { debuglog } from "util";
import { EWOULDBLOCK } from "constants";
export default {
  data() {
    return {
      citySubwayData: [],
      searchDictForm: {
        searchCity: "",
        searchLine: ""
      },
      searchSiteForm: {},
      dialogCitySubwayVisible: false,
      diaSubwayTitle: "",
      selectedCitySubwayData: {},
      subwayPointData: [],
      optionCity: [
        {
          id: "",
          name: "全部"
        }
      ],
      optionCity1: [],
      currentRow: {}
    };
  },
  watch: {
    citySubwayData: function() {
      this.$nextTick(function() {
        if (this.citySubwayData) {
          this.$refs.interfaceTableCitySubway.setCurrentRow(this.citySubwayData[0])
        }
      })
    },
    subwayPointData: function() {
      this.$nextTick(function() {
        if (this.subwayPointData) {
          this.$refs.interfaceTableSubwayPoint.setCurrentRow(this.subwayPointData[0])
        }
      })
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
      this.subwayFindStation({ line: val.subwayLine });
    },
    subwayQueryClick(data, index) {
      //查询
      if (index < 2) {
        const params = {
          line: data.searchLine,
          regionId: data.searchCity
        };
        this.subwayFindSubway(params);
      } else {
        const { subwayLine, regionId } = this.currentRow;
        //  this.subwayFindStation({line:subwayLine,regionId:regionId,stationName: data.searchPoint})
        this.subwayFindStation({stationName: data.searchPoint});
      }
    },
    deleteSubwayClick(row, i) {
      //删除
      this.$confirm("此操作将永久删除该岗位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (i == 1) {
            this.subwayFindStation1({line: row.subwayLine,regionId: row.city,stationName: ""},call=>{
              if(call){
                this.$message({
                  type: "error",
                  message: "该地铁线路下存在站点信息，不可删除"
                });                
              }else{
                subwayRemoveSubway({ id: row.subwayId }).then(res => {
                  this.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  this.subwayFindSubway({}, 2);
                  this.subwayFindStation({line: row.subwayLine,regionId: row.city,stationName: ""});
                });
              }

            })

          } else {
            subwayRemoveStation({ id: row.stationId }).then(res => {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.subwayFindStation({line: row.subwayLine,regionId: row.city,stationName: ""});
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    saveSubway(row) {
      //新增/编辑地铁确认
      if (this.selectedCitySubwayData.selectedIndex == 1) {
        if (this.selectedCitySubwayData.type == 1) {
          subwaySaveSubway({
            line: row.line,
            regionId: row.city,
            description: row.desc
          }).then(res => {
            this.$message({
              type: "success",
              message: "新增成功"
            });
            this.dialogCitySubwayVisible = false;
            this.subwayFindSubway({}, 1);
          });
        } else {
          subwayUpdateSubway({
            id: row.subwayId,
            line: row.line,
            regionId: row.city,
            description: row.desc
          }).then(res => {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.dialogCitySubwayVisible = false;
            this.subwayFindSubway({}, 2);
            this.subwayFindStation({line: row.line,regionId: row.city,stationName: ""});
          });
        }
      } else {
        //新增地铁站
        if (this.selectedCitySubwayData.type == 1) {
          subwaySaveStation({
            regionId: row.city,
            name: row.point,
            subwayId: row.subwayId
          }).then(res => {
            this.$message({
              type: "success",
              message: "新增成功"
            });
            this.dialogCitySubwayVisible = false;
            this.subwayFindStation({ line: row.line });
          });
        } else {
          subwayUpdateStation({
            name: row.point,
            subwayId: row.subwayId,
            id: row.id
          }).then(res => {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.dialogCitySubwayVisible = false;
            this.subwayFindStation({
              line: row.line,
              regionId: row.city,
              stationName: ""
            });
          });
        }
      }
    },
    subwayBuildClick(index,row) {
      this.dialogCitySubwayVisible = true;
      this.selectedCitySubwayData = {};
      this.currentRow = row
      if (index == 1) this.diaSubwayTitle = "新建线路";
      else this.diaSubwayTitle = "新建站点";
      this.selectedCitySubwayData = {
        line: index == 1 ? "" : row.subwayLine,
        city: index == 1 ? "" : row.regionId,
        name: index == 1 ? "" : row.name,
        subwayId: index == 1 ? "" : row.subwayId,
        selectedIndex: index,
        type: 1,
        selectType:''
      };
      if(index==1){
        this.selectedCitySubwayData.selectType = 1
      }
    },
    changeSubwayClick(row, i) {
      //修改
      if (i == 1) this.diaSubwayTitle = "修改线路";
      else this.diaSubwayTitle = "修改站点";
      this.dialogCitySubwayVisible = true;
      this.selectedCitySubwayData = {
        line: row.subwayLine,
        subwayId: row.subwayId,
        id: row.stationId,
        city: row.regionId,
        desc: row.subwayDescription,
        point: row.stationName,
        type: 2,
        selectedIndex: i,
        selectType:''
      };
      if(i==1){
        this.selectedCitySubwayData.selectType = 1
      }
    },
    subwayFindStation(data={}) {
      //查询站点
      subwayFindStation(data).then(res => {
        if(!res.body) return
        this.subwayPointData = res.body;
      });
    },
    subwayFindStation1(data={},callBack) {
      //查询站点
      subwayFindStation(data).then(res => {
        callBack(res.body.length)
        if(!res.body) return
        this.subwayPointData = res.body;
      });
    },
    subwayFindSubway(data={}, type = 1) {
      //查询线路
      subwayFindSubway(data).then(res => {
        if(!res.body) return
        this.citySubwayData = res.body;
        this.currentRow = res.body[0];
        if (type == 1) {
          if (res.body.length > 0) {
            const { subwayLine, regionId } = res.body[0];
            this.subwayFindStation({ line: subwayLine, regionId: regionId });
          } else {
            this.subwayPointData = [];
          }
        }
      });
    },
    subwaySubwayCity() {
      subwaySubwayCity().then(res => {
        if(!res.body) return
        this.optionCity1 = [...res.body];
        this.optionCity = this.optionCity.concat(res.body);
      });
    }
  },
  created() {
    this.subwayFindSubway();
    this.subwaySubwayCity();
  }
};
</script>
<style>
.subway .el-table--striped .el-table__body tr.el-table__row--striped.current-row td, 
.subway .el-table__body tr.current-row>td {
	background-color: #ffec8b !important;
}
</style>
<style lang="scss" scoped>
.el-button-group {
  margin-left: 5px;
}
.el-input {
  width: 300px;
}
</style>