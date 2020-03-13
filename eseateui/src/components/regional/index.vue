<template>
  <div>
    <!-- 第一级：市 -->
    <el-form ref="form" :model="searchForm" label-width="100px" size="small" :inline="true">
      <el-form-item label="第一级：城市">
        <el-input placeholder="请输入城市名称查找" v-model="searchForm.searchCity"></el-input>
        <el-button @click="sliceQueryClick(searchForm.searchCity, 1)" type="primary" size="small">查询</el-button>
        <el-button @click="sliceBuildClick(1)" type="primary" size="small">新建</el-button>
      </el-form-item>
    </el-form>
    <el-table 
      highlight-current-row 
      @current-change="handleCurrentChange" 
      :data="cityData" 
      border 
      ref="interfaceTableCity"
      height="300">
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="name" label="城市"></el-table-column>
      <el-table-column prop="tag" label="拼音简码"></el-table-column>
      <!-- <el-table-column prop="parentName" label="上级"></el-table-column> -->
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope" class="flex-center btn-style">
          <el-button @click="sliceBuildClick(2,scope.row)" type="primary" size="small">新建区/县</el-button>
          <el-button @click="changeClick(scope.row, 1)" type="text" size="small">修改</el-button>
          <el-button
            @click="deleteClick(scope.$index, scope.row, 1)"
            type="text"
            size="small"
            style="color:red;"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider></el-divider>
    <!-- 第二级：区/县 -->

    <el-form ref="form" :model="searchForm" label-width="110px" size="small" :inline="true">
      <el-form-item label="第二级：区/县">
        <el-input placeholder="请输入区/县名称查找" v-model="searchForm.searchArea"></el-input>
        <el-button @click="sliceQueryClick(searchForm.searchArea, 2)" type="primary" size="small">查询</el-button>
        <!-- <el-button @click="sliceBuildClick(2)" type="primary" size="small">新建</el-button> -->
      </el-form-item>
    </el-form>
    <el-table 
      :data="areaData" 
      highlight-current-row 
      @current-change="handleCurrentChangeArea" 
      ref="interfaceTableArea"
      border 
      height="300">
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="name" label="区/县"></el-table-column>
      <el-table-column prop="tag" label="拼音简码"></el-table-column>
      <el-table-column prop="parentName" label="上级"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope" class="flex-center btn-style">
          <el-button @click="sliceBuildClick(3,scope.row)" type="primary" size="small">新建片区</el-button>
          <el-button @click="changeClick(scope.row, 2)" type="text" size="small">修改</el-button>
          <el-button
            @click="deleteClick(scope.$index, scope.row, 2)"
            type="text"
            size="small"
            style="color:red;"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider></el-divider>
    <!-- 第三级：片区 -->
    <el-form ref="form" :model="searchForm" label-width="100px" size="small" :inline="true">
      <el-form-item label="第三级：片区 ">
        <el-input placeholder="请输入片区名称查找" v-model="searchForm.searchSlice"></el-input>
        <el-button @click="sliceQueryClick(searchForm.searchSlice, 3)" type="primary" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table 
      :data="sliceData" 
      highlight-current-row 
      ref="interfaceTableSlice"
      border height="300">
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="name" label="区/县"></el-table-column>
      <el-table-column prop="tag" label="拼音简码"></el-table-column>
      <el-table-column prop="parentName" label="上级"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope" class="flex-center btn-style">
          <el-button @click="changeClick(scope.row, 3)" type="text" size="small">修改</el-button>
          <el-button
            @click="deleteClick(scope.$index, scope.row, 3)"
            type="text"
            size="small"
            style="color:red;"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

		<!-- 修改市/区/县/片区等信息提示框 -->
    <el-dialog
      :title="diaTitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
			:show-close="false"
			:close-on-press-escape="false"
			>
      <el-form :model="selectedData" label-width="100px">
        <el-form-item v-if="selectedData.type == '1'" label="城市：" prop="city">
          <el-input v-model="selectedData.city" style="width: 300px;"></el-input>
        </el-form-item>
				<el-form-item v-else-if="selectedData.type == '2'" label="区/县：" prop="area">
							<el-input v-model="selectedData.area" style="width: 300px;"></el-input>
						</el-form-item>
				<el-form-item v-else label="片区：" prop="slice">
          <el-input v-model="selectedData.slice" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="拼音简码：" prop="abbreviation">
          <el-input v-model="selectedData.abbreviation" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="上级区域：" v-if="selectedData.type > 1" prop="manageCity">
            <el-input v-model="selectedData.manageCity" style="width: 300px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="desc">
          <el-input type="textarea" v-model="selectedData.desc" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="regionSaveMsg(selectedData.id,selectedData.type)" style="width: 150px;">保 存</el-button>
        <el-button @click="dialogFormVisible = false" style="width: 150px;">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { regionFind, regionSave, regionFindAllTree,regionUpdate,regionRemove } from "@/api/org-house";
import { debuglog } from 'util';
export default {
  data() {
    return {
      searchForm: {
        searchCity: "",
        searchArea: "",
        searchSlice: ""
      },
      cityAllData: [],
      cityData: [],
      areaData: [],
      sliceData: [],
      dialogFormVisible: false,
      diaTitle: '',
      selectedData:{},
      areaParentId: null,
      currenyData:{}
    };
  },
  watch: {
    cityData: function() {
      this.$nextTick(function() {
        if (this.cityData) {
          this.$refs.interfaceTableCity.setCurrentRow(this.cityData[0])
        }
      })
    },
    areaData: function() {
      this.$nextTick(function() {
        if (this.areaData) {
          this.$refs.interfaceTableArea.setCurrentRow(this.areaData[0])
        }
      })
    },
    sliceData: function() {
      this.$nextTick(function() {
        if (this.sliceData) {
          this.$refs.interfaceTableSlice.setCurrentRow(this.sliceData[0])
        }
      })
    },
  },                      
  methods: {
    sliceQueryClick(name,i) { //查询
    let params
    switch (i) {
        case 1:
            params = {
                level:1,
                parent:null,
                name:name === '' ? '' : name
            }
            break;
        case 2:
            params = {
                level:2,
                parent:this.areaParentId,
                name:name === '' ? '' : name
            }
            break;
        case 3:
            params = {
                level:3,
                parent:this.areaParentId,
                name:name === '' ? '' : name
            }
            break;
        default:
            break;
    }
      this.regionFind(params,i)
    },
    sliceBuildClick(i,row) {
        this.selectedData.type = i
        switch (i) {
            case 1:
                this.diaTitle = '新建城市'
                break;
            case 2:
                this.diaTitle = '新建区/县'
                this.selectedData = {
                    area: '',
                    abbreviation: '',
                    desc: '',
                    manageCity:row.name,
                    type: i,
                    parentId:row.id
                }
                break;
            case 3:
                this.diaTitle = '新建片区'
                this.selectedData = {
                    abbreviation: '',
                    desc:'',
                    manageCity:row.name,
                    type: i,
                    parentId: row.id
                }
                break;      
            default:
                break;
        }
        this.dialogFormVisible = true   
    },
    handleCurrentChange(val) {
      if(!val) return
      this.areaParentId = val.id
      let params
      params = {
          level:2,
          parent:val.id,
          name:name === '' ? '' : name
      }
      this.regionFind(params,2)
      // if(val.children){
      //   val.children ? this.areaData = val.children : this.areaData = []
      //   if(this.areaData) this.areaData[0] ? this.sliceData = this.areaData[0].children : this.sliceData = []
      // }else{
      //   this.areaData = []
      // }
    },
    handleCurrentChangeArea(val){
      if(!val) return
      this.areaParentId = val.id
      let params
      params = {
          level:3,
          parent:val.id,
          name:name === '' ? '' : name
      }
      this.regionFind(params,3)
      // this.sliceData = val.children
    },
    deleteClick(index, row, type){ //删除
		this.$confirm('是否删除?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
		})
		.then(() => {
      const typeNew = type + 1
      this.regionFind1({level:typeNew,parent:row.id},typeNew,count=>{
        if(count){
          let message = '该城市下存在区/县列表，不可删除'
          if(type ==2) message = '该区/县下存在片区列表，不可删除'
          this.$message({
              type: 'error',
              message: message
          })          
        }else{
          regionRemove({id:row.id}).then(res=>{
              this.$message({
                  type: 'success',
                  message: '删除成功'
              })
            this.regionFind({level:type,parent:row.parentId},type)
          })
        }
      })

    }).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				})
			})
    },
    changeClick(row, id) {
        this.dialogFormVisible = true
        this.selectedData ={}
        switch (id) {
            case 1:
                this.diaTitle = '修改城市'
                this.selectedData = {
                    city: row.name,
                    abbreviation: row.tag,
                    desc: row.description,
                    type: id,
                    id: row.id
                }
                break;
            case 2:
                this.diaTitle = '修改区/县'
                // this.currenyData = row
                this.selectedData = {
                    area: row.name,
                    abbreviation: row.tag,
                    desc: row.description,
                    manageCity:row.parentName,
                    parentId:row.parentId,
                    type: id,
                    id: row.id
                }
                break;
            case 3:
                this.diaTitle = '修改片区'
                this.selectedData = {
                    slice: row.name,
                    abbreviation: row.tag,
                    desc: row.description,
                    manageCity:row.parentName,
                    parentId:row.parentId,
                    type: id,
                    id: row.id
                }
                break;      
            default:
                break;
        }
    },
    regionSaveMsg(id,typeIndex) {
        const {abbreviation,parentId,desc,type} = this.selectedData
			let params
            switch (type) {
                case 1:
                    params = {
                        description: desc,
                        name: this.selectedData.city,
                        parent: null,
                        tag: abbreviation   
                    }
                    break;
                case 2:
                    params = {
                        description: desc,
                        name: this.selectedData.area,
                        parent:  parentId,
                        tag: abbreviation   
                    }
                    break;    
                case 3:
                    params = {
                        description: desc,
                        name: this.selectedData.slice,
                        parent:  parentId,
                        tag: abbreviation   
                    }
                    break;
                default:
                    break;
            }
            if(id){
                params.id = id
                regionUpdate(params).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '编辑成功'
                    })
                    this.dialogFormVisible = false
                    this.regionFind({level:typeIndex,parent:params.parent},type,id)
                    
                })
            }else{
                regionSave(params).then(res=>{
                    this.$message({
                        type: 'success',
                        message: '新增成功'
                    })
                    this.dialogFormVisible = false
                    this.regionFind({level:typeIndex,parent:params.parent},type,id)
                })
            }
    },
    regionFind1(data,i,callBack){
        regionFind(data).then(res=>{
            switch (i) {
                case 2:
                      callBack(res.body.length)
                    break;
                case 3:
                      callBack(res.body.length)
                    break;  
                case 4:
                      callBack(res.body.length)
                    break;          
                default:
                    break;
            }
        })
    },
    regionFind(data,i,id){
        regionFind(data).then(res=>{
            switch (i) {
                case 1:
                    res.body.map(o=>{
                      if(!o.children) o.children =[]
                    })
                    if (res.body.length > 0) {
                      this.cityData = res.body
                      if(id){
                        this.regionFind({level:2,parent:id}, 2)
                      }else{
                         this.regionFind({level:2,parent:res.body[0].id}, 2)
                      }
                    }else {
                      this.cityData = [];
                      this.areaData = [];
                      this.sliceData = []
                    }
                    break;
                case 2:
                    if (res.body.length > 0) {
                      this.areaData = res.body;
                      if(id){
                        this.regionFind({level:3,parent:id},3)
                      }else{
                         this.regionFind({level:3,parent:res.body[0].id}, 3)
                      }
                    }else {
                      this.areaData = [];
                      this.sliceData = []
                    }
                    break;
                case 3:
                    if(res.body){
                      this.sliceData = res.body;
                    }else{
                      this.sliceData = []
                    }
                    break;          
                default:
                    break;
            }
        })
    },
    regionFindAllTree(){
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

        this.$store.commit('AREA',this.cityAllData)
        });
    }

  },
  created() {
    this.regionFindAllTree()
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
  padding-bottom: 20px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #67c23a;
  line-height: 36px;
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
