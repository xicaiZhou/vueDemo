<template>
  <div>
    <template v-if="isstore && !parentId">
      <el-select v-model="value" placeholder="请选择">
      </el-select>
    </template>
    <el-cascader
      v-else
      v-model="superior"
      :props="newProps"
    ></el-cascader>
  </div>
</template>

<script>
import { find } from '@/api/org-dept'
export default {
  props:['id', 'parentId', 'isstore'],
  data() {
    const parentId = this.parentId
    let superior = this.id
    if(this.isstore){
      superior = this.id.split('.')
    }
    return {
      newProps: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          let {level} = node
          let form = {
            parentId
          };
          if (node.data && node.data.id) form.parentId = node.data.id;
          find(form).then(res => {
            if (res && res.body && res.body.length > 0) {
              let data = [];
              res.body.forEach(element => {
                data.push({
                  id: element.id,
                  value: element.id,
                  label: element.name,
                  leaf: level < 1 ? 0 : 1
                });
              });
              resolve(data);
            }
          });
          return;
        }
      },
      show: true,
      superior,
      value: ''
    };
  },
  watch:{
    id(val){
      // this.$emit('setId', val)
    },
    superior(val){
      // this.$emit('update:id', val[val.length - 1])
      this.$emit('setId', val)
    }
  },
  methods:{}
};
</script>
