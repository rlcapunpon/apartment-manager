<template>
<div class="home">
  <header>
    <img src="../assets/rsa-clear-icon.png" id="logo-top" alt="My Apartment Logo">

    <div id="new" v-if="deleting" class="left" v-on:click="hideDeleteOptions">+</div>
    <div id="delete" v-if="!deleting" class="left" v-on:click="showDeleteOptions">-</div>
    <span id="logout" class="link" v-on:click="logout">Logout</span>
    <span id="separator">|</span>
    <span id="add" class="link" v-on:click="showAddModal">New Apartment</span>
  </header>

<div v-if="adding" class="overlay-holder">
  <div class="right-panel overlay-view">
    <add-apartment v-on:closeComponent="closeAddModal" class="center-view" ></add-apartment>
  </div>
</div>
  <div v-if="!adding" class="right-panel main-view">
    <manager-home class="full-view" v-if="activeTab === 1" :deleting="deleting"></manager-home>
  </div>
</div>
</template>

<script>
import ManagerHome from './subcomponents/profile/ManagerHome.vue'
import AddApartment from './subcomponents/profile/AddApartment.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState({
      account: state => state.account,
      users: state => state.users.all
    })
  },
  created () {
    // this.getAllUsers()
  },
  data () {
    return {
      activeTab: 1,
      adding: false,
      deleting: false
    }
  },
  methods: {
    ...mapActions('users', {
    }),
    logout () {
      this.$router.replace({ name: 'login' })
    },
    select (index) {
      this.activeTab = index
    },
    showAddModal () {
      this.deleting = false
      this.adding = true
      // console.log('showAddModal called.')
    },
    closeAddModal () {
      this.adding = false
    },
    showDeleteOptions () {
      this.deleting = true
    },
    hideDeleteOptions () {
      this.deleting = false
    }
  },
  components: {
    'manager-home': ManagerHome,
    'add-apartment': AddApartment
  }
}
</script>

<style>
#logout, #separator {
  size: 10px;
  color: green;
  font-size: 15px;
  margin-top: 2px;
}

#add {
  size: 10px;
  color: green;
  font-size: 15px;
  margin-top: 2px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #c5c9cd;
  color: #ffffff;
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

.side-nav {
  position: absolute;
  margin-top: 10px;
  width: 10%;
  border-right: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
  text-align: left;
}

.tab {
  width: 100%;
  float: left;
  position: relative;
  border: 1px solid white;
  padding-bottom: 10px;
  padding-top: 10px;
}

.tab:hover, .tab.selected {
  background: #4e892a;
  border-color: #afc87d;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  padding: 10px;
}

#logo-top {
  float: left;
  height: 50px;
  margin-top: 3px;
  margin-left: 3px;
}

button.create-new { 
  float: right;
  margin: 10px;
  height: 32px;
  width: 120px;
  background: #4e892a;
  border: none;
  color: white;
  border-radius: 5px;
}

button.create-new:hover {
  cursor: pointer;
  background: #5caa2c
}

.right {
  float: right;
}

.left {
  float: left;
}

.full-view {
  widows: 100%;
  margin-top:1%;
}

#new {
  background: green;
  width: 19px;
  height: 18px;
  margin-top: 16px;
  margin-left: 17px;
  border-radius: 5px;
  font-size: 16px;
  float: right;
}

#new:hover {
  color: #afafaf;
  cursor: pointer;
}

#delete {
  background: green;
  width: 19px;
  height: 18px;
  margin-top: 16px;
  margin-left: 17px;
  border-radius: 5px;
  font-size: 16px;
  float: right;
}

#delete:hover {
  color: pink;
  cursor: pointer;
}

.overlay-holder {
  position: absolute;
  width: 100%;
  height: 100%;
  background: darkgreen;
  opacity: 0.8;
  top: 0;
}

.overlay-view {
  background: white;
  width: 50%;
  margin-left: 25%;
  border-radius: 12px;
  opacity: 1;
  margin-top: 100px;
  padding: 17px;
}
</style>
