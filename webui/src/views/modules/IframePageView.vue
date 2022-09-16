<template>
  <div class="h-full">
    <iframe  :id="id" :src="url" frameborder="0" width="100%" height="100%" scrolling="auto" ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: '',
      id: ''
    }
  },
  created() {
    this.goUrl()
  },
  updated() {
    this.goUrl()
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.goUrl()
    }
  },
  methods: {
    goUrl() {
      const url = this.$route.meta.link
      const id = this.$route.path
      this.id = id
      // url = "http://www.baidu.com"
      console.log('------url------' + url)
      if (url !== null && url !== undefined) {
        this.url = url
        // window.open(this.url);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
