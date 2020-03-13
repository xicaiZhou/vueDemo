<!-- 城市，区/县，片区 -->
<template>
  <div>
		<el-form-item label="城市">
      <el-select placeholder="请选择城市" v-model="cCityId">
        <el-option v-for="(item, i) in cites" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
		<el-form-item label="区/县">
      <el-select placeholder="请选择区/县" v-model="cZoneId" :disabled="(cCityId) ? false: true">
        <el-option v-for="(item, i) in zones" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
		<el-form-item label="商圈">
      <el-select placeholder="请选择" v-model="cPiceId" :disabled="(cZoneId && cCityId) ? false: true">
        <el-option v-for="(item, i) in pices" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { regionFind } from "@/api/org-house";
export default {
	props: {
		cityId: {
			type: String | Number
		},
		zoneId: {
			type: String | Number
		},
		piceId: {
			type: String | Number
    }
	},
  components: { },
  data() {
    //这里存放数据
    return {
			cites: [{name:"所有项", id: ""}],
			zones: [{name:"所有项", id: ""}],
			pices: [{name:"所有项", id: ""}],
			cCityId: this.cityId,
			cZoneId: this.zoneId,
			cPiceId: this.piceId
		};
  },
  watch: {
		cityId(val) {
			this.cCityId = val
		},
		zoneId(val) {
			this.cZoneId = val
		},
		piceId(val) {
			this.cPiceId = val
		},
		cCityId(val) {
			if (val) {
				this.queryNextData(2,val)
				this.$emit("update:cityId", val)
			}else {
				this.cPiceId = ""
			}
			this.cZoneId = ""
		},
		cZoneId(val) {
			if (val) {
				this.queryNextData(3,val)
				this.$emit("update:zoneId", val)
			}
			this.cPiceId = ""
		},
		cPiceId(val) {
			if (val) {
				this.$emit("update:piceId", val)
			}
		}
	},
  //方法集合
  methods: {
		// 通过id 和 name 查询下一级数据
		queryNextData(clevel,cparent) {
			let params = {
				level: clevel,
				parent: cparent
			}
			console.log("cparent========",cparent);
			console.log("clevel========",clevel);
			// 清空数组
			if (clevel !== 3) {
				this.zones = [{name:"所有项", id: ""}]
				this.pices = [{name:"所有项", id: ""}]
			} else if (clevel == 3) {
				this.pices = [{name:"所有项", id: ""}]
			}
			regionFind(params).then(res => {
				let { code, body } = res
				if (code == 1000) {
					if (clevel == 1) {
						// 城市
						this.cites = [{name:"所有项", id: ""}, ...body ]
					}else if (clevel == 2) {
						// 区/县
						this.zones = [{name:"所有项", id: ""}, ...body ]
					}else if (clevel == 3) {
						// 片区（商圈）
						this.pices = [{name:"所有项", id: ""}, ...body ]
					}
				}
			})
		}
	},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
		this.queryNextData(1, null, '')
	}
};
</script>
<style lang='scss' scoped>
div {
  display: inline;
}
</style>