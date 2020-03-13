<template>
  <div>
    <Layout>
      <template v-slot:header>
        <BaseHeader />
      </template>
      <template v-slot:aside>
        <BaseMenu />
      </template>
      <template v-slot:main>
        <router-view />
      </template>
      <template v-slot:footer>
        <BaseFooter />
      </template>
    </Layout>
  </div>
</template>
<script>
import Layout from '../../layout/index'
import BaseHeader from './components/header'
import BaseMenu from './components/aside'
import BaseFooter from './components/footer'

export default {
  components: {
    Layout,
    BaseHeader,
    BaseMenu,
    BaseFooter
  }
}
</script>
<style scoped>

</style>