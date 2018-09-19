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
      <div>
        <h3>Upcoming Due Dates:</h3> 
        <div>
          <span>Filter by: </span>
          <button v-bind:class="{ activeFilter: filter === 0 }" v-on:click="setFilter(0)">Show All</button>
          <button v-bind:class="{ activeFilter: filter === 3 }" v-on:click="setFilter(3)">Total</button>
          <button v-bind:class="{ activeFilter: filter === 1 }" v-on:click="setFilter(1)">Paid</button>
          <button v-bind:class="{ activeFilter: filter === 2 }" v-on:click="setFilter(2)">Unpaid</button>
          <button v-bind:class="{ activeFilter: filter === 4 }" v-on:click="setFilter(4)">Notify</button>
        </div>
      </div>
      <div class="due-date-container">
        <table>
        <tr>
          <th>Apartment&nbsp;<input type="text" v-model="apartmentNameFilter" placeholder="Filter"></th>
          <th>Type&nbsp;
            <select v-if="filter !== 3" v-model="typeFilter">
            <option value=4>All</option>
            <option value=0>Rent</option>
            <option value=1>Water</option>
            <option value=2>Electricity</option>
            <option value=3>Miscellaneous</option>
          </select>
          </th>
          <th>Amount</th>
          <th v-if="filter !== 3">Remarks</th>
          <th v-if="filter !== 3">Due Date</th>
          <th v-if="filter === 1">Date Paid</th>
          <th>Status</th>
        </tr>
        <tr v-for="bill in bills.items" v-bind:class="{ overdue: isOverdue(bill.duedate) }" v-if="(isNearDueDate(bill.duedate) && isFiltered(bill.apartmentName, bill.type, bill.paid)) || filter === 3" :key="bill._id" class="center">
          <td>
            {{bill.apartmentName}}
          </td>
          <td>
            <span v-if="parseInt(bill.type) === 0">Rent</span>
            <span v-else-if="parseInt(bill.type) === 1">Water</span>
            <span v-else-if="parseInt(bill.type) === 2">Electricity</span>
            <span v-else-if="parseInt(bill.type) === 3">Misc</span>
            <span v-else>Total</span>
          </td>
          <td>{{bill.amount}}</td>
          <td v-if="filter !== 3">{{bill.remarks}}</td>
          <td v-if="filter !== 3">{{bill.duedate}}</td>
          <td v-if="filter === 1">{{bill.datePaid}}</td>
          <td>
            <span v-if="bill.paid === false && filter !== 3 "><button class="mark-as-paid" v-on:click="markAsPaid(bill._id)">Mark as Paid</button></span>
            <span v-else-if="filter === 3"><button class="mark-as-paid" v-on:click="markTotalAsPaid(bill.apartmentId)">Mark Total as Paid</button></span>
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
      isSelecting: false,
      filter: 0,
      apartmentNameFilter: '',
      typeFilter: 4,
      totaled: []
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
      changeStatus: 'changeStatus',
      markAllAsPaid: 'markAllAsPaid'
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
      this.$router.go()
      this.setFilter(this.filter)
    },
    markAsPaid (id) {
      console.log(id)
      this.$router.go()
      this.changeStatus(id)
    },
    isNearDueDate (date) {
      if (this.filter === 4) {
        var dueDate = new Date(date)
        var today = new Date()
        var timeDiff = Math.abs(dueDate.getTime() - today.getTime())
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
        return (today.getTime() - dueDate.getTime() > 0) || diffDays <== 2
      } else {
        return true
      }
    },
    isOverdue (date) {
      var dueDate = new Date(date)
      var today = new Date()
      return (today.getTime() - dueDate.getTime()) > 0
    },
    setFilter (value) {
      this.filter = value
      if (parseInt(value) === 3) {
        console.log('trying to summarize')
        this.summarize()
      } else {
        this.getAllBills()
      }
      console.log(this.filter)
    },
    isFiltered (name, type, paid) {
      if (this.isAdvancedFilteredName(name) && this.isAdvancedFilteredType(type)) {
        console.log('filter passed')
        if (this.filter === 0) {
          return true
        } else if (this.filter === 1 && paid) {
          return true
        } else if (this.filter === 2 && !paid) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    isAdvancedFilteredName (name) {
      if (name === undefined) {
        return true
      }
      if (this.apartmentNameFilter === '') {
        return true
      }
      if (name.includes(this.apartmentNameFilter)) {
        return true
      } else {
        console.log('returning false for name')
        return false
      }
    },
    isAdvancedFilteredType (type) {
      if (parseInt(this.typeFilter) === 4) {
        return true
      }
      if (parseInt(type) === parseInt(this.typeFilter)) {
        return true
      } else {
        console.log('returning false for type')
        return false
      }
    },
    summarize () {
      var summary = this.bills.items
      this.totaled = []
      for (var i = 0; i < summary.length; i++) {
        if (!summary[i].paid) {
          this.addToTotaled(summary[i])
        }
      }
      this.bills.items = this.totaled
    },
    addToTotaled (bill) {
      var found = false
      for (var i = 0; i < this.totaled.length; i++) {
        if (bill.apartmentId === this.totaled[i].apartmentId) {
          found = true
          this.totaled[i].amount += parseInt(bill.amount)
          console.log('found adding..' + ' total: ' + this.totaled[i].amount)
          break
        }
      }
      if (found === false) {
        console.log('not found.. creating')
        var item = {}
        item.apartmentName = bill.apartmentName
        item.type = 4
        item.amount = parseInt(bill.amount)
        console.log('total at creating: ' + item.amount)
        item.apartmentId = bill.apartmentId
        item.paid = false
        this.totaled.push(item)
      }
    },
    markTotalAsPaid (apartmentId) {
      console.log(apartmentId)
      this.$router.go()
      this.markAllAsPaid(apartmentId)
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

.activeFilter {
  background: #565555;;
}

.activeFilter:hover {
  background: #565555;;
}

.due-date-container {
  background: white;
  min-height: 81%;
  margin-top: 10px;
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

.overdue {
  background: red;
  color: white;
}

th input {
  text-align: center;
}
</style>