<template>
  <div id="profile-home">
  <add-apartment v-if="adding" v-on:closeComponent="closeAdd"></add-apartment>

  <span v-if="apartments.error" class="text-danger">ERROR: {{apartments.error}}</span>
  <div v-if="apartments.items">
    <div v-for="apartment in apartments.items" :key="apartment._id">
      <apartment-details v-if="!adding" :apartment="apartment" :deleting="deleting"></apartment-details>
    </div>
  </div>
  <button id="create-new" v-if="!adding" v-on:click="initCreateNew">+ Add New</button>

  </div>
</template>

<script>
import AddApartment from './AddApartment.vue'
import ApartmentDetails from './ApartmentDetails.vue'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ManagerHome',
  props: ['deleting'],
  data () {
    return {
      adding: false
    }
  },
  computed: {
    ...mapState({
      account: state => state.account,
      apartments: state => state.apartments.all
    })
  },
  created () {
    console.log('trying to create Manager Home')
    this.getAllApartment()
    console.log('created Manager Home')
  },
  methods: {
    ...mapActions('apartments', {
      getAllApartment: 'getAll',
      deleteApartment: 'delete'
    }),
    initCreateNew () {
      this.adding = true
    },
    closeAdd () {
      this.adding = false
      this.$router.go()
    }
  },
  components: {
    'add-apartment': AddApartment,
    'apartment-details': ApartmentDetails
  }
}
</script>

<style>

#create-new {
  float: left;
  margin: 10px;
  height: 210px;
  width: 180px;
  background: #5a995a;
  border: 1px solid gray;
  border: none;
  color: white;
  border-radius: 5px;
  box-shadow: 1px 3px 16px  gray;
}

#create-new:hover {
  cursor: pointer;
  background: #4e892a;
}

</style>