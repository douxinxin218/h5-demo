<template>
  <div id="app">
    <!-- <router-link to="/home">111</router-link> -->

    <router-view></router-view>

  </div>
</template>
<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
}
</style>
