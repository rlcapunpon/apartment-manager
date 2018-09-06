<template>
  <div v-if="occupied" class="tenant">
    <span>Tenant Details</span>
    <div v-for="tenant in tenants.items" class="tenant-details" :key="tenant._id">
      <span>Name:</span><span class="value">{{tenant.name}}</span><br>
      <span>Contact No:</span><span class="value">{{tenant.contact}}</span><br>
      <span>Email:</span><span class="value">{{tenant.email}}</span><br>
      <span>Headcount:</span><span class="value">{{tenant.headcount}}</span><br>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'TenantDetails',
  props: ['apartmentId', 'occupied'],
  data () {
    return {
      deleted: false
    }
  },
  created () {
    console.log('trying to fetch tenant details from server')
    this.getByApartmentId(this.apartmentId)
    console.log('created Tenant Details')
  },
  computed: {
    ...mapState({
      tenants: state => state.tenants.all
    })
  },
  methods: {
    ...mapActions('tenants', {
      getByApartmentId: 'getByApartmentId',
      deleteTenant: 'delete'
    })
  }
}
</script>

<style>
.tenant {
  background: #dedede;
  width: 90%;
  margin-left: 4%;
  border-radius: 5px;
  text-align: left;
  padding: 1%;
}

.tenant span {
  color: green;
}

.tenant-details span {
  font-size: 12px;
  color: black;
}

.value {
  margin-left: 10px;
}
</style>