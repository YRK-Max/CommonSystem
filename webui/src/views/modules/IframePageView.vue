<template>
  <div v-if="loading" style="color: #426cb9" class="h-full w-full flex items-center justify-center bg-white overflow-hidden">
    <div>
      <YIcon class="loading" icon="yiconloading" color="#426cb9" :size="25" />
      加载中....
    </div>
  </div>
  <div v-show="!loading" id="iframeDiv" class="h-full w-full overflow-hidden"></div>
</template>

<script>
import YIcon from '@/components/YIcon.vue'
export default {
  data() {
    return {
      url: '',
      id: '',
      iframeDiv: undefined,
      loading: false
    }
  },
  mounted() {
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
      const _this = this
      this.loading = true
      if (this.iframeDiv === undefined) {
        this.iframeDiv = document.getElementById('iframeDiv')
      }
      this.iframeDiv.innerHTML = ''
      const url = this.$route.meta.link
      var iframe = document.createElement('iframe')
      iframe.classList.add('h-full')
      iframe.classList.add('w-full')
      iframe.src = url
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', function() {
          _this.loading = false
        })
      } else {
        iframe.onload = function() {
          _this.loading = false
        }
      }
      this.iframeDiv.appendChild(iframe)
    }
  },
  components: { YIcon }
}
</script>

<style lang="scss" scoped>
.loading{
  animation:load 1.1s infinite linear;
}
@keyframes load{
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}
</style>
