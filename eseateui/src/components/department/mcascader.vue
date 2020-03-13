<template>
  <div>
    <!-- <el-form-item label="公司">
      <m-department :id="ccompanyId" @setId="setCompanyId"></m-department>
    </el-form-item>
    <el-form-item label="门店">
      <m-department
        v-if="show"
        :id="cstoreId"
        :parentId="parentId"
        @setId="setStoreId"
        :isstore="true"
      ></m-department>
    </el-form-item> -->
    <el-form-item :label="companyLabel">
      <el-select placeholder="请选择" v-model="ccompanyId">
        <el-option v-for="(item, i) in companys" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item :label="storeLabel">
      <el-cascader
        :placeholder="storeLabel == '门 店' ? '请选择' : '请选择分配门店' "
        v-model="cstoreId"
        clearable
        :show-all-levels="false"
        :options="storeOptions"
        :disabled="(ccompanyId) ? false: true"
      ></el-cascader>
    </el-form-item>
  </div>
</template>

<script>
import MDepartment from "@/components/department";
import { find, findAllId } from "@/api/org-dept";
export default {
  // props: ["companyId", "storeId"],
  props: {
    companyId: {
      // type: String
    },
    storeId: {
      // type: String
    },
    companyLabel: {
      type: String,
      default: '公 司'
    },
    storeLabel: {
      type: String,
      default: '门 店'
    }
  },
  components: {
    MDepartment
  },
  data() {
    return {
      companys: [{ name: "所有项", id: "" }],
      storeOptions: [],
      ccompanyId: this.companyId,
      cstoreId: this.storeId,
      // show: true,
      // parentId: null
    };
  },
  watch: {
    companyId(val){
      this.ccompanyId = val
    },
    storeId(val){
      if (val.length !== 0) {
        this.cstoreId = val.split('.').map(item => Number(item))
      }
    },
    ccompanyId(val){
      this.outlet(val)
      if(this.companyId == val)
      return
      this.$emit("update:companyId", val)
    },
    cstoreId(val){
      if(this.storeId[0] == val.join('.'))
      return
      // const editId = this.$store.getters.editId

      if(val.length === 0) {
        this.$emit("update:storeId", String(val))
        
      }else {
        // if(editId == 1){
          this.$emit("update:storeId", val.join('.'))
        // }
      }
    }
  },
  methods: {
    findCompanyByParentId() {
      find({ parentId: 10000 }).then(res => {
        let { code, body } = res;
        if (code == 1000) {
          this.companys = [{ name: "所有项", id: "" }, ...body];
        }
      });
    },
    /*
     * 通过公司查找门店
     */
    outlet(id) {
      if(!id){
        this.storeOptions = []
        return 
      }
      findAllId({ parentId: id }).then(res => {
        this.storeOptions = res.body.map(o => {
          return {
            value: o.id,
            label: o.name,
            children: o.children.map(j => {
              return {
                value: j.id,
                label: j.name
              };
            })
          };
        });
      });
    },
    // setCompanyId(val) {
    //   this.parentId = val[1] ? val[1] : null;
    //   this.$emit("update:companyId", val[val.length - 1]);
    //   this.$emit("update:storeId", "");
    // },
    // setStoreId(val) {
    //   let storeId = val[0] ? (val[1] ? `${val[0]}.${val[1]}` : val[0]) : "";
    //   this.$emit("update:storeId", storeId);
    // }
  },
  mounted(){
    this.findCompanyByParentId()
  }
};
</script>

<style scoped>
div {
  display: inline;
}
</style>
