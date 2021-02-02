<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: "App"
  };
</script>

<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
  }
  /* 防止WPS阻挡弹框区域 */
  .vm--overlay {
    z-index: 90000 !important;
  }
  .vm--modal {
    z-index: 90000 !important;
  }

</style>
