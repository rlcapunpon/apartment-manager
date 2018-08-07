<template>
  <div class="welcome">
    <img src="../assets/project-name.png" id="logo" alt="Apartment Manager Logo">
    <h3>{{ msg }}</h3>
    <login></login>
  </div>
</template>

<script>
import Login from './Login.vue'
export default {
  name: 'Welcome',
  data () {
    return {
      msg: 'Welcome!',
      mockAccount: {
        username: 'admin',
        password: 'admin'
      }
    }
  },
  methods: {
    gotoLogin () {
      console.log('going to login')
      this.$router.replace({ name: 'login' })
    }
  },
  components: {
    login: Login
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style>
h1, h2, h3 {
  font-weight: normal;
  color: green;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

login {
  width: auto;
}

a {
  color: #35495e;
}

#logo {
  width: 420px;
  margin-top: 100px;
}

.link:hover {
  cursor: pointer;
  text-decoration: underline;
}
</style>
