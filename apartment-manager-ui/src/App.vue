<template>
  <div id="app">
    <link rel="stylesheet" href="./assets/styles/global.css">
    <main>
      <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'app',
  computed: {
    ...mapState({
      alert: state => state.alert
    })
  },
  methods: {
    ...mapActions({
      clearAlert: 'alert/clear'
    })
  },
  watch: {
    $route (to, from) {
      // clear alert on location change
      this.clearAlert()
    }
  }
}
</script>

<style>

body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495e;
  color: #ffffff;
  border-bottom: 3px solid green;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: 0.02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
  float: right;
  margin-left: 10px;
}

.link:hover {
  cursor: pointer;
  text-decoration: underline;
}

.alert {
  position: fixed;
  width: 100%;
  opacity: .8;
  height: 19px;
  color: white;
  font-size: 13px;
  padding: 5px;
}

.alert-danger {
  background: #ff6363;
}

.alert-success {
  background: green;
}
</style>
