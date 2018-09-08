<template>
  <div id="profile-home">
    <div class="apartments">
      <add-apartment v-if="adding" v-on:closeComponent="closeAdd"></add-apartment>

      <span v-if="apartments.error" class="text-danger">ERROR: {{apartments.error}}</span>
      <div v-if="apartments.items">
        <div v-for="apartment in apartments.items" :key="apartment._id">
          <apartment-details v-if="!adding" :apartment="apartment" :deleting="deleting" v-on:selected="selecting" v-on:close="closed"></apartment-details>
        </div>
      </div>
      <!-- <button id="create-new" v-if="!adding" v-on:click="initCreateNew">+ Add New</button> -->
    </div>
    <div class="notifications" v-if="!isSelecting && !adding">
      <h3>Upcoming Due Dates:</h3>
      <div class="due-date-container">
        <table>
        <tr>
          <th>Apartment</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Remarks</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
        <tr v-for="bill in bills.items" v-if="isNearDueDate(bill.duedate)" :key="bill._id" class="center">
          <td>
            {{bill.apartmentName}}
          </td>
          <td>
            <span v-if="parseInt(bill.type) === 0">Rent</span>
            <span v-if="parseInt(bill.type) === 1">Water</span>
            <span v-if="parseInt(bill.type) === 2">Electricity</span>
            <span v-if="parseInt(bill.type) === 3">Misc</span>
          </td>
          <td>{{bill.amount}}</td>
          <td>{{bill.remarks}}</td>
          <td>{{bill.duedate}}</td>
          <td>
            <span v-if="bill.paid === false"><button class="mark-as-paid" v-on:click="markAsPaid(bill._id)">Mark as Paid</button></span>
            <span v-else>Paid</span>
          </td>
        </tr>
      </table>
      </div>
    </div>
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
      adding: false,
      isSelecting: false
    }
  },
  computed: {
    ...mapState({
      account: state => state.account,
      apartments: state => state.apartments.all,
      bills: state => state.bills.all
    })
  },
  created () {
    console.log('trying to create Manager Home')
    this.getAllApartment()
    this.getAllBills()
    console.log('created Manager Home')
  },
  methods: {
    ...mapActions('apartments', {
      getAllApartment: 'getAll',
      deleteApartment: 'delete'
    }),
    ...mapActions('bills', {
      getAllBills: 'getAll',
      changeStatus: 'changeStatus'
    }),
    initCreateNew () {
      this.adding = true
    },
    closeAdd () {
      this.adding = false
      this.$router.go()
    },
    selecting () {
      this.isSelecting = true
    },
    closed () {
      this.isSelecting = false
    },
    markAsPaid (id) {
      console.log(id)
      this.$router.go()
      this.changeStatus(id)
    },
    isNearDueDate (date) {
      // Uncomment code below to implement 2 days before due date notification
      // var dueDate = new Date(date)
      // var today = new Date()
      // var timeDiff = Math.abs(dueDate.getTime() - today.getTime())
      // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
      // return (today.getTime() - dueDate.getTime() > 0) || diffDays < 2

      // Always returns true to show all bills for demo purposes, comment to use 2 days before due notification
      return true
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

.apartments {
  position: fixed;
  height: 60%;
  max-height: 60%;
  width: 100%;
  max-width: 400%;
  overflow-y: scroll;
}

.notifications {
  position: fixed;
  width: 100%;
  height: 30%;
  bottom: 0px;
  background: #c5c9cd;
  border-top: 5px solid green;
  overflow-y: scroll;
}

.notifications h3 {
  float: left;
  margin-left: 20px;
  font-size: 15px;
  color: green;
}

.due-date-container {
  background: white;
  min-height: 81%;
  margin-top: 42px;
  border-top: 1px solid green;
}

.notifications table {
  font-size: 12px;
  margin: 0px;
  padding: 5px;
  text-align: center;
  width: 100%;
}

.notifications table th, .notifications table td {
  border: 1px solid green;
  text-align: center;
}

.notifications table td button {
  font-size: 12px;
  margin-top: 0px;
  height: 18px;
  width: 100%;
  border-radius: 2px;
}
</style>