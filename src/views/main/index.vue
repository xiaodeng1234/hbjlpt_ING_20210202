<template>
  <div class="main_wrap">
    <header-bar></header-bar>
    <div class="main_wrap_containner">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Main"
  };
</script>

<style lang="scss">
@import './index.scss';
</style>
