<template>
  <div >
    <van-button type="default" @click="test">接口测试</van-button>
    <span>{{aaa}}</span>
    <van-nav-bar title="二维码扫描进件" right-text="重置" @click-right="onClickRight" />
    <van-form @submit="onSubmit" >
      <div class="title">
       <span >代理人信息</span>
      </div>
      <van-field
        type="tel"
        v-model="dlrTel"
        name="dlrTel"
        label="代理人手机号"
        placeholder="请填写代理人手机号"
        :rules="[{ required: true, message: '请填写代理人手机号'}]"
      />
      <div class="title">
         <span >业务类型</span>
      </div>
      <van-action-sheet v-model="showAction1" :actions="actions1" @select="onSelect1" />

      <van-field
        readonly
        clickable
        v-model="productName"
        name="productName"
        label="业务类型"
        placeholder="请选择业务类型"
        @click="showAction1 = true"
        :rules="[{ required: true, message: '请选择业务类型' }]"
      />
      <div class="title">
         <span >基本信息</span>
      </div>
      <van-field
        v-model="customerName"
        name="customerName"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />

      <van-field
        :value="customerIdCardNumber"
        name="customerIdCardNumber"
        label="身份证"
        placeholder="请填写身份证号码"
        :rules="[{ required: true, message: '请填写身份证号码' }]"
        @touchstart.native.stop="showIDKeyBoard = true"
      />
      <van-number-keyboard
        v-model="customerIdCardNumber"
        :show="showIDKeyBoard"
        close-button-text="完成"
        extra-key="X"
        @blur="showIDKeyBoard = false"
      />
      <van-field
        readonly
        clickable
        v-model="provinceCityName"
        name="provinceCityName"
        label="所在城市"
        placeholder="请选择所在城市"
        @click="showAddress = true"
        :rules="[{ required: true, message: '请选择所在城市' }]"
      />

      <van-field
        type="tel"
        v-model="customerPhoneNumber"
        name="customerPhoneNumber"
        label="手机号"
        placeholder="请填写手机号"
        :rules="[{ required: true, message: '请填写手机号' }]"
      />
      <div class="title">
         <span >车辆信息</span>
      </div>
      <van-field
        readonly
        clickable
        v-model="carBrand"
        name="carBrand"
        label="车辆品牌"
        placeholder="请选择车辆品牌"
        @click="goSelectCarBrand"
        :rules="[{ required: true, message: '请选择车辆品牌' }]"
      />
      <van-field
        readonly
        clickable
        v-model="carSeries"
        name="carSeries"
        label="车系"
        placeholder="请选择车系"
        @click="goSelectCarSeries"
        :rules="[{ required: true, message: '请选择车系' }]"
      />
      <van-field
        type="number"
        v-model="carAge"
        name="carAge"
        label="车龄（年）"
        placeholder="请填写车龄"
        :rules="[{ required: true, message: '请填写车龄' }]"
      />

      <van-field
        type="number"
        v-model="carMileage"
        name="carMileage"
        label="公里数（公里）"
        placeholder="请填写公里数"
        :rules="[{ required: true, message: '请填写公里数' }]"
      />
      <div class="title">
         <span >贷款信息</span>
      </div>
      <van-field
        type="digit"
        v-model="loanAmount"
        name="loanAmount"
        label="贷款金额（元）"
        placeholder="请填写公里数"
        :rules="[{ required: true, message: '请填写贷款金额' }]"
      />
      <van-field
        readonly
        clickable
        type="digit"
        v-model="loanTerm"
        name="loanTerm"
        label="贷款期限（月）"
        placeholder="请选择贷款期限"
        @click="showAction2 = true"
        :rules="[{ required: true, message: '请选择贷款期限' }]"
      />
      <van-action-sheet v-model="showAction2" :actions="actions2" @select="onSelect2" />

      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
      <van-popup v-model="showAddress" position="bottom" :style="{ height: '30%', width: '100%'}" get-container="body">
        <van-area
          :area-list="areaList"
          value = "340000"
          :columns-num="2"
          title="标题"
          confirm-button-text = "确定"
          @confirm = "onSelect3"
        />
      </van-popup>
    </van-form>

  </div>
</template>

<script>
import { Toast } from 'vant'
import {
  request
} from '../common/request'
 
export default {
  computed: {
    aaa () {
      // return '111'
      return this.$store.state.aaa
    }
  },
  data () {
    return {
      dlrTel: '',
      provinceCityName: '',
      /** 业务大类新车：2；二手车：3；车抵贷：4 */
      productId: '',
      productName: '',
      customerName: '', // 客户名称
      customerIdCardNumber: '', // 客户身份证ID
      customerPhoneNumber: '', // 客户手机号
      province: '', // 省
      provinceId: '', // 省ID
      city: '', // 市
      cityId: '', // 市ID
      carBrand: '', // 车辆品牌
      carBrandId: '', // 车辆品牌ID
      carSeries: '', // 车系
      carSeriesId: '', // 车系Id
      loanAmount: '', // 金额
      loanTerm: '', // 期限
      carAge: '', // 车龄
      carMileage: '', // 公里数

      // 选择框
      showAddress: false,
      showAction1: false,
      showAction2: false,
      showIDKeyBoard: false,
      actions1: [{ name: '新车' }, { name: '二手车' }, { name: '车抵贷' }],
      actions2: [{ name: '12' }, { name: '24' }, { name: '36' }],
      // 地区
      areaList: {
        province_list: {
          340000: '安徽省',
          360000: '江西省',
          440000: '广东省',
          500000: '重庆市',
          510000: '四川省'
        },
        city_list: {
          340100: '合肥市',
          340200: '芜湖市',
          340300: '蚌埠市',
          340400: '淮南市',
          340500: '马鞍山市',
          340600: '淮北市',
          340700: '铜陵市',
          340800: '安庆市',
          341000: '黄山市',
          341100: '滁州市',
          341200: '阜阳市',
          341300: '宿州市',
          341500: '六安市',
          341600: '亳州市',
          341700: '池州市',
          341800: '宣城市',
          360100: '南昌市',
          360700: '赣州市',
          360800: '吉安市',
          361100: '上饶市',
          440100: '广州市',
          440200: '韶关市',
          440300: '深圳市',
          440400: '珠海市',
          440500: '汕头市',
          440600: '佛山市',
          440700: '江门市',
          440800: '湛江市',
          440900: '茂名市',
          441200: '肇庆市',
          441300: '惠州市',
          441400: '梅州市',
          441500: '汕尾市',
          441600: '河源市',
          441700: '阳江市',
          441800: '清远市',
          441900: '东莞市',
          442000: '中山市',
          445100: '潮州市',
          445200: '揭阳市',
          445300: '云浮市',
          500100: '市辖区',
          510100: '成都市'
        }
      }
    }
  },
  watch: {
    productName (val) {
      if (val === '新车') {
        this.productId = '2'
      } else if (val === '二手车') {
        this.productId = '3'
      } else if (val === '车抵贷') {
        this.productId = '4'
      }

      console.log(this.productId)
    }
  },
  created () {
    this.getNumber()
  },
  methods: {
    test () {
      request({
        method: 'get',
        hasLoad: true,
        url: '/api/Joke/QueryJokeByTime?key=8a090c82e9c14648a36d7d0b0e90a7a6&page=2&rows=10&sort=asc&time=1418745237'
      }).then(res => {
        console.log(res)
      })
    },
    onSubmit (values) {
      console.log('submit', values)
      request({
        method: 'get',
        url: '',
        data: {}
      }).then(res => {
        console.log(res)
      })
    },
    onClickRight () {
      this.username = ''
      this.password = ''
      Toast('提示内容')
    },
    onSelect1 (item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.productName = item.name
      this.showAction1 = false
    },
    onSelect2 (item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      this.loanTerm = item.name
      this.showAction2 = false
    },
    onSelect3 (item) {
      this.provinceCityName = item[0].name + '-' + item[1].name
      this.province = item[0].name
      this.provinceId = item[0].code
      this.city = item[1].name
      this.cityId = item[1].code
      this.showAddress = false
    },
    goSelectCarBrand () {
      this.$router.push({
        name: 'CarBrand',
        params: {
          msg: '新车'
        }
      })
    },
    goSelectCarSeries () {
      this.$router.push({
        name: 'CarSeries',
        params: {
          msg: '新车'
        }
      })
    },
    getNumber () {
      this.carBrand = this.$route.query.number
    }
  },
  beforeRouteEnter (to, from, next) {
    console.log(this, 'beforeRouteEnter') // undefined
    console.log(to, '组件独享守卫beforeRouteEnter第一个参数')
    console.log(from, '组件独享守卫beforeRouteEnter第二个参数')
    console.log(next, '组件独享守卫beforeRouteEnter第三个参数')
    next(vm => {
      // 因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      console.log(vm) // 当前组件的实例
    })
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 对于一个带有动态参数的路径 /good/:id，在 /good/1 和 /good/2 之间跳转的时候，
    // 由于会渲染同样的good组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    console.log(this, 'beforeRouteUpdate') // 当前组件实例
    console.log(to, '组件独享守卫beforeRouteUpdate第一个参数')
    console.log(from, '组件独享守beforeRouteUpdate卫第二个参数')
    console.log(next, '组件独享守beforeRouteUpdate卫第三个参数')
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    console.log(this, 'beforeRouteLeave') // 当前组件实例
    console.log(to, '组件独享守卫beforeRouteLeave第一个参数')
    console.log(from, '组件独享守卫beforeRouteLeave第二个参数')
    console.log(next, '组件独享守卫beforeRouteLeave第三个参数')
    next()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  width: 100%;
  height: 35px;
  text-align: left;
  line-height: 35px;
  font-size: 15px;
  font-weight: bold;
  background-color: #eeeeee;
}
span {
  padding-left: 12px;
}
.loading{
  position: absolute;
}
</style>
