<!-- 楼盘名称，楼号，单元，楼层，门牌号 -->
<template>
  <div>
		<el-form-item label="楼盘名称">
      <el-select placeholder="请选择楼盘名称" v-model="cHouseId" filterable>
        <el-option v-for="(item, i) in houses" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
		<el-form-item label="楼号">
      <el-select placeholder="请选择楼号" v-model="cFloorId" :disabled="(cHouseId) ? false: true">
        <el-option v-for="(item, i) in floores" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
		<el-form-item label="单元">
      <el-select placeholder="请选择单元" v-model="cUnitId" :disabled="(cFloorId && cHouseId) ? false: true">
        <el-option v-for="(item, i) in unites" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
		<el-form-item label="楼层">
      <el-select placeholder="请选择楼层" v-model="cFloorLayerId" :disabled="(cFloorId && cHouseId && cUnitId) ? false: true">
        <el-option v-for="(item, i) in floorLayeres" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
		<el-form-item label="门牌号">
      <el-select placeholder="请选择门牌号" v-model="cHouseNumberId" :disabled="(cFloorId && cHouseId && cUnitId && cFloorLayerId) ? false: true">
        <el-option v-for="(item, i) in houseNumberes" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
// import cnchar from "cnchar";
import {
  buildingFindAll,
  dictionaryFindEdifice,
  dictionaryFindUnit,
  dictionaryFindFlower,
  dictionaryFindFamily
} from "@/api/org-house";

export default {
	props: {
		buildingId: {
			type: String | Number
		},
		edificeId: {
			type: String | Number
		},
		unitId: {
			type: String | Number
		},
		flowerId: {
			type: String | Number
		},
		familyId: {
			type: String | Number
		}
	},
  components: { },
  data() {
    //这里存放数据
    return {
			houses: [],
			copyHouses: [],
			floores: [{name:"所有项", id: ""}],
			unites: [{name:"所有项", id: ""}],
			floorLayeres: [{name:"所有项", id: ""}],
			houseNumberes: [{name:"所有项", id: ""}],
			cHouseId: this.buildingId,
			cFloorId: this.edificeId,
			cUnitId: this.unitId,
			cFloorLayerId: this.flowerId,
			cHouseNumberId: this.familyId
		};
  },
  watch: {
		buildingId(val) {
			this.cHouseId = val
		},
		edificeId(val) {
			this.cFloorId = val
		},
		unitId(val) {
			this.cUnitId = val
		},
		flowerId(val) {
			this.cFloorLayerId = val
		},
		familyId(val) {
			this.cHouseNumberId = val
		},
		cHouseId(val) {
			if (val) {
				this.queryNextData(val,1)
				this.$emit("update:buildingId", val)
			}
			this.cFloorId = ""
			this.cUnitId = ""
			this.cFloorLayerId = ""
			this.cHouseNumberId = ""
		},
		cFloorId(val) {
			if (val) {
				this.queryNextData(val,2)
				this.$emit("update:edificeId", val)
			}
			this.cUnitId = ""
			this.cFloorLayerId = ""
			this.cHouseNumberId = ""
		},
		cUnitId(val) {
			if (val) {
				this.queryNextData(val,3)
				this.$emit("update:unitId", val)
			}
			this.cFloorLayerId = ""
			this.cHouseNumberId = ""
		},
		cFloorLayerId(val) {
			if (val) {
				this.queryNextData(val,4)
				this.$emit("update:flowerId", val)
			}
			this.cHouseNumberId = ""
		},
		cHouseNumberId(val) {
			this.$emit("update:familyId", val)
		}
	},
  //方法集合
  methods: {
		// 通过id 或者 name 查询下一级数据
		queryHouseAll(cname) {
			let params = {
				name: cname
			}
			this.floores = [{name:"所有项", id: ""}]
			this.unites = [{name:"所有项", id: ""}]
			this.floorLayeres = [{name:"所有项", id: ""}]
			this.houseNumberes = [{name:"所有项", id: ""}]

			buildingFindAll(params).then(res => {
				let { code, body } = res
				if (code == 1000) {
					// 楼盘名称
					this.houses = [ {name:"所有项", id: ""}, ...body ]
					this.copyHouses = Object.assign(body);
				}
			})
		},

		queryNextData(id, type) {
			let params = {
				superiorId: id
			}
			// 清空数组
			if (type == 1) {
				this.floores = [{name:"所有项", id: ""}]
				this.unites = [{name:"所有项", id: ""}]
				this.floorLayeres = [{name:"所有项", id: ""}]
				this.houseNumberes = [{name:"所有项", id: ""}]

				dictionaryFindEdifice(params).then(res => {
					let { code, body } = res
					if (code == 1000) {
						// 楼号名称
						this.floores = [{name:"所有项", id: ""}, ...body.rows]
					}
				})

			} else if (type == 2) {
				this.unites = [{name:"所有项", id: ""}]
				this.floorLayeres = [{name:"所有项", id: ""}]
				this.houseNumberes = [{name:"所有项", id: ""}]

				dictionaryFindUnit(params).then(res => {
					let { code, body } = res
					if (code == 1000) {
						// 单元
						this.unites = [{name:"所有项", id: ""}, ...body.rows]
					}
				})

			} else if (type == 3) {
				this.floorLayeres = [{name:"所有项", id: ""}]
				this.houseNumberes = [{name:"所有项", id: ""}]

				dictionaryFindFlower(params).then(res => {
					let { code, body } = res
					if (code == 1000) {
						// 楼层
						this.floorLayeres = [{name:"所有项", id: ""}, ...body.rows]
					}
				})

			} else if (type == 4) {
				this.houseNumberes = [{name:"所有项", id: ""}]

				dictionaryFindFamily(params).then(res => {
				let { code, body } = res
				if (code == 1000) {
					// 门牌号
					this.houseNumberes = [{name:"所有项", id: ""}, ...body.rows]
				}
			})
			}
		}
	},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
		this.queryHouseAll('')
	}
};
</script>
<style lang='scss' scoped>
div {
  display: inline;
}
.el-select__input {
	vertical-align: baseline;
}
</style>