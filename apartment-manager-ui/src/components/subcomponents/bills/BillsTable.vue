<template>
  <div class="bills">
    <span>Monthly Bills</span>
    <div class="bills-list">
      <table>
        <tr>
          <th>Type</th>
          <th>Amount</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
        <tr v-for="bill in bills.items" :key="bill._id" class="center">
          <td>
            <span v-if="parseInt(bill.type) === 0">Rent</span>
            <span v-if="parseInt(bill.type) === 1">Water</span>
            <span v-if="parseInt(bill.type) === 2">Electricity</span>
            <span v-if="parseInt(bill.type) === 3">Misc</span>
          </td>
          <td>{{bill.amount}}</td>
          <td>{{bill.duedate}}</td>
          <td>
            <span v-if="bill.paid === false"><button class="mark-as-paid" v-on:click="markAsPaid(bill._id)">Mark as Paid</button></span>
            <span v-else>Paid</span>
          </td>
        </tr>
      </table>
    </div>
    <div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'BillsTable',
  props: ['apartmentId'],
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
      bills: state => state.bills.all
    })
  },
  methods: {
    ...mapActions('bills', {
      getByApartmentId: 'getByApartmentId',
      deleteBill: 'delete',
      changeStatus: 'changeStatus'
    }),
    markAsPaid (id) {
      this.changeStatus(id)
      this.$emit('updated')
    }
  }
}
</script>

<style>
.bills {
  background: #dedede;
  width: 90%;
  margin-left: 4%;
  margin-top: 5px;
  border-radius: 5px;
  text-align: left;
  padding: 1%;
}

.center {
  text-align: center;
}

.bills span {
  color: green;
}

.bills table {
  font-size: 12px;
  color: black;
}

.bills table tr, .bills table th {
  border: 1px solid;
}

.bills table {
  width: 100%;
  margin: 0px;
  margin-top: 10px;
}

.no-bills-label {
  font-size: 12px;
  margin: 5px;
}

.mark-as-paid {
  padding: 1px;
  min-width: 78px;
  font-size: 9px;
  margin: 1px;
  border-radius: 2px;
  height: 14px;
  width: 70px;
}
</style>